import "./layout.css";

import Layout from "@theme/Layout";

import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Editor as MonacoEditor } from "@monaco-editor/react";
import type { editor } from "monaco-editor";

import "primereact/resources/themes/saga-blue/theme.css";
import "primeflex/primeflex.css";
import { PrimeReactProvider } from "primereact/api";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";

import {
  BooleanSerializer,
  useMappedLocalStorage,
  evaluateJavaScript,
  type AsyncResultHandler,
  useCode,
  type JsResult,
} from "@site/src/utils/sandbox-utils";

// @ts-expect-error
import InitialJs from "!!raw-loader!./initial.js";
import { useMonacoResize } from "@site/src/utils/monaco";
import { useColorMode } from "@docusaurus/theme-common";

function Sandbox(): ReactNode {
  const url = new URL(window.location.href);
  const snippet = url.searchParams.get("snippet");

  const { colorMode } = useColorMode();

  const monacoContainerRef = useRef<HTMLDivElement | null>(null);
  const [onJsMount] = useMonacoResize(monacoContainerRef);

  const [js, setJs, resetJs] = useCode("sandbox_code_js", "js", InitialJs);
  const [applyImmediately, setApplyImmediately] = useMappedLocalStorage(
    "sandbox_js_immediate",
    false,
    BooleanSerializer,
  );
  const [result, setResult] = useState<JsResult[] | undefined>(undefined);

  const onReset = () => {
    resetJs();
    setResult(undefined);
  };
  const onJsChange = (value: string) => setJs(value);
  const onApply = () => {
    if (!js.loading) {
      setResult(evaluateJavaScript(js.value, "sandbox_js", onAsyncResult));
    }
  };

  const jsOptions = useMemo<editor.IStandaloneEditorConstructionOptions>(
    () => ({
      readOnly: js.loading,
      theme: colorMode === "dark" ? "vs-dark" : "vs",
    }),
    [js.loading, colorMode],
  );

  const onAsyncResult: AsyncResultHandler = useCallback(
    (asyncResults) => setResult(asyncResults),
    [],
  );

  const hasResult = result !== undefined;
  useEffect(() => {
    if (js.loading) {
      return;
    }
    if (applyImmediately || !hasResult) {
      evaluateJavaScript(js.value, "sandbox_js", onAsyncResult);
    }
  }, [applyImmediately, hasResult, js.loading, js.value, onAsyncResult]);

  const title = snippet ? `HTML Sandbox - ${snippet}` : "HTML Sandbox";

  return (
    <div className="sandbox-js">
      <h1>{title}</h1>
      <div className="sandbox-js__options">
        <div className="inline-flex align-items-center">
          <Checkbox
            inputId="apply-immediately"
            checked={applyImmediately}
            onChange={(e) => setApplyImmediately(e.target.checked ?? false)}
          />
          <label className="ml-2" htmlFor="apply-immediately">
            Änderungen sofort auswerten?
          </label>
        </div>

        <Button
          className="sandbox-js__button"
          label="Zurücksetzen"
          onClick={() => onReset()}
        />
        {!applyImmediately && !js.loading && (
          <Button
            className="sandbox-js__button"
            label="Anwenden"
            onClick={onApply}
          />
        )}
      </div>
      <div className="sandbox-js__code">
        <div className="sandbox-js__code-left" ref={monacoContainerRef}>
          <MonacoEditor
            value={js.loading ? "" : js.value}
            language="javascript"
            options={jsOptions}
            onMount={onJsMount}
            onChange={(value) => onJsChange(value ?? "")}
          />
        </div>
        <div className="sandbox-js__code-right">
          <ul className="sandbox-js__results">
            {(result ?? []).map((result, index) => (
              <li
                // biome-ignore lint/suspicious/noArrayIndexKey: There's no ID
                key={index}
                className={`sandbox-js__result sandbox-js__result--${result.type}`}
              >
                {result.value}
              </li>
            ))}
          </ul>
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
