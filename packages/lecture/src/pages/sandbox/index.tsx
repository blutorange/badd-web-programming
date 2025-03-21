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

import InitialHtml from "./initial.html";
const InitialCss = `html {
  font-family: sans-serif;
  font-size: 16px;
}

body {
  margin: 1em;
}

h1 {
  font-size: 1.5em;
}

aside {
  float: right;
  max-width: 30%;
  background: #f3f3f3;
  padding: 1em;
}

footer {
  margin-top: 2em;
  border-top: 1px solid #ccc;
}
`;

const InitialJs = `
let lastX = 0, lastY = 0;
document.addEventListener("mousemove", (e) => {
    const distanceMoved = Math.sqrt((e.clientX - lastX) ** 2 + (e.clientY - lastY) ** 2);
    const randomColor = Math.floor(Math.random() * 2 ** 24).toString(16).padStart(6, "0");
    const points = [];
    for (let i = 0; i < distanceMoved + 1; i+=3) {
        const ratio = i / distanceMoved;
        const x = lastX + ratio * (e.clientX - lastX);
        const y = lastY + ratio * (e.clientY - lastY);
        const point = document.createElement("div");
        point.style.width = "3px"
        point.style.height = "3px"
        point.style.position = "fixed"
        point.style.left = \`\${x}px\`
        point.style.top = \`\${y}px\`
        point.style.background = \`#\${randomColor}\`;
        point.style.pointerEvents = "none";
        document.body.append(point);
        points.push(point);
    }

    lastX = e.clientX;
    lastY = e.clientY;

    let opacity = 1;
    const fade = () => {
        opacity -= 0.03;
        for (const point of points) {
            point.style.opacity = String(opacity);
        }
        if (opacity > 0) {
            requestAnimationFrame(fade);
        } else {
            points.forEach(point => point.remove());
        }
    };
    requestAnimationFrame(fade);
}, { passive: true });
`;

import {
  BooleanSerializer,
  IntegerSerializer,
  prepareHtmlContent,
  useMappedLocalStorage,
} from "./util";

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

function Sandbox(): ReactNode {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  // const outputRef = useRef<HTMLPreElement>(null);

  const { colorMode } = useColorMode();

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
                options={{ automaticLayout: true }}
                onChange={(value) => setHtml(value ?? "")}
              />
            </TabPanel>
            <TabPanel header="CSS">
              <MonacoEditor
                value={css}
                language="css"
                options={{ automaticLayout: true }}
                onChange={(value) => setCss(value ?? "")}
              />
            </TabPanel>
            <TabPanel header="JavaScript">
              <MonacoEditor
                value={js}
                language="javascript"
                options={{ automaticLayout: true }}
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

export default function SandboxPage(): ReactNode {
  return (
    <Layout>
      <PrimeReactProvider value={{ locale: "en" }}>
        <Sandbox />
      </PrimeReactProvider>
    </Layout>
  );
}
