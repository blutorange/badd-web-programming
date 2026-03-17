/// <reference path="./files.ts" />

import { EditorView } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";

import cssSampleHtml from "./css-sample.html";
import jsSampleHtml from "./js-sample.html";
import cssReset from "the-new-css-reset/css/reset.css";

import "./main.css";

main();
document.addEventListener("readystatechange", main);

async function main() {
  if (document.readyState !== "complete") {
    return;
  }

  const dom = createDom();

  const cssEditor = new EditorView({
    doc: "/* Your CSS code... */",
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
    doc: "// Your JavaScript code...",
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
}

function createDom(): Dom {
  const cssOutput = document.querySelector(".txtCssOutput");
  const cssCode = document.querySelector(".fsCssCode");
  const cssInput = document.querySelector(".edCss");

  const jsCode = document.querySelector(".fsJsCode");
  const jsOutput = document.querySelector(".txtJsOutput");
  const jsInput = document.querySelector(".edJs");
  const jsOutputError = document.querySelector(".txtJsOutputError");

  assertInstanceOf(cssCode, HTMLElement);
  assertInstanceOf(cssOutput, HTMLElement);
  assertInstanceOf(cssInput, HTMLTextAreaElement);

  assertInstanceOf(jsCode, HTMLElement);
  assertInstanceOf(jsOutput, HTMLElement);
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
    jsOutputError,
    jsInput,
    jsCode,
  };
}

function updateCssPreview(dom: Dom, cssContent: string) {
  dom.cssOutputRoot.innerHTML = cssSampleHtml;
  const reset = document.createElement("style");
  reset.textContent = cssReset;
  const style = document.createElement("style");
  style.textContent = cssContent;
  dom.cssOutputRoot.append(reset, style);
}

function updateJsPreview(dom: Dom, jsContent: string) {
  dom.jsOutput.innerHTML = "";
  const jsOutputFrame = document.createElement("iframe");
  dom.jsOutput.append(jsOutputFrame);
  
  const doc = jsOutputFrame.contentDocument;
  const win = jsOutputFrame.contentWindow as Window & typeof globalThis;
  if (!doc || !win) {
    throw new Error("Unable to access iframe window / document");
  }
  const errors: string[] = [];
  try {
    win.addEventListener("error", ev => {
      const error = ev instanceof win.ErrorEvent? ev.error : ev;
      errors.push(error instanceof win.Error ? error.message : String(error));
    });
    const reset = doc.createElement("style");
    reset.textContent = cssReset;
    const script = doc.createElement("script");
    script.textContent = jsContent;
    doc.body.innerHTML = jsSampleHtml;
    doc.body.append(reset, script);
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
  }
  dom.jsOutputError.innerHTML = "";
  dom.jsOutputError.classList.toggle("hidden", errors.length === 0);
  if (errors.length > 0) {
    const errorPre = document.createElement("pre");
    errorPre.textContent = errors.join("\n\n");
    dom.jsOutputError.append(errorPre);
  }
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

interface Dom {
  cssOutput: HTMLElement;
  cssInput: HTMLTextAreaElement;
  cssCode: HTMLElement;
  cssOutputRoot: ShadowRoot;
  jsOutput: HTMLElement;
  jsOutputError: HTMLElement;
  jsInput: HTMLTextAreaElement;
  jsCode: HTMLElement;
}

declare global {
  const XFC_METADATA: {
    currentProject: {
      id: string;
    };
    urls: {
      context: string;
    };
  };
}
