import styles from "./styles.module.css";

import { type ReactNode, useState, useEffect } from "react";
import { compressToEncodedURIComponent } from "lz-string";
import { loadCode, type Pending } from "@site/src/utils/sandbox-utils";

export interface TsPlaygroundLinkProps {
  path: string;
  text: string;
  extension?: string;
}

export default function TsPlaygroundLink(
  props: TsPlaygroundLinkProps,
): ReactNode {
  const [code, setCode] = useState<Pending<string>>({ loading: true });

  useEffect(() => {
    if (code.loading) {
      loadAndSetTsCode(setCode, props.path, props.extension);
    }
  }, [code.loading, props.path, props.extension]);

  return code.loading ? (
    <>{props.text}</>
  ) : (
    <a
      href={`https://www.typescriptlang.org/play/?#code/${compressToEncodedURIComponent(code.value)}`}
      className={styles.playgroundLink}
      target="_blank"
      rel="noopener noreferrer"
    >
      {props.text}
    </a>
  );
}

async function loadAndSetTsCode(
  setCode: (code: Pending<string>) => void,
  path: string,
  extension: string | undefined
): Promise<void> {
  const code = await loadCode("ts", path, extension);
  setCode({ loading: false, value: code });
}
