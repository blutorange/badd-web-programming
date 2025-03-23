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
} from "react";

import { Editor as MonacoEditor } from "@monaco-editor/react";

import { PrimeReactProvider } from "primereact/api";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { TabView, TabPanel } from "primereact/tabview";

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

import InitialHtml from "!!raw-loader!./initial.html";
import InitialCss from "!!raw-loader!./initial.css";
// @ts-expect-error
import InitialJs from "!!raw-loader!./initial.js";

export default function SandboxPage(): ReactNode {
  return (
    <Layout>
      <PrimeReactProvider value={{ locale: "en" }}>
        <Sandbox />
      </PrimeReactProvider>
    </Layout>
  );
}

function Sandbox(): ReactNode {
  const contentRef = useRef<HTMLDivElement | null>(null);

  const { colorMode } = useColorMode();

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

  const onReset = () => {
    if (contentRef.current !== null) {
      contentRef.current.innerHTML = "";
    }
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
        <div className="sandbox__code-left">
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
                  onMount={onJsMount}
                  onChange={(value) => setJs(value ?? "")}
                />
              )}
            </TabPanel>
          </TabView>
        </div>
        <div className="sandbox__code-right">
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
  container.innerHTML = "";
  container.appendChild(iframe);
  const iframeWin = iframe.contentWindow;
  const iframeDoc = iframe.contentDocument;
  if (iframeWin && iframeDoc) {
    setLogEntries([]);
    try {
      captureLogEntries(iframeWin as unknown as typeof globalThis, (entry) =>
        setLogEntries((entries) => [...entries, entry]),
      );
      iframeDoc.open();
      iframeDoc.write(preparedHtmlContent);
      iframeDoc.close();
    } catch (e) {
      console.log("Could not write content to iframe", e);
    }
  }
}
