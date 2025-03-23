import styles from "./styles.module.css";

import CodeBlock from "@theme/CodeBlock";
import Link from "@docusaurus/Link";
import { useEffect, useState, type MouseEvent, type ReactNode } from "react";
import { compressToEncodedURIComponent } from "lz-string";

import initSwc from "@swc/wasm-web";

import {
  type AsyncResultHandler,
  evaluateTypeScript,
  type JsResult,
  loadCode,
  type Pending,
} from "@site/src/utils/sandbox-utils";

export interface TsSnippetProps {
  title?: string;
  path: string;
  nonDeterministic?: boolean;
  toggleable?: boolean;
}

export default function TsSnippet(props: TsSnippetProps): ReactNode {
  return props.toggleable ? <Toggleable {...props} /> : <Static {...props} />;
}

function Static(props: TsSnippetProps): ReactNode {
  return (
    <div className={`${styles.tsSnippet} ${styles.tsSnippetContainer}`}>
      <TsSnippetContent {...props} />
    </div>
  );
}

function Toggleable(props: TsSnippetProps): ReactNode {
  return (
    <details className={styles.tsSnippetContainer}>
      <summary className={styles.summary}>{props.path}</summary>
      <div className={styles.tsSnippet}>
        <TsSnippetContent {...props} title="" />
      </div>
    </details>
  );
}

function TsSnippetContent(props: TsSnippetProps): ReactNode {
  const [code, setCode] = useState<Pending<string>>({ loading: true });
  const [result, setResult] = useState<JsResult[] | undefined>(undefined);
  const [initialized, setInitialized] = useState<"pending"|"success"|"failure">("pending");

  const asyncResultHandler: AsyncResultHandler = (asyncResults) => {
    setResult(asyncResults);
  };

  const execute = (e: MouseEvent) => {
    e.preventDefault();
    if (!code.loading) {
      initSwc();
      setResult(evaluateTypeScript(code.value, asyncResultHandler));
    }
  };

  useEffect(() => {
    initSwc().then(() => setInitialized("success")).catch(() => setInitialized("failure"));
  }, []);

  useEffect(() => {
    if (code.loading) {
      loadAndSetTsCode(setCode, props.path);
    }
  }, [code.loading, props.path]);

  return (
    <>
      {!code.loading && (
        <a
          href={`https://www.typescriptlang.org/play/?#code/${compressToEncodedURIComponent(code.value)}`}
          className={`${styles.trySandbox} ${styles.headerButton}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Im TypeScript-Playground öffnen
        </a>
      )}
      {initialized === "success" && (result === undefined || props.nonDeterministic) && !code.loading && (
        <Link
          onClick={execute}
          className={`${styles.headerButton} ${styles.execute}`}
        >
          {result === undefined ? "Ausführen" : "Erneut ausführen"}
        </Link>
      )}
      {result && (
        <>
          <div className={styles.resultRow}>Ergebnis</div>
          <div className={styles.result}>
            <ul className="sandbox-ts__results">
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
        language="ts"
      >
        {code.loading ? "loading..." : code.value}
      </CodeBlock>
    </>
  );
}

export async function loadAndSetTsCode(
  setCode: (code: Pending<string>) => void,
  path: string,
): Promise<void> {
  const code = await loadCode("ts", path);
  setCode({ loading: false, value: code });
}
