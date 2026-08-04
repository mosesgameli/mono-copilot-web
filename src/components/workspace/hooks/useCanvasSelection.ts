"use client";

import { useEffect, type RefObject } from "react";
import type { WorkspaceSelection } from "../types/workspace";

type UseCanvasSelectionProps = {
  fileId: string;
  editorRef: RefObject<HTMLTextAreaElement | null>;
  updateSelection: (selection: WorkspaceSelection) => void;
  clearSelection: () => void;
};

export function useCanvasSelection({
  fileId,
  editorRef,
  updateSelection,
  clearSelection,
}: UseCanvasSelectionProps) {

    console.log("useCanvasSelection render")

  useEffect(() => {
    
    function handleSelect() {
        console.log("1. handleSelect called");

  const textarea = editorRef.current;

  console.log("2. textarea =", textarea);

  if (!textarea) {
    console.log("3. No textarea");
    return;
  }

  console.log("4. Textarea Found");

  console.log("5. selectionStart =", textarea.selectionStart);
  console.log("6. selectionEnd =", textarea.selectionEnd);
  console.log("7. selectedText =", textarea.value.slice(
    textarea.selectionStart,
    textarea.selectionEnd
  ));

  updateSelection({
    fileId: fileId, // or rename the variable to fileId for consistency
    selectedText: textarea.value.slice(
      textarea.selectionStart,
      textarea.selectionEnd
    ),
    startOffset: textarea.selectionStart,
    endOffset: textarea.selectionEnd,
  });

  console.log("8. updateSelection called");

    }

    const textarea = editorRef.current;

    if (!textarea) {
      return;
    }

    textarea.addEventListener("mouseup", handleSelect);

    return () => {
      textarea.removeEventListener("mouseup", handleSelect);
    };

  }, [fileId, editorRef, updateSelection, clearSelection]);
}