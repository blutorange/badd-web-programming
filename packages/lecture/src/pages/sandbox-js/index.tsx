import "./layout.css";

import Layout from "@theme/Layout";

import {
  type Dispatch,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

import { Editor as MonacoEditor } from "@monaco-editor/react";

import "primereact/resources/themes/saga-blue/theme.css";
import "primeflex/primeflex.css";
import { PrimeReactProvider } from "primereact/api";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";

import {
  BooleanSerializer,
  useMappedLocalStorage,
  evaluateJavaScript,
  type Pending,
  loadCode,
  nonPending,
} from "@site/src/utils/sandbox-utils";

// @ts-expect-error
import InitialJs from "!!raw-loader!./initial.js";
import useLocalStorage from "react-use-localstorage";
import { useMonacoResize } from "@site/src/utils/monaco";

function useJs(): [Pending<string>, Dispatch<string>] {
  const url = new URL(window.location.href);
  const snippet = url.searchParams.get("snippet");
  const key = snippet ? `sandbox_js_${snippet}` : "sandbox_js";
  const [local, setLocal] = useState<Pending<string>>({ loading: true });
  const [code, setCode] = useLocalStorage(key, "");

  useEffect(() => {
    if (local.loading) {
      if (snippet) {
        loadCode("js", snippet).then((code) => setLocal(nonPending(code)));
      } else {
        setLocal(nonPending(code));
      }
    }
  }, [code, snippet, local.loading]);

  return [local, (x) => (snippet ? setLocal(nonPending(x)) : setCode(x))];
}

function Sandbox(): ReactNode {
  const url = new URL(window.location.href);
  const snippet = url.searchParams.get("snippet");

  const monacoContainerRef = useRef<HTMLDivElement | null>(null);
  const [onJsMount] = useMonacoResize(monacoContainerRef);
  const [js, setJs] = useJs();
  const [applyImmediately, setApplyImmediately] = useMappedLocalStorage(
    "sandbox_js_immediate",
    false,
    BooleanSerializer,
  );
  const [result, setResult] = useState(() =>
    js.loading ? [] : evaluateJavaScript(js.value),
  );

  const onReset = () => {
    setJs(InitialJs);
  };

  const onJsChange = (value: string) => {
    setJs(value);
  };

  const evalResult = applyImmediately
    ? js.loading
      ? []
      : evaluateJavaScript(js.value)
    : result;

  const title = snippet ? `HTML Sandbox - ${snippet}` : "HTML Sandbox";

  return (
    <div className="sandbox-js">
      <h1>{title}</h1>
      <p>
        Einfache Sandbox, hier kann man JavaScript eingeben und ausprobieren.
      </p>
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
            onClick={() =>
              !js.loading && setResult(evaluateJavaScript(js.value))
            }
          />
        )}
      </div>
      <div className="sandbox-js__code">
        <div className="sandbox-js__code-left" ref={monacoContainerRef}>
          {js.loading ? (
            "loading..."
          ) : (
            <MonacoEditor
              value={js.value}
              language="javascript"
              onMount={onJsMount}
              onChange={(value) => onJsChange(value ?? "")}
            />
          )}
        </div>
        <div className="sandbox-js__code-right">
          <ul className="sandbox-js__results">
            {evalResult.map((r, index) => (
              <li
                // biome-ignore lint/suspicious/noArrayIndexKey: There's no ID
                key={index}
                className={`sandbox-js__result sandbox-js__result--${r.type}`}
              >
                {r.value}
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
