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

export interface Serializer<T> {
  serialize: (v: T) => string;
  deserialize: (v: string) => T;
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
