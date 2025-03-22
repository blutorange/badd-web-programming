import type { ColorMode } from "@docusaurus/theme-common";
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

export type Pending<T> = { loading: true } | { loading: false; value: T };

export type AsyncResultHandler = (results: JsResult[]) => void;

export interface JsResult {
  type:
    | "console-debug"
    | "console-log"
    | "console-error"
    | "console-warn"
    | "error"
    | "result";
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
    scriptCustom.textContent = `(function(){\n${js}\n;})()`;
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
      results.push({
        type: "console-debug",
        value: args.map((arg) => stringify(arg)).join("\t"),
      });
      originalDebug.apply(console, args);
    };
    console.log = console.info = (...args: unknown[]) => {
      results.push({
        type: "console-log",
        value: args.map((arg) => stringify(arg)).join("\t"),
      });
      originalLog.apply(console, args);
    };
    console.warn = (...args: unknown[]) => {
      results.push({
        type: "console-warn",
        value: args.map((arg) => stringify(arg)).join("\t"),
      });
      originalWarn.apply(console, args);
    };
    console.error = (...args: unknown[]) => {
      results.push({
        type: "console-error",
        value: args.map((arg) => stringify(arg)).join("\t"),
      });
      originalError.apply(console, args);
    };
    try {
      // biome-ignore lint/security/noGlobalEval: We use it for our own code snippets
      const evalResult = eval.apply(null, [code]);
      if (evalResult instanceof Promise) {
        evalResult.then(
          (value) =>
            asyncResultHandler?.([...results, { type: "result", value: stringify(value) }]),
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

export async function loadCode(
  type: "js" | "html" | "css",
  path: string,
): Promise<string> {
  const code = await import(
    `!!raw-loader!../../static/snippets/${type}/${path}`
  );
  return code.default;
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
        if (typeof value === "function") {
          return value.toString();
        }
        if (typeof value === "object" && value !== null) {
          if (instances.has(value)) {
            return "circular";
          }
          instances.add(value);
          return value;
        }
        return value;
      };
      return JSON.stringify(value, replacer);
    }
  }
}