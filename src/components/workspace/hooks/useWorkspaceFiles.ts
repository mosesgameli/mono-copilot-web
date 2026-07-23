import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

import type { CanvasFile } from "../types/workspace";
import { seedFiles } from "../data/seedfile";

export function useWorkspaceFiles() {
  const [files, setFiles] = useState<CanvasFile[]>(seedFiles);
  const [activeFileId, setActiveFileId] = useState(seedFiles[0]?.id ?? "");
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);
  const [fileCursor, setFileCursor] = useState(0);
  const fileMenuRef = useRef<HTMLDivElement | null>(null);
  const fileMenuButtonRef = useRef<HTMLButtonElement | null>(null);
  const activeFile = useMemo(
    () => files.find((file) => file.id === activeFileId) ?? files[0],
    [activeFileId, files],
  );

  useEffect(() => {
    if (!isFileMenuOpen) {
      return;
    }

    function onDocumentClick(event: MouseEvent) {
      const target = event.target as Node;
      if (
        fileMenuRef.current?.contains(target) ||
        fileMenuButtonRef.current?.contains(target)
      ) {
        return;
      }

      setIsFileMenuOpen(false);
    }

    function onEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsFileMenuOpen(false);
        fileMenuButtonRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", onDocumentClick);
    document.addEventListener("keydown", onEscape);

    return () => {
      document.removeEventListener("mousedown", onDocumentClick);
      document.removeEventListener("keydown", onEscape);
    };
  }, [isFileMenuOpen]);

  function onSelectFile(fileId: string) {
    if (fileId === activeFileId) {
      setIsFileMenuOpen(false);
      return;
    }
    setActiveFileId(fileId);
    setIsFileMenuOpen(false);
  }

  function handleFileMenuKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (!isFileMenuOpen || files.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setFileCursor((cursor) => (cursor + 1) % files.length);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setFileCursor((cursor) => (cursor - 1 + files.length) % files.length);
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const nextFile = files[fileCursor];
      if (nextFile) {
        onSelectFile(nextFile.id);
      }
    }
  }

  function onChangeFileContent(next: string) {
    setFiles((previous) =>
      previous.map((file) =>
        file.id === activeFileId
          ? {
              ...file,
              content: next,
              isDirty: true,
            }
          : file,
      ),
    );
  }
   function onToggleFileMenu() {
      if (!isFileMenuOpen) {
        const idx = files.findIndex((file) => file.id === activeFileId);
        setFileCursor(idx >= 0 ? idx : 0);
      }
      setIsFileMenuOpen((open) => !open);
    }

    return {
        files,
        activeFile,
        activeFileId,
        isFileMenuOpen,
        fileCursor,
        fileMenuRef,
        fileMenuButtonRef,
        onSelectFile,
        handleFileMenuKeyDown,
        onChangeFileContent,
        onToggleFileMenu,
        setFileCursor
    };
}