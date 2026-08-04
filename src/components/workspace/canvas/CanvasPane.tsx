import { Button, buttonVariants } from "@mono-copilot/components/ui/button";
import type { CanvasFile } from "../types/workspace";
import { type KeyboardEvent, type RefObject } from "react";
import { FileText, Menu, MessageSquare } from "lucide-react";
import { cn } from "@mono-copilot/lib/utils";
import { ThemeToggle } from "@mono-copilot/components/theme-toggle";
import { DocumentEditor } from "./DocumentEditor";

type CanvasPaneProps = {
  files: CanvasFile[];
  activeFile: CanvasFile | undefined;
  activefileid: string;

  isFileMenuOpen: boolean;
  fileCursor: number;

  fileMenuRef: RefObject<HTMLDivElement | null>;
  fileMenuButtonRef: RefObject<HTMLButtonElement | null>;


  
  onToggleFileMenu: () => void;
  onSelectFile: (fileid: string) => void;
  onFileHover: (index: number) => void;
  onFileMenuKeyDown: (
    event: KeyboardEvent<HTMLDivElement>
  ) => void;
  onChangeFileContent: (content: string) => void;
  onOpenChat: () => void;
};

export function CanvasPane({
  files,
  activeFile,
  activefileid,
  isFileMenuOpen,
  fileCursor,
  fileMenuRef,
  fileMenuButtonRef,
  onToggleFileMenu,
  onSelectFile,
  onFileHover,
  onFileMenuKeyDown,
  onChangeFileContent,
  onOpenChat,
}: CanvasPaneProps){


  return (
    <div className="relative flex h-full min-h-0 flex-col">
          <header className="flex items-center justify-between border-b border-border/70 px-3 py-2.5 md:px-4">
            <div
            className="relative flex items-center gap-2"
              onKeyDown={onFileMenuKeyDown}
            >
              <button
                ref={fileMenuButtonRef}
                type="button"
                aria-label="Open file switcher"
                aria-haspopup="listbox"
                aria-expanded={isFileMenuOpen}
                aria-controls="file-switcher"
                className={cn(
                  buttonVariants({ size: "icon-sm", variant: "outline" }),
                )}
                onClick={onToggleFileMenu}
              >
                <Menu />
              </button>

              {isFileMenuOpen ? (
                <div
                  ref={fileMenuRef}
                  id="file-switcher"
                  role="listbox"
                  aria-label="Project files"
                  className="absolute top-11 left-0 z-30 w-64 rounded-xl border border-border bg-popover p-1 shadow-lg"
                >
                  {files.map((file, index) => (
                    <button
                      key={file.id}
                      role="option"
                      aria-selected={file.id === activefileid}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm transition",
                        file.id === activefileid
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-muted",
                        index === fileCursor ? "ring-2 ring-ring/40" : "",
                      )}
                      onMouseEnter={() => onFileHover(index)}
                      onClick={() => onSelectFile(file.id)}
                    >
                      <span className="flex items-center gap-2">
                        <FileText className="size-3.5" />
                        <span>{file.name}</span>
                      </span>
                      {file.isDirty ? (
                        <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[11px] text-amber-700 dark:text-amber-300">
                          Unsaved
                        </span>
                      ) : null}
                    </button>
                  ))}
                </div>
              ) : null}

              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">
                  {activeFile?.name ?? "No file selected"}
                </span>
                {activeFile?.isDirty ? (
                  <span className="rounded-full border border-amber-400/50 bg-amber-500/15 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:text-amber-300">
                    Unsaved changes
                  </span>
                ) : (
                  <span className="rounded-full border border-emerald-400/45 bg-emerald-500/12 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
                    Synced
                  </span>
                )}
              </div>
            </div>

            <Button
              size="sm"
              variant="ghost"
              className="md:hidden"
              onClick={onOpenChat}
            >
              <MessageSquare />
              Chat
            </Button>
          </header>

            <div className="relative min-h-0 flex-1 overflow-auto p-1 md:p-1">
            <div className="h-full rounded-xl border border-border/70 bg-card/70 p-1.5 shadow-inner">
              <label className="sr-only" htmlFor="canvas-doc">
                Active document editor
              </label>
              <DocumentEditor
                activeFile={activeFile}
                onChangeFileContent={onChangeFileContent}
              />
            </div>
          </div>
          <div className="absolute bottom-4 right-4 z-40">
            <ThemeToggle />
            </div>
    </div>
  );
}