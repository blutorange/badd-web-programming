import type { ColorMode } from "@docusaurus/theme-common";
import { transform } from "@babel/standalone";

import { useCallback, useEffect, useState, type Dispatch } from "react";

import { getConstructorNames, isPromise } from "./lang-utils";

const basicStyleLight = `
html {
  color: black;
}
`;
const basicStyleDark = `
html {
  color: white;
}
a {
  color: #9898ff;
}
`;

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

export interface JsResult {
  type: JsResultType;
  value: string;
}

export interface Serializer<T> {
  serialize: (v: T) => string;
  deserialize: (v: string) => T;
}

export function nonPending<T>(value: T): Pending<T> {
  return { loading: false, value };
}

export function prepareHtmlContent(
  html: string,
  css: string,
  js: string,
  colorMode: ColorMode,
): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  {
    const styleTheme = document.createElement("style");
    styleTheme.textContent =
      colorMode === "dark" ? basicStyleDark : basicStyleLight;
    doc.head.appendChild(styleTheme);
  }

  if (css.length > 0) {
    const styleCustom = document.createElement("style");
    styleCustom.textContent = css;
    doc.head.appendChild(styleCustom);
  }

  if (js.length > 0) {
    const scriptCustom = document.createElement("script");
    const transpiled = transpileScript(js);
    scriptCustom.textContent = `document.addEventListener("readystatechange", function(){if(document.readyState!=="complete")return;\n${transpiled}\n;})`;
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

export function transpileScript(code: string) {
  const plugins = findBabelPlugins(code);
  return plugins.length > 0 ? transformBabel(code, plugins) : code;
}

export function evaluateTypeScript(
  code: string,
  key: string,
  asyncResultHandler?: AsyncResultHandler,
): JsResult[] {
  const transpiled = transformBabel(code, ["transform-typescript"]);
  return evaluateJavaScript(transpiled, key, asyncResultHandler);
}

function transformBabel(code: string, plugins: string[]): string {
  try {
    return (
      transform(code, {
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

export async function loadCode(type: CodeType, path: string, extension: string = type): Promise<string> {
  const resolvedPath = path.indexOf(`.${extension}`) ? path : `${path}.${extension}`;
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
