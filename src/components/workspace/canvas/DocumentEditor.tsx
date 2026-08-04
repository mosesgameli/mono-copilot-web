import type { CanvasFile } from "../types/workspace";
import { useRef } from "react";
import { useWorkspace } from "../providers/useWorkspace";
import { useCanvasSelection } from "../hooks/useCanvasSelection";

type DocumentEditorProps = {
  activeFile: CanvasFile | undefined;
  onChangeFileContent: (content: string) => void;
};


export function DocumentEditor({
  activeFile,
  onChangeFileContent,
}: DocumentEditorProps) {
    
    const editorRef = useRef<HTMLTextAreaElement | null>(null);
    
    const {
    updateSelection,
    clearSelection,
  } = useWorkspace().selection;

  useCanvasSelection({
    fileId: activeFile?.id ?? "",
    editorRef,
    updateSelection,
    clearSelection,
  });
  
  return (
    <>
    {activeFile? (
                <textarea
                ref={editorRef}
                id="canvas-doc"
                value={activeFile?.content ?? ""}
                onChange={(event) => onChangeFileContent(event.target.value)}
                className="h-full w-full resize-none rounded-lg bg-transparent p-4 font-mono text-[14px] leading-6 outline-none"
                spellCheck={false}/>
              ) : (
                <div className="flex h-full items-center justify-center rounded-lg bg-muted/50 text-sm text-muted-foreground">
                  Select a file to begin editing.
                </div>

              )}
              </>
              );
            }