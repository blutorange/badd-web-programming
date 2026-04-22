/// <reference path="./files.ts" />

import { EditorView } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import html2canvas from "html2canvas";

import cssSampleHtml from "./css-sample.html" with { type: 'text' };
import jsSampleGlobalCss from "./css-sample-global.css" with { type: 'text' };

import jsSampleHtml from "./js-sample.html" with { type: 'text' };
import jsSampleCss from "./js-sample.css" with { type: 'text' };
import jsSampleJs from "./js-sample.js" with { type: 'text' };
import jsSampleGlobalJs from "./js-sample-global.js" with { type: 'text' };

import cssReset from "the-new-css-reset/css/reset.css" with { type: 'text' };

import mainCss from "./main.css" with { type: 'text' };

main();
document.addEventListener("readystatechange", main);

async function main() {
  if (document.readyState !== "complete") {
    return;
  }

  const mainStyle = document.createElement("style");
  mainStyle.textContent = replaceContext(mainCss);
  mainStyle.setAttribute("data-name", "main.css");
  document.head.append(mainStyle);

  const dom = createDom();


  const cssEditor = new EditorView({
    doc: defaultIfEmpty(dom.cssInput.value, "/* Your CSS code... */\n * { color: red; }"),
    parent: dom.cssCode,
    extensions: [
      basicSetup,
      css(),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          const css = cssEditor.state.doc.toString();
          dom.cssInput.value = css;
          updateCssPreview(dom, css);
        }
      }),
    ],
  });

  const jsEditor = new EditorView({
    doc: defaultIfEmpty(dom.jsInput.value, jsSampleJs),
    parent: dom.jsCode,
    extensions: [
      basicSetup,
      javascript({}),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          const css = jsEditor.state.doc.toString();
          dom.jsInput.value = css;
          updateJsPreview(dom, css);
        }
      }),
    ],
  });

  updateCssPreview(dom, cssEditor.state.doc.toString());
  updateJsPreview(dom, jsEditor.state.doc.toString());


  captureScreenshotWhenLeavingCssPage(dom);
}

function createDom(): Dom {
  const cssOutput = document.querySelector(".txtCssOutput");
  const cssCode = document.querySelector(".fsCssCode");
  const cssInput = document.querySelector(".edCss");

  const jsCode = document.querySelector(".fsJsCode");
  const jsOutput = document.querySelector(".txtJsOutput");
  const jsInput = document.querySelector(".edJs");
  const jsOutputConsole = document.querySelector(".txtJsOutputConsole");
  const jsOutputError = document.querySelector(".txtJsOutputError");

  assertInstanceOf(cssCode, HTMLElement);
  assertInstanceOf(cssOutput, HTMLElement);
  assertInstanceOf(cssInput, HTMLTextAreaElement);

  assertInstanceOf(jsCode, HTMLElement);
  assertInstanceOf(jsOutput, HTMLElement);
  assertInstanceOf(jsOutputConsole, HTMLElement);
  assertInstanceOf(jsOutputError, HTMLElement);
  assertInstanceOf(jsInput, HTMLTextAreaElement);

  cssOutput.innerHTML = "";
  const cssOutputRoot = cssOutput.attachShadow({ mode: "open" });

  return {
    cssOutput,
    cssOutputRoot,
    cssInput,
    cssCode,
    jsOutput,
    jsOutputConsole,
    jsOutputError,
    jsInput,
    jsCode,
  };
}

function captureScreenshotWhenLeavingCssPage(dom: Dom) {
    document.querySelector('BUTTON[data-name="btnJavaScript"]')?.addEventListener("click", async () => {
    try {
      const canvas = await html2canvas(dom.cssOutput);
      const imageDataUrl = canvas.toDataURL("image/png");
      const cssScreen = document.querySelector(".edCssScreen");
      if (cssScreen instanceof HTMLTextAreaElement) {
        cssScreen.value = imageDataUrl;
      }
    } catch (e) {
      console.error("Error capturing CSS preview:", e);
    }
    window.gotoPage("pJavaScript");
  });
}

function updateCssPreview(dom: Dom, cssContent: string) {
  dom.cssOutputRoot.innerHTML = replaceContext(cssSampleHtml);
  const reset = document.createElement("style");
  reset.textContent = cssReset;

  const globalStyle = document.createElement("style");
  globalStyle.textContent = replaceContext(jsSampleGlobalCss);

  const style = document.createElement("style");
  style.textContent = cssContent;
  dom.cssOutputRoot.append(reset, globalStyle, style);
}

function updateErrorOutput(dom: Dom, errors: string[]) {
  const errorUl = document.createElement("ul");
  dom.jsOutputError.innerHTML = "";
  dom.jsOutputError.parentElement?.classList.toggle("hidden", errors.length === 0);
  dom.jsOutputError.append(errorUl);
  for (const error of errors) {
    const errorLi = document.createElement("li");
    errorLi.textContent = error;
    errorUl.append(errorLi);
  }
}

function updateConsoleOutput(dom: Dom, messages: ConsoleMessage[]) {
  const messagesPre = document.createElement("ul");
  for (const msg of messages) {
    const message = document.createElement("li");
    message.textContent = msg.message;
    message.classList.add("console-message", `console-${msg.type}`);
    messagesPre.append(message);
  }
  dom.jsOutputConsole.innerHTML = "";
  dom.jsOutputConsole.parentElement?.classList.toggle("hidden", messages.length === 0);
  dom.jsOutputConsole.append(messagesPre);
}

function updateJsPreview(dom: Dom, jsContent: string) {
  dom.jsOutput.innerHTML = "";
  const jsOutputFrame = document.createElement("iframe");
  jsOutputFrame.onload =() => {
    const observer = new ResizeObserver(() => {
      if (jsOutputFrame.contentDocument) {
        jsOutputFrame.style.height = `${jsOutputFrame.contentDocument.documentElement.scrollHeight + 1}px`;
      }
    });
    if (jsOutputFrame.contentDocument) {
      observer.observe(jsOutputFrame.contentDocument.body);
    }
 };
  dom.jsOutput.append(jsOutputFrame);
  
  const doc = jsOutputFrame.contentDocument;
  const win = jsOutputFrame.contentWindow as Window & typeof globalThis;
  if (!doc || !win) {
    throw new Error("Unable to access iframe window / document");
  }
  const errors: string[] = [];
  const consoleProxy = createConsoleInterceptingProxy(win.console);


  try {
    win.addEventListener("error", ev => {
      const error = ev instanceof win.ErrorEvent? ev.error : ev;
      errors.push(error instanceof win.Error ? error.message : String(error));
      updateErrorOutput(dom, errors);
    });
    consoleProxy.onMessage(() => updateConsoleOutput(dom, consoleProxy.messages()));
    const globalScript = doc.createElement("script");
    globalScript.textContent = jsSampleGlobalJs;
    const script = doc.createElement("script");
    script.textContent = jsContent;
    const style = doc.createElement("style");
    style.textContent = jsSampleCss;
    doc.head.append(style);
    doc.body.innerHTML = jsSampleHtml;
    doc.body.append(globalScript, script);
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
  }

  updateErrorOutput(dom, errors);
  updateConsoleOutput(dom, consoleProxy.messages());
}

function createConsoleInterceptingProxy(originalConsole: Console): ConsoleProxy {
  const messages: ConsoleMessage[] = [];
  const listeners = new Set<(message: ConsoleMessage) => void>();

  const originalLog = originalConsole.log;
  const originalError = originalConsole.error;
  const originalWarn = originalConsole.warn;
  const originalInfo = originalConsole.info;
  const originalDebug = originalConsole.debug;
  const originalTrace = originalConsole.trace;

  const logWrapper = (type: ConsoleType, ...args: unknown[]) => {
    const message = args.map(arg => {
      try {
        return typeof arg === "object" ? JSON.stringify(arg) : String(arg);
      } catch (e) {
        return String(arg);
      }
    }).join(" ");
    const msg = { message, type };
    messages.push(msg);
    for (const listener of listeners) {
      listener(msg);
    }
    originalLog.apply(originalConsole, args);
  };

  originalConsole.log = (...args) => logWrapper("log", ...args);
  originalConsole.error = (...args) => logWrapper("error", ...args);
  originalConsole.warn = (...args) => logWrapper("warn", ...args);
  originalConsole.info = (...args) => logWrapper("info", ...args);
  originalConsole.debug = (...args) => logWrapper("debug", ...args);
  originalConsole.trace = (...args) => logWrapper("trace", ...args);
  
  return {
    restore: () => {
      originalConsole.log = originalLog;
      originalConsole.error = originalError;
      originalConsole.warn = originalWarn;
      originalConsole.info = originalInfo;
      originalConsole.debug = originalDebug;
      originalConsole.trace = originalTrace;
    },
    messages: () => [...messages],
    onMessage: (callback) => {
      listeners.add(callback);
    },
  };
}

function createFileUrl(name: string) {
  const url = new URL(
    `${XFC_METADATA.urls.context}form/includes/ressource`,
    document.location.href,
  );
  url.searchParams.append("pid", XFC_METADATA.currentProject.id);
  url.searchParams.append("name", name);
  url.searchParams.append("_ncres", String(Date.now()));
  return url;
}

function replaceContext(data: string): string {
  const context = new URL(XFC_METADATA.urls.context, location.href).toString();
  const projectId = XFC_METADATA.currentProject.id;
  return data.replaceAll("<CONTEXT>", removeEnd(context, "/")).replaceAll("<PID>", projectId);
}

function assertInstanceOf<T>(
  value: unknown,
  ctor: new (...args: never[]) => T,
  message?: string,
): asserts value is T {
  if (!(value instanceof ctor)) {
    throw new Error(
      message ?? `Expected instance of ${ctor.name}, but got ${typeof value}`,
    );
  }
}

function removeEnd(str: string, suffix: string): string {
  if (str.endsWith(suffix)) {
    return str.slice(0, -suffix.length);
  }
  return str;
}

function defaultIfEmpty(value: string | undefined | null, defaultValue: string): string {
  if (value === undefined || value === null || value.trim() === "") {
    return defaultValue;
  }
  return value;
}

interface Dom {
  cssOutput: HTMLElement;
  cssInput: HTMLTextAreaElement;
  cssCode: HTMLElement;
  cssOutputRoot: ShadowRoot;
  jsOutput: HTMLElement;
  jsOutputError: HTMLElement;
  jsOutputConsole: HTMLElement;
  jsInput: HTMLTextAreaElement;
  jsCode: HTMLElement;
}

interface ConsoleProxy {
  readonly restore: () => void;
  readonly messages: () => ConsoleMessage[];
  readonly onMessage: (callback: (message: ConsoleMessage) => void) => void;
}

interface ConsoleMessage {
  readonly message: string;
  readonly type: ConsoleType;
}

type ConsoleType = "log" | "error" | "warn" | "info" | "debug" | "trace";

declare global {
  function gotoPage(pageName: string): void;
  const XFC_METADATA: {
    currentProject: {
      id: string;
    };
    urls: {
      context: string;
    };
  };
}
