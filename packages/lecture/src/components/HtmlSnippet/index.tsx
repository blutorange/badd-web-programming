import "./custom.css";
import styles from "./styles.module.css";

import CodeBlock from "@theme/CodeBlock";
import Link from "@docusaurus/Link";
import { useEffect, useState, type ReactNode } from "react";

import { loadCode, type Pending } from "@site/src/utils/sandbox-utils";
import { TabPanel, TabView } from "primereact/tabview";

export interface HtmlSnippetProps {
  title?: string;
  path: string;
  type?: "html" | "js" | "css";
  nonDeterministic?: boolean;
  tabs?: string;
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
  const [htmlCode, setHtmlCode] = useState<Pending<string>>({ loading: true });
  const [cssCode, setCssCode] = useState<Pending<string>>({ loading: true });
  const [jsCode, setJsCode] = useState<Pending<string>>({ loading: true });

  const code =
    props.type === "js" ? jsCode : props.type === "css" ? cssCode : htmlCode;

  useEffect(() => {
    const tabs = props.tabs?.split(",") ?? [];
    if (htmlCode.loading && (props.type === "html" || tabs.includes("html"))) {
      loadAndSetCode(setHtmlCode, "html", props.path);
    }
    if (cssCode.loading && (props.type === "css" || tabs.includes("css"))) {
      loadAndSetCode(setCssCode, "css", props.path);
    }
    if (jsCode.loading && (props.type === "js" || tabs.includes("js"))) {
      loadAndSetCode(setJsCode, "js", props.path);
    }
  }, [
    htmlCode.loading,
    cssCode.loading,
    jsCode.loading,
    props.tabs,
    props.type,
    props.path,
  ]);

  const tabs = props.tabs?.split(",") ?? [];
  return (
    <>
      <Link
        to={`/sandbox?snippet=${encodeURIComponent(props.path)}&tab=${props.type ?? "html"}`}
        className={`${styles.trySandbox} ${styles.headerButton}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        In Sandbox öffnen
      </Link>
      {props.tabs ? (
        <TabView
          className="html-snippet__tab-view"
          activeIndex={props.type === "html" ? 0 : props.type === "css" ? 1 : 2}
        >
          {props.type === "html" || tabs.includes("html") ? (
            <TabPanel header="HTML">
              <CodeBlock
                className={styles.codeBlock}
                title={props.title ?? props.path}
                showLineNumbers={true}
                language="html"
              >
                {htmlCode.loading ? "loading..." : htmlCode.value}
              </CodeBlock>
            </TabPanel>
          ) : undefined}
          {props.type === "css" || tabs.includes("css") ? (
            <TabPanel header="CSS">
              <CodeBlock
                className={styles.codeBlock}
                title={props.title ?? props.path}
                showLineNumbers={true}
                language="css"
              >
                {cssCode.loading ? "loading..." : cssCode.value}
              </CodeBlock>
            </TabPanel>
          ) : undefined}
          {props.type === "js" || tabs.includes("js") ? (
            <TabPanel header="JS">
              <CodeBlock
                className={styles.codeBlock}
                title={props.title ?? props.path}
                showLineNumbers={true}
                language="javascript"
              >
                {jsCode.loading ? "loading..." : jsCode.value}
              </CodeBlock>
            </TabPanel>
          ) : undefined}
        </TabView>
      ) : (
        <CodeBlock
          className={styles.codeBlock}
          title={props.title ?? props.path}
          showLineNumbers={true}
          language="javascript"
        >
          {code.loading ? "loading..." : code.value}
        </CodeBlock>
      )}
    </>
  );
}

export async function loadAndSetCode(
  setCode: (code: Pending<string>) => void,
  type: "html" | "js" | "css",
  path: string,
): Promise<void> {
  const code = await loadCode(type, path);
  setCode({ loading: false, value: code });
}
