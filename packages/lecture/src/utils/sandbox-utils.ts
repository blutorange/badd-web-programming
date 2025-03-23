import type { ColorMode } from "@docusaurus/theme-common";
import { useEffect, useState, type Dispatch } from "react";
import useLocalStorage from "react-use-localstorage";

const parser = new DOMParser();

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
  | { readonly loading: true }
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
    scriptCustom.textContent = `document.addEventListener("readystatechange", function(){if(document.readyState!=="complete")return;\n${js}\n;})`;
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

/** Same as useLocalStorage, but lets you use non-string types. */
export function useMappedLocalStorage<T>(
  key: string,
  initial: T,
  serializer: Serializer<T>,
): [T, React.Dispatch<T>] {
  const initialString = serializer.serialize(initial);
  const [value, setValue] = useLocalStorage(key, initialString);
  return [
    serializer.deserialize(value),
    (v) => setValue(serializer.serialize(v)),
  ];
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
    (x) => (snippet ? setLocal(nonPending(x)) : setCode(x)),
    () => {
      if (!snippet) {
        setCode(initial);
      }
      setLocal({ loading: true });
    },
  ];
}

import { transformSync } from "@swc/wasm-web";

export function evaluateTypeScript(
  code: string,
  asyncResultHandler?: AsyncResultHandler,
): JsResult[] {
  let javaScript: string;
  try {
    javaScript = transformSync(code, {sourceMaps: "inline", filename: "file.ts"}).code;
  } catch (e) {
    console.error("Unable to transpile JavaScript", e);
    return [];
  }
  return evaluateJavaScript(javaScript, asyncResultHandler);
}

export function evaluateJavaScript(
  code: string,
  asyncResultHandler?: AsyncResultHandler,
): JsResult[] {
  const originalDebug = console.debug;
  const originalLog = console.log;
  const originalInfo = console.info;
  const originalError = console.error;
  const originalWarn = console.warn;
  const results: JsResult[] = [];
  try {
    console.debug = console.info = (...args: unknown[]) => {
      results.push(logToJsResult("console-debug", args));
      originalDebug.apply(console, args);
    };
    console.log = console.info = (...args: unknown[]) => {
      results.push(logToJsResult("console-log", args));
      originalLog.apply(console, args);
    };
    console.warn = (...args: unknown[]) => {
      results.push(logToJsResult("console-debug", args));
      originalWarn.apply(console, args);
    };
    console.error = (...args: unknown[]) => {
      results.push(logToJsResult("console-error", args));
      originalError.apply(console, args);
    };
    try {
      // biome-ignore lint/security/noGlobalEval: We use it for our own code snippets
      const evalResult = eval.apply(null, [code]);
      if (evalResult instanceof Promise) {
        evalResult.then(
          (value) =>
            asyncResultHandler?.([
              ...results,
              { type: "result", value: stringify(value) },
            ]),
          (error) =>
            asyncResultHandler?.([
              ...results,
              {
                type: "error",
                value: errorToString(error),
              },
            ]),
        );
      } else {
        if (evalResult !== undefined) {
          results.push({ type: "result", value: stringify(evalResult) });
        }
      }
    } catch (e) {
      originalError.apply(console, [e]);
      results.push({ type: "error", value: errorToString(e) });
    }
    return results;
  } finally {
    console.debug = originalDebug;
    console.info = originalInfo;
    console.log = originalLog;
    console.error = originalError;
    console.warn = originalWarn;
  }
}

export async function loadCode(type: CodeType, path: string): Promise<string> {
  const resolvedPath = path.endsWith(`.${type}`) ? path : `${path}.${type}`;
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
        if (typeof value === "object" && value !== null) {
          if (instances.has(value)) {
            return "circular";
          }
          if (value === window || value === document) {
            return String(value);
          }
          if (Object.keys(value).length > 50) {
            return String(value);
          }
          if (value instanceof Node) {
            return stringifyNode(value);
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

function stringifyNode(node: Node): string {
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
