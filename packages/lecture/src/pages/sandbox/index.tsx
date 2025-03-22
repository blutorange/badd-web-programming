import "./layout.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primeflex/primeflex.css";

import Layout from "@theme/Layout";
import { useColorMode, type ColorMode } from "@docusaurus/theme-common";

import useLocalStorage from "react-use-localstorage";
import { useRef, type ReactNode, useEffect, type RefObject } from "react";

import { Editor as MonacoEditor } from "@monaco-editor/react";

import { PrimeReactProvider } from "primereact/api";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { TabView, TabPanel } from "primereact/tabview";

import {
  BooleanSerializer,
  IntegerSerializer,
  prepareHtmlContent,
  useMappedLocalStorage,
} from "@site/src/utils/sandbox-utils";

import InitialHtml from "!!raw-loader!./initial.html";
import InitialCss from "!!raw-loader!./initial.css";
// @ts-expect-error
import InitialJs from "!!raw-loader!./initial.js";
import { useMonacoResize } from "@site/src/utils/monaco";

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
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const { colorMode } = useColorMode();

  const monacoContainerRef = useRef<HTMLDivElement | null>(null);
  const [onJsMount] = useMonacoResize(monacoContainerRef);
  const [onCssMount] = useMonacoResize(monacoContainerRef);
  const [onHtmlMount] = useMonacoResize(monacoContainerRef);

  const [html, setHtml] = useLocalStorage("sandbox_html", InitialHtml);
  const [css, setCss] = useLocalStorage("sandbox_css", "");
  const [js, setJs] = useLocalStorage("sandbox_js", "");
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
    setHtml(InitialHtml);
    setCss(InitialCss);
    setJs(InitialJs);
  };

  useEffect(() => {
    if (applyImmediately) {
      applyHtml(iframeRef, html, css, js, colorMode);
    }
  }, [html, css, js, applyImmediately, colorMode]);

  return (
    <div className="sandbox">
      <h1>HTML Sandbox</h1>
      <p>
        Einfache Sandbox, hier kann man HTML-Schnippsel schreiben und
        ausprobieren.
      </p>
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
        {!applyImmediately && (
          <Button
            className="sandbox__button"
            label="Anwenden"
            onClick={() => applyHtml(iframeRef, html, css, js, colorMode)}
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
              <MonacoEditor
                value={html}
                language="html"
                onMount={onHtmlMount}
                onChange={(value) => setHtml(value ?? "")}
              />
            </TabPanel>
            <TabPanel header="CSS">
              <MonacoEditor
                value={css}
                language="css"
                onMount={onCssMount}
                onChange={(value) => setCss(value ?? "")}
              />
            </TabPanel>
            <TabPanel header="JavaScript">
              <MonacoEditor
                value={js}
                language="javascript"
                onMount={onJsMount}
                onChange={(value) => setJs(value ?? "")}
              />
            </TabPanel>
          </TabView>
        </div>
        <div className="sandbox__code-right">
          <iframe
            className="sandbox__iframe"
            title="HTML-Sandbox"
            ref={iframeRef}
          />
        </div>
      </div>
    </div>
  );
}

function applyHtml(
  ref: RefObject<HTMLIFrameElement | null>,
  html: string,
  css: string,
  js: string,
  colorMode: ColorMode,
) {
  const preparedHtmlContent = prepareHtmlContent(html, css, js, colorMode);
  const iframe = ref.current;
  const iframeDoc = iframe?.contentDocument;
  if (iframe && iframeDoc) {
    try {
      iframeDoc.open();
      iframeDoc.write(preparedHtmlContent);
      iframeDoc.close();
    } catch (e) {
      console.log("Could not write content to iframe", e);
    }
  }
}
