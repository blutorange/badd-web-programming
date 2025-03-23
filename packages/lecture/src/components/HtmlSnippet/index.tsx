import styles from "./styles.module.css";

import CodeBlock from "@theme/CodeBlock";
import Link from "@docusaurus/Link";
import { useEffect, useState, type ReactNode } from "react";

import { loadCode, type Pending } from "@site/src/utils/sandbox-utils";

export interface HtmlSnippetProps {
  title?: string;
  path: string;
  nonDeterministic?: boolean;
  toggleable?: boolean;
}

export default function HtmlSnippet(props: HtmlSnippetProps): ReactNode {
  return props.toggleable ? <Toggleable {...props} /> : <Static {...props} />;
}

function Static(props: HtmlSnippetProps): ReactNode {
  return (
    <div className={`${styles.htmlSnippet} ${styles.htmlSnippetContainer}`}>
      <HtmlSnippetContent {...props} />
    </div>
  );
}

function Toggleable(props: HtmlSnippetProps): ReactNode {
  return (
    <details className={styles.htmlSnippetContainer}>
      <summary className={styles.summary}>{props.path}</summary>
      <div className={styles.htmlSnippet}>
        <HtmlSnippetContent {...props} title="" />
      </div>
    </details>
  );
}

function HtmlSnippetContent(props: HtmlSnippetProps): ReactNode {
  const [code, setCode] = useState<Pending<string>>({ loading: true });

  useEffect(() => {
    if (code.loading) {
      loadAndSetHtmlCode(setCode, props.path);
    }
  }, [code.loading, props.path]);

  return (
    <>
      <Link
        to={`/sandbox?snippet=${encodeURIComponent(props.path)}`}
        className={`${styles.trySandbox} ${styles.headerButton}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        In Sandbox öffnen
      </Link>
      <CodeBlock
        className={styles.codeBlock}
        title={props.title ?? props.path}
        showLineNumbers={true}
        language="html"
      >
        {code.loading ? "loading..." : code.value}
      </CodeBlock>
    </>
  );
}

export async function loadAndSetHtmlCode(
  setCode: (code: Pending<string>) => void,
  path: string,
): Promise<void> {
  const code = await loadCode("html", path);
  console.log(code);
  setCode({ loading: false, value: code });
}
