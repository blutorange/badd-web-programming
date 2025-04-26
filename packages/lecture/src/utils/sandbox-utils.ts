import type { ColorMode } from "@docusaurus/theme-common";
import { transform as babelTransform } from "@babel/standalone";

import { useCallback, useEffect, useState, type Dispatch } from "react";
import { compile as svelteCompile } from "svelte/compiler";

import { getConstructorNames, isPromise } from "./lang-utils";
import { ImportMap } from "./import-map";

import { TextReader, BlobWriter, ZipWriter } from "@zip.js/zip.js";

export type Pending<T> =
  | { readonly loading: true; readonly value?: undefined }
  | { readonly loading: false; readonly value: T };

export type AsyncResultHandler = (results: JsResult[]) => void;

export type CodeType = "ts" | "js" | "html" | "css";

export type JsResultType =
  | "console-debug"
  | "console-log"
  | "console-error"
  | "console-warn"
  | "error"
  | "result";

type ResourceFiles = Record<"html" | "css" | "js", string>;

export interface JsResult {
  type: JsResultType;
  value: string;
}

export interface Serializer<T> {
  serialize: (v: T) => string;
  deserialize: (v: string) => T;
}

interface TranspileResult {
  js: string;
  css: string;
  html: string;
  importmap: string;
  type: "script" | "module";
}

export function nonPending<T>(value: T): Pending<T> {
  return { loading: false, value };
}

/**
 * Prepares the HTML for download.
 * Links the JS and CSS with the HTML, i.e. adds a link / script tag.
 * @param html HTML content.
 * @returns The prepared HTML content.
 */
function prepareHtmlForDownload(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const script = document.createElement("script");
  script.src = "./script.js";

  const link = document.createElement("link");
  link.href = "./style.css";
  link.rel = "stylesheet";

  const metaEnc = document.createElement("meta");
  metaEnc.setAttribute("charset",  "utf-8");

  doc.head.prepend(metaEnc);
  doc.head.append(link);
  doc.body.append(script);

  return `<!DOCTYPE html>\n${doc.documentElement.outerHTML}`;
}


export function prepareHtmlContent(
  html: string,
  css: string,
  js: string,
  colorMode: ColorMode,
): string {
  const parser = new DOMParser();
  const transpiled = transpileResources({ css, js, html });

  const doc = parser.parseFromString(transpiled.html, "text/html");

  {
    const importMap = document.createElement("script");
    importMap.type = "importmap";
    importMap.textContent = JSON.stringify(ImportMap, null, 2);
    doc.head.appendChild(importMap);
  }

  if (transpiled.importmap) {
    const importMap = document.createElement("script");
    importMap.type = "importmap";
    importMap.textContent = transpiled.importmap;
    doc.head.appendChild(importMap);
  }

  // Tell the browser to use its default user-agent styles for dark mode 
  if (colorMode === "dark") {
    const meta = document.createElement("meta");
    meta.name = "color-scheme";
    meta.content = "dark";
    doc.head.append(meta);
  }
  doc.documentElement.dataset.theme = colorMode;

  if (transpiled.css.length > 0) {
    const styleCustom = document.createElement("style");
    styleCustom.textContent = transpiled.css;
    doc.head.appendChild(styleCustom);
  }

  if (transpiled.js.length > 0) {
    const scriptCustom = document.createElement("script");
    if (transpiled.type === "module") {
      scriptCustom.type = "module";
      scriptCustom.defer = true;
      scriptCustom.textContent = transpiled.js;
    } else {
      scriptCustom.textContent = `document.addEventListener("readystatechange", function(){if(document.readyState!=="complete")return;\n${transpiled.js}\n;})`;
    }
    doc.body.appendChild(scriptCustom);
  }

  return doc.documentElement.outerHTML;
}

export const PendingSerializer: Serializer<Pending<string>> = {
  deserialize: (value) => ({ loading: false, value }),
  serialize: (value) => (value.loading ? "" : value.value),
};

export const BooleanSerializer: Serializer<boolean> = {
  deserialize: (v) => v === "true",
  serialize: (v) => (v ? "true" : "false"),
};

export const IntegerSerializer: Serializer<number> = {
  deserialize: (v) => {
    const parsed = Number.parseInt(v);
    return Number.isNaN(parsed) ? 0 : parsed;
  },
  serialize: (v) => v.toString(10),
};

export default function useLocalStorage(
  key: string,
  initialValue: string,
): [string, Dispatch<string>] {
  const [value, setValue] = useState(
    () => window.localStorage.getItem(key) ?? initialValue,
  );

  const setItem = useCallback<(newValue: string) => void>(
    (newValue) => {
      setValue(newValue);
      window.localStorage.setItem(key, newValue);
    },
    [key],
  );

  useEffect(() => {
    const newValue = window.localStorage.getItem(key);
    if (value !== newValue) {
      setValue(newValue ?? initialValue);
    }
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: Initial value should be applied only once
  const handleStorage = useCallback(
    (event: StorageEvent) => {
      if (event.key === key && event.newValue !== value) {
        setValue(event.newValue || initialValue);
      }
    },
    [value],
  );

  useEffect(() => {
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [handleStorage]);

  return [value, setItem];
}

/** Same as useLocalStorage, but lets you use non-string types. */
export function useMappedLocalStorage<T>(
  key: string,
  initial: T,
  serializer: Serializer<T>,
): [T, React.Dispatch<T>] {
  const initialString = serializer.serialize(initial);
  const [value, setValue] = useLocalStorage(key, initialString);
  const setNewValue = useCallback<(v: T) => void>(
    (v) => setValue(serializer.serialize(v)),
    [serializer.serialize, setValue],
  );
  return [serializer.deserialize(value), setNewValue];
}

export async function downloadHtml(html: string, css: string, js: string): Promise<void> {
  try {
    const linkedHtml = prepareHtmlForDownload(html);
    const zipWriter = new ZipWriter(new BlobWriter());
    zipWriter.add("page.html", new TextReader(linkedHtml));
    zipWriter.add("style.css", new TextReader(css));
    zipWriter.add("script.js", new TextReader(js));
    const content = await zipWriter.close();
    const a = document.createElement("a");
    const url = URL.createObjectURL(content);
    try {
      a.style.display = "none";
      a.target = "_blank";
      a.download = "page.zip";
      a.type = "application/zip";
      a.href = url;
      document.body.append(a);
      a.click();
      // Hack to cleanup the allocated memory. We can't do it immediately
      // as that might invalidate the URL before the file has finished downloading.
      // Unfortunately, there doesn't seem to be an API for downloading files yet...
      setTimeout(() => {
        a.remove();
        URL.revokeObjectURL(url);
      }, 20000);
    } catch (e) {
      a.remove();
      URL.revokeObjectURL(url);
      throw e;
    }
  } catch (e) {
    console.error("Unable to create / download ZIP file with contents", e);
  }
} 

export function useCode(
  keyPrefix: string,
  type: CodeType,
  initial: string,
): [current: Pending<string>, set: Dispatch<string>, reset: () => void] {
  const url = new URL(window.location.href);
  const snippet = getSnippetPath(url, type);
  const key = snippet ? `${keyPrefix}_${snippet}` : keyPrefix;

  const [local, setLocal] = useState<Pending<string>>({ loading: true });
  const [code, setCode] = useLocalStorage(key, initial);

  useEffect(() => {
    if (local.loading) {
      if (snippet) {
        loadCode(type, snippet).then((code) => setLocal(nonPending(code)));
      } else {
        setLocal(nonPending(code));
      }
    } else {
      if (!snippet) {
        setLocal(nonPending(code));
      }
    }
  }, [code, type, snippet, local.loading]);

  return [
    local,
    (x) => {
      if (!snippet) {
        setCode(x);
      }
      setLocal(nonPending(x));
    },
    () => {
      if (!snippet) {
        setCode(initial);
      }
      setLocal({ loading: true });
    },
  ];
}

export function requiresSvelteTranspilation(code: string): boolean {
  return code.startsWith('"svelte";') || code.startsWith("'svelte';");
}

export function findBabelPlugins(code: string): string[] {
  let pragma = "";
  for (let i = 0; i < 1000 && i < code.length; i += 1) {
    if (code[i] !== "") {
      if (code[i] === '"' || code[i] === "'") {
        const end = code.indexOf(code[i], i + 1);
        if (end >= 0) {
          const value = code.substring(i + 1, end);
          if (value.startsWith("babel ")) {
            pragma = value.substring("babel ".length);
          }
        }
      }
      break;
    }
  }
  return pragma
    .split(",")
    .map((x) => x.trim())
    .filter((x) => x.length > 0);
}

export function transpileResources(code: ResourceFiles): TranspileResult {
  const babelPlugins = findBabelPlugins(code.js);
  if (babelPlugins.length > 0) {
    return {
      css: code.css,
      html: code.html,
      importmap: "",
      js: transformBabel(code.js, babelPlugins),
      type: "script",
    };
  }
  const usesSvelte = requiresSvelteTranspilation(code.js);
  if (usesSvelte) {
    return { ...transformSvelte(code), type: "module" };
  }
  return {
    css: code.css,
    html: code.html,
    importmap: "",
    js: code.js,
    type: "script",
  };
}

export function evaluateTypeScript(
  code: string,
  key: string,
  asyncResultHandler?: AsyncResultHandler,
): JsResult[] {
  const transpiled = transformBabel(code, ["transform-typescript"]);
  return evaluateJavaScript(transpiled, key, asyncResultHandler);
}

function splitSvelte(code: string, pattern: RegExp): Record<string, string> {
  const result: Record<string, string> = {};
  const matches = [...code.matchAll(pattern)];
  const first = matches[0];
  if (first !== undefined) {
    const part = code.substring(0, first.index);
    result[""] = part;
  }
  for (let i = 0; i < matches.length; i++) {
    const part = code.substring(
      matches[i].index + matches[i][0].length,
      matches[i + 1]?.index ?? Number.POSITIVE_INFINITY,
    );
    const name = matches[i][1]?.trim() ?? "";
    if (name) {
      result[name] = part.trim();
    }
  }
  return result;
}

function removeExtension(path: string): string {
  const lastSlash = path.lastIndexOf("/");
  const fileName = lastSlash >= 0 ? path.substring(lastSlash + 1) : path;
  const index = fileName.lastIndexOf(".");
  return index >= 0 ? fileName.substring(0, index) : fileName;
}

/**
 * Compiles svelte components.
 *
 * The CSS, HTML and JS code must define multiple files via comments, e.g.
 *
 * ```js
 * // file: App.js
 * // contents of App.js
 *
 * // file: Counter.js
 * // contents of Counter.js
 * ```
 *
 * or
 *
 * ```html
 * <!-- file: App.html -->
 * <div>...</div>
 *
 * <!-- file: Counter.html -->
 * <div>...</div>
 * ```
 * There must be an App.js file representing the root entry point.
 *
 * Svelte makes heavy use of ESM. We use blob URL as a workaround to load
 * individual modules. In the future, I might consider using a bundler like
 * rollup + @rollup/plugin-virtual to bundle all files into one, removing the
 * need for an ESM workaround.
 */
function transformSvelte(
  code: ResourceFiles,
): Record<"html" | "css" | "js" | "importmap", string> {
  try {
    const htmlFiles = splitSvelte(
      code.html,
      /^\s*<!--\s*file:\s*([^*\n\r-]+)\s*-->\s*$/gm,
    );
    const jsFiles = splitSvelte(
      code.js,
      /^\s*\/\/\s*file:\s*([^*\n\r-]+)\s*$/gm,
    );
    const cssFiles = splitSvelte(
      code.css,
      /^\s*\/\*\s*file:\s*([^*\n\r-]+)\*\/\s*$/gm,
    );
    const fileNames = new Set(
      [
        ...Object.keys(jsFiles),
        ...Object.keys(cssFiles),
        ...Object.keys(htmlFiles),
      ].map(removeExtension),
    );
    const importMap: Record<string, string> = {};
    const jsUrls: Record<string, string> = {};
    const mainJs: string[] = [];
    const mainCss: string[] = [];
    
    // Global CSS
    fileNames.delete("");
    mainCss.push(cssFiles[""] ?? "");

    for (const fileName of fileNames) {
      const svelteFile = `
      <style>
      ${cssFiles[`${fileName}.css`] ?? ""}
      </style>
      <script>
      ${jsFiles[`${fileName}.js`] ?? ""}
      </script>
      ${htmlFiles[`${fileName}.html`] ?? ""}
    `;
      const result = svelteCompile(svelteFile, {
        generate: "client",
        runes: true,
        filename: `${fileName}.svelte`,
        hmr: false,
        dev: false,
      });
      mainCss.push(result.css?.code ?? "");
      const blob = new Blob([result.js.code], { type: "text/javascript" });
      const blobUrl = URL.createObjectURL(blob);
      jsUrls[fileName] = blobUrl;
      importMap[`@sandbox/${fileName}.js`] = blobUrl;
    }
    mainJs.push(`import { mount } from "svelte";`);
    mainJs.push(`import App from "@sandbox/App.js";`);
    mainJs.push("mount(App, {target: document.body, props: {}})");
    return {
      css: mainCss.join("\n"),
      html: "",
      importmap: JSON.stringify({ imports: importMap }, null, 2),
      js: mainJs.join("\n"),
    };
  } catch (e) {
    console.error("Unable to transpile Svelte code to JavaScript", e);
    return { css: "", html: "", js: "", importmap: "" };
  }
}

function transformBabel(code: string, plugins: string[]): string {
  try {
    return (
      babelTransform(code, {
        compact: false,
        filename: "script.js",
        plugins: [...plugins],
        sourceType: "script",
        sourceMaps: "inline",
      }).code ?? ""
    );
  } catch (e) {
    console.error("Unable to transpile code to JavaScript", e);
    return "";
  }
}

export function evaluateJavaScript(
  code: string,
  key: string,
  asyncResultHandler?: AsyncResultHandler,
): JsResult[] {
  const originalDebug = console.debug;
  const originalLog = console.log;
  const originalInfo = console.info;
  const originalError = console.error;
  const originalWarn = console.warn;
  let results: JsResult[] = [];

  try {
    document.querySelector(`iframe[data-eval-id=${CSS.escape(key)}]`)?.remove();
    const iframe = document.createElement("iframe");
    iframe.dataset.evalId = key;
    iframe.style.display = "none";
    document.body.append(iframe);

    const win = iframe.contentWindow as (Window & typeof globalThis) | null;
    const doc = iframe.contentDocument;
    let sync = true;

    if (win === null || doc === null) {
      return [];
    }

    const resultHandler = (result: JsResult) => {
      if (sync) {
        results.push(result);
      } else {
        results = [...results, result];
        asyncResultHandler?.(results);
      }
    };

    win.console.debug = console.info = (...args: unknown[]) => {
      resultHandler(logToJsResult("console-debug", args));
      originalDebug.apply(console, args);
    };
    win.console.log = console.info = (...args: unknown[]) => {
      resultHandler(logToJsResult("console-log", args));
      originalLog.apply(console, args);
    };
    win.console.info = console.info = (...args: unknown[]) => {
      resultHandler(logToJsResult("console-log", args));
      originalInfo.apply(console, args);
    };
    win.console.warn = (...args: unknown[]) => {
      resultHandler(logToJsResult("console-warn", args));
      originalWarn.apply(console, args);
    };
    win.console.error = (...args: unknown[]) => {
      resultHandler(logToJsResult("console-error", args));
      originalError.apply(console, args);
    };
    win.addEventListener("error", (event) => {
      resultHandler(errorToJsResult(event.error));
      originalError.call(console, event.error);
    });
    win.addEventListener("unhandledrejection", (event) => {
      resultHandler(errorToJsResult(event.reason));
      originalError.call(console, event.reason);
    });

    const evalResult = win.eval.apply(null, [code]);

    if (isPromise(evalResult)) {
      evalResult.then(
        (v) =>
          v !== undefined ? resultHandler(resultToJsResult(v)) : undefined,
        (e) => resultHandler(errorToJsResult(e)),
      );
    } else {
      if (evalResult !== undefined) {
        resultHandler(resultToJsResult(evalResult));
      }
    }

    sync = false;
  } catch (e) {
    originalError.apply(console, [e]);
    results.push(errorToJsResult(e));
  }
  return results;
}

export async function loadCode(
  type: CodeType,
  path: string,
  extension: string = type,
): Promise<string> {
  const resolvedPath = path.endsWith(`.${extension}`)
    ? path
    : `${path}.${extension}`;
  try {
    const code = await import(
      `!!raw-loader!../../static/snippets/${type}/${resolvedPath}`
    );
    return code.default;
  } catch (e) {
    return "";
  }
}

export function captureLogEntries(
  window: typeof globalThis,
  onLogEntry: (entry: JsResult) => void,
) {
  const originalLog = window.console.log;
  const originalDebug = window.console.debug;
  const originalInfo = window.console.info;
  const originalWarn = window.console.warn;
  const originalError = window.console.error;
  window.console.log = (...args) => {
    originalLog.apply(window.console, args);
    onLogEntry(logToJsResult("console-log", args));
  };
  window.console.info = (...args) => {
    originalInfo.apply(window.console, args);
    onLogEntry(logToJsResult("console-log", args));
  };
  window.console.debug = (...args) => {
    originalDebug.apply(window.console, args);
    onLogEntry(logToJsResult("console-debug", args));
  };
  window.console.warn = (...args) => {
    originalWarn.apply(window.console, args);
    onLogEntry(logToJsResult("console-warn", args));
  };
  window.console.error = (...args) => {
    originalError.apply(window.console, args);
    onLogEntry(logToJsResult("console-error", args));
  };
}

function errorToString(e: unknown): string {
  if (e instanceof Error) {
    return e.stack ?? e.message;
  }
  return String(e);
}

function nodeToString(node: Node): string {
  const attributeList: string[] = [];
  if (node instanceof Element && node.attributes.length > 0) {
    attributeList.push("");
    const attributes = node.attributes;
    for (let i = 0; i < attributes.length; i += 1) {
      const attribute = attributes.item(i);
      attributeList.push(`${attribute?.nodeName}=${attribute?.nodeValue}`);
    }
  }
  return `<${node.nodeName}${attributeList.join(" ")} />`;
}

function stringify(value: unknown): string {
  switch (typeof value) {
    case "undefined":
    case "boolean":
    case "number":
    case "bigint":
    case "string":
      return String(value);
    case "symbol":
      return "symbol";
    case "function":
      return value.toString();
    case "object": {
      if (value === null) {
        return "null";
      }
      const instances = new Set();
      // Don't fail on cyclic object graphs
      const replacer = (key: unknown, value: unknown) => {
        if (value === undefined) {
          return "undefined";
        }
        if (typeof value === "function") {
          return value.toString();
        }
        if (value instanceof Error) {
          return errorToString(value);
        }
        if (typeof value === "object" && value !== null) {
          if (instances.has(value)) {
            return "circular";
          }
          // Don't use instanceof, won't work for objects from another scope (e.g. iframe)
          const names = getConstructorNames(value);
          if (names.has("Window") || names.has("Document")) {
            return String(value);
          }
          if (names.has("Promise")) {
            return String(value);
          }
          if (names.has("Node")) {
            return nodeToString(value as Node);
          }
          if (Object.keys(value).length > 30) {
            return String(value);
          }
          instances.add(value);
          return value;
        }
        return value;
      };
      return JSON.stringify(value, replacer, 2);
    }
  }
}

function getSnippetPath(url: URL, type: string): string | undefined {
  const path = url.searchParams.get("snippet");
  if (path === undefined || path === null || path.length === 0) {
    return undefined;
  }
  return path.endsWith(`.${type}`) ? path : `${path}.${type}`;
}

function logToJsResult(type: JsResultType, args: unknown[]): JsResult {
  return {
    type,
    value: args.map((arg) => stringify(arg)).join("\t"),
  };
}

function resultToJsResult(value: unknown): JsResult {
  return { type: "result", value: stringify(value) };
}

function errorToJsResult(error: unknown): JsResult {
  return { type: "error", value: errorToString(error) };
}
