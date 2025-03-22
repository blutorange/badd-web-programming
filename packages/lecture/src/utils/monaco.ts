import { useCallback, useEffect, useRef, type MutableRefObject } from "react";
import type { editor } from "monaco-editor";
import type { OnMount } from "@monaco-editor/react";

/**
 * Resizes the monaco editor when its container changes size. Do not use the
 * automatic layout option, it will sometimes produce errors due to synchronous
 * resizes.
 * 
 * The returned onMount function should be set on the monaco editor's onMount
 * property.
 *
 * @param ref The reference on the container you want to measure
 * @returns An onMount function.
 */
export function useMonacoResize(monacoContainerRef: MutableRefObject<HTMLElement | null>): [OnMount] {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (monacoContainerRef.current) {
      const div = monacoContainerRef.current;
      const observer = new ResizeObserver(() => {
        // delay to prevent errors due to resize observer loops
        requestAnimationFrame(() => {
          editorRef.current?.layout();
        });
      });
      observer.observe(div);
      return () => observer.unobserve(div);
    }
    return () => {};
  });

  const onMount = useCallback<OnMount>((editor) => {
      editorRef.current = editor;
      editor.layout();
  }, []);

  return [onMount];
}
