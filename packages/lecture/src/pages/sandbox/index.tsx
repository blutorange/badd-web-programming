import "./layout.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primeflex/primeflex.css";

import Layout from "@theme/Layout";
import { useColorMode, type ColorMode } from "@docusaurus/theme-common";

import {
  useRef,
  type ReactNode,
  useEffect,
  type RefObject,
  type Dispatch,
  useState,
  type SetStateAction,
  useMemo,
} from "react";

import { Editor as MonacoEditor } from "@monaco-editor/react";
import type { editor } from "monaco-editor";

import { PrimeReactProvider } from "primereact/api";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { TabView, TabPanel } from "primereact/tabview";
import { Slider } from "primereact/slider";

import {
  BooleanSerializer,
  captureLogEntries,
  IntegerSerializer,
  prepareHtmlContent,
  useCode,
  useMappedLocalStorage,
  type JsResult,
} from "@site/src/utils/sandbox-utils";

import { useMonacoResize } from "@site/src/utils/monaco";

import SubmitCss from "!!raw-loader!./submit.css";
import InitialHtml from "!!raw-loader!./initial.html";
import InitialCss from "!!raw-loader!./initial.css";
// @ts-expect-error
import InitialJs from "!!raw-loader!./initial.js.raw";
import BrowserOnly from "@docusaurus/BrowserOnly";

export default function SandboxPage(): ReactNode {
  return (
    <Layout>
      <PrimeReactProvider value={{ locale: "en" }}>
        <BrowserOnly>{() => <Sandbox />}</BrowserOnly>
      </PrimeReactProvider>
    </Layout>
  );
}

function Sandbox(): ReactNode {
  const contentRef = useRef<HTMLDivElement | null>(null);

  const { colorMode } = useColorMode();

  const [codeWidth, setCodeWidth] = useState(50);
  const monacoContainerRef = useRef<HTMLDivElement | null>(null);
  const [onJsMount] = useMonacoResize(monacoContainerRef);
  const [onCssMount] = useMonacoResize(monacoContainerRef);
  const [onHtmlMount] = useMonacoResize(monacoContainerRef);

  const [logEntries, setLogEntries] = useState<JsResult[]>([]);
  const [html, setHtml, resetHtml] = useCode(
    "sandbox_html",
    "html",
    InitialHtml,
  );
  const [css, setCss, resetCss] = useCode("sandbox_css", "css", InitialCss);
  const [js, setJs, resetJs] = useCode("sandbox_js", "js", InitialJs);
  const [applyImmediately, setApplyImmediately] = useMappedLocalStorage(
    "sandbox_immediate",
    false,
    BooleanSerializer,
  );
  const [activeIndex, setActiveIndex] = useMappedLocalStorage(
    "sandbox_index",
    0,
    IntegerSerializer,
  );

  const monacoOptions = useMemo<editor.IStandaloneEditorConstructionOptions>(
    () => ({ theme: colorMode === "dark" ? "vs-dark" : "vs" }),
    [colorMode],
  );

  const onReset = () => {
    if (contentRef.current !== null) {
      destroyOldIFrame(contentRef.current);
      contentRef.current.innerHTML = "";
    }
    setCodeWidth(50);
    resetHtml();
    resetCss();
    resetJs();
  };

  useEffect(() => {
    if (html.loading || css.loading || js.loading) {
      return;
    }
    if (applyImmediately || contentRef.current?.childElementCount === 0) {
      applyHtml(
        contentRef,
        html.value,
        css.value,
        js.value,
        colorMode,
        setLogEntries,
      );
      return () => {
        if (applyImmediately && contentRef.current !== null) {
          destroyOldIFrame(contentRef.current);
          contentRef.current.innerHTML = "";
        }
      };
    }
    return () => {};
  }, [html, css, js, applyImmediately, colorMode]);

  return (
    <div className="sandbox">
      <h1>HTML Sandbox</h1>
      <div className="sandbox__options">
        <div className="inline-flex align-items-center">
          <Checkbox
            inputId="apply-immediately"
            checked={applyImmediately}
            onChange={(e) => setApplyImmediately(e.target.checked ?? false)}
          />
          <label className="ml-2" htmlFor="apply-immediately">
            Änderungen sofort anwenden?
          </label>
        </div>
        <div className="sandbox__width-slider">
          <span>Breite Editor-Vorschau</span>
          <Slider id="widthSlider"
            value={codeWidth}
            min={0}
            max={100}
            step={1}
            onChange={(e) => setCodeWidth(typeof e.value === "number" ? e.value : e.value[0])}
          />
        </div>

        <Button
          className="sandbox__button"
          label="Zurücksetzen"
          onClick={() => onReset()}
        />
        {!html.loading && !css.loading && !js.loading && !applyImmediately && (
          <Button
            className="sandbox__button"
            label="Anwenden"
            onClick={() =>
              applyHtml(
                contentRef,
                html.value,
                css.value,
                js.value,
                colorMode,
                setLogEntries,
              )
            }
          />
        )}
      </div>
      <div className="sandbox__code">
        <div className="sandbox__code-left" style={{flexBasis: `${codeWidth}%`}}>
          <TabView
            activeIndex={activeIndex}
            onTabChange={(e) => setActiveIndex(e.index)}
          >
            <TabPanel header="HTML">
              {html.loading ? (
                "...loading"
              ) : (
                <MonacoEditor
                  value={html.value}
                  language="html"
                  options={monacoOptions}
                  onMount={onHtmlMount}
                  onChange={(value) => setHtml(value ?? "")}
                />
              )}
            </TabPanel>
            <TabPanel header="CSS">
              {css.loading ? (
                "...loading"
              ) : (
                <MonacoEditor
                  value={css.value}
                  language="css"
                  options={monacoOptions}
                  onMount={onCssMount}
                  onChange={(value) => setCss(value ?? "")}
                />
              )}
            </TabPanel>
            <TabPanel header="JavaScript">
              {js.loading ? (
                "...loading"
              ) : (
                <MonacoEditor
                  value={js.value}
                  language="javascript"
                  options={monacoOptions}
                  onMount={onJsMount}
                  onChange={(value) => setJs(value ?? "")}
                />
              )}
            </TabPanel>
          </TabView>
        </div>
        <div className="sandbox__code-right" style={{flexBasis: `${100-codeWidth}%`}}>
          <div className="sandbox__iframe-container" ref={contentRef} />
        </div>
      </div>
      <div className="sandbox__console">
        {logEntries.map((entry, index) => (
          <li
            // biome-ignore lint/suspicious/noArrayIndexKey: There's no ID
            key={index}
            className={`sandbox__result sandbox__result-${entry.type}`}
          >
            {entry.value}
          </li>
        ))}
      </div>
    </div>
  );
}

function applyHtml(
  ref: RefObject<HTMLDivElement | null>,
  html: string,
  css: string,
  js: string,
  colorMode: ColorMode,
  setLogEntries: Dispatch<SetStateAction<JsResult[]>>,
) {
  const container = ref.current;
  if (container === null) {
    return;
  }
  const preparedHtmlContent = prepareHtmlContent(html, css, js, colorMode);
  const iframe = document.createElement("iframe");
  iframe.classList.add("sandbox__iframe");
  destroyOldIFrame(container);
  container.innerHTML = "";
  container.appendChild(iframe);
  const iframeWin = iframe.contentWindow as Window & typeof globalThis;
  const iframeDoc = iframe.contentDocument;
  if (iframeWin && iframeDoc) {
    setLogEntries([]);
    try {
      captureLogEntries(iframeWin, (entry) =>
        setLogEntries((entries) => [entry, ...entries]),
      );
      iframeDoc.open();
      iframeDoc.write(preparedHtmlContent);
      iframeDoc.close();
      iframeDoc.addEventListener("submit", (event) => {
        if (
          !(event.target instanceof iframeWin.HTMLFormElement) ||
          event.target.method === "dialog"
        ) {
          return;
        }
        event.preventDefault();
        const submitHtml = buildSubmitHtml(event, iframeWin);
        iframeDoc.open();
        iframeDoc.write(submitHtml);
        iframeDoc.close();
      });
    } catch (e) {
      console.log("Could not write content to iframe", e);
    }
  }
}

function buildSubmitHtml(event: SubmitEvent, win: typeof globalThis): string {
  if (!(event.target instanceof win.HTMLFormElement)) {
    return "";
  }

  const $ = <K extends keyof HTMLElementTagNameMap>(x: K) =>
    document.createElement(x);

  const container = $("div");

  const h1 = $("h1");
  h1.textContent = "Formular wurde abgesendet";

  const dl = $("dl");
  const dtForm = $("dt");
  const ddForm = $("dd");
  const dtSubmitter = $("dt");
  const ddSubmitter = $("dd");
  dtForm.textContent = "Formular-Element";
  const formClone = event.target.cloneNode() as HTMLFormElement;
  formClone.innerHTML = "";
  ddForm.textContent = formClone.outerHTML;
  dtSubmitter.textContent = "Absender";
  ddSubmitter.textContent = event.submitter?.outerHTML ?? "-";
  dl.append(dtForm, ddForm, dtSubmitter, ddSubmitter);

  const table = $("table");
  const thead = $("thead");
  const trHead = $("tr");
  const thName = $("th");
  const thValue = $("th");
  const tbody = $("tbody");

  thName.textContent = "Name";
  thValue.textContent = "Wert";

  table.append(thead, tbody);
  thead.append(trHead);
  trHead.append(thName, thValue);

  const formData = new win.FormData(event.target, event.submitter);
  formData.forEach((value, key) => {
    const tr = $("tr");
    const tdName = $("td");
    const tdValue = $("td");
    tdName.classList.add("form-row__name");
    tdValue.classList.add("form-row__value");
    tdName.textContent = key;
    if (typeof value === "string") {
      tdValue.textContent = value;
    } else {
      tdValue.textContent = `File[${value.name}, ${value.size} bytes, ${value.type}]`;
    }
    tr.append(tdName, tdValue);
    tbody.append(tr);
  });

  const style = $("style");
  style.textContent = SubmitCss;

  container.append(h1, dl, table, style);

  return container.outerHTML;
}

function destroyOldIFrame(container: HTMLDivElement) {
  const oldIframe = container.querySelector("iframe");
  oldIframe?.contentWindow?.dispatchEvent(new Event("beforeunload"));
}
