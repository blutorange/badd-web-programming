import styles from "./styles.module.css";

import CodeBlock from "@theme/CodeBlock";
import Link from "@docusaurus/Link";
import { useEffect, useState, type MouseEvent, type ReactNode } from "react";

import {
  evaluateJavaScript,
  type JsResult,
  loadCode,
  type Pending,
} from "@site/src/utils/sandbox-utils";

export interface JsSnippetProps {
  title?: string;
  path: string;
  toggleable?: boolean;
}

export default function JsSnippet(props: JsSnippetProps): ReactNode {
  return props.toggleable ? <Toggleable {...props} /> : <Static {...props} />;
}

function Static(props: JsSnippetProps): ReactNode {
  return (
    <div className={`${styles.jsSnippet} ${styles.jsSnippetContainer}`}>
      <JsSnippetContent {...props} />
    </div>
  );
}

function Toggleable(props: JsSnippetProps): ReactNode {
  return (
    <details className={styles.jsSnippetContainer}>
      <summary className={styles.summary}>{props.path}</summary>
      <div className={styles.jsSnippet}>
        <JsSnippetContent {...props} title="" />
      </div>
    </details>
  );
}

function JsSnippetContent(props: JsSnippetProps): ReactNode {
  const [code, setCode] = useState<Pending<string>>({ loading: true });
  const [result, setResult] = useState<JsResult[] | undefined>(undefined);

  useEffect(() => {
    if (code.loading) {
      loadAndSetJsCode(setCode, props.path);
    }
  }, [code.loading, props.path]);

  const execute = (e: MouseEvent) => {
    e.preventDefault();
    if (!code.loading) {
      setResult(evaluateJavaScript(code.value));
    }
  };

  return (
    <>
      <Link
        to={`/sandbox-js?snippet=${encodeURIComponent(props.path)}`}
        className={`${styles.trySandbox} ${styles.headerButton}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        In Sandbox öffnen
      </Link>
      {result === undefined && !code.loading && (
        <Link onClick={execute} className={`${styles.headerButton} ${styles.execute}`}>
          Ausführen
        </Link>
      )}
      {result && (
        <>
          <div className={styles.resultRow}>Ergebnis</div>
          <div className={styles.result}>
            <ul className="sandbox-js__results">
              {code.loading
                ? "loading..."
                : result?.map((r, index) => (
                    <li
                      // biome-ignore lint/suspicious/noArrayIndexKey: There's no ID
                      key={index}
                      className={`${styles.resultLine} ${styles[`resultLine-${r.type}`]}`}
                    >
                      {r.value}
                    </li>
                  ))}
            </ul>
          </div>
        </>
      )}
      <CodeBlock
        className={styles.codeBlock}
        title={props.title ?? props.path}
        showLineNumbers={true}
        language="js"
      >
        {code.loading ? "loading..." : code.value}
      </CodeBlock>
    </>
  );
}

export async function loadAndSetJsCode(
  setCode: (code: Pending<string>) => void,
  path: string,
): Promise<void> {
  const code = await loadCode("js", path);
  setCode({ loading: false, value: code });
}
