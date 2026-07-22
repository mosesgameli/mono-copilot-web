"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

import { AgentChatPane } from "./agent_chat/Agent_Chat_Pane";
import type { ChatMessage, CanvasFile } from "./types/workspace";
import { WorkspaceShell } from "./WorkspaceShell";
import {CanvasPane} from "./canvas/CanvasPane";

const seedMessages: ChatMessage[] = [
  {
    id: "m1",
    role: "agent",
    content: "What should we design first: BRDs, PRDs, ARDs, workflows, or anything else?",
    timestamp: "09:14",
    status: "sent",
  },
  {
    id: "m2",
    role: "user",
    content: "Start with goals and capture assumptions.",
    timestamp: "09:15",
    status: "sent",
  },
];

const seedFiles: CanvasFile[] = [
  {
    id: "f1",
    name: "brd.md",
    content: [
      "# Business Requirements",
      "",
      "## Goal",
      "Create a reliable ticketing system for CEX operations.",
      "",
      "## Constraints",
      "- Keep incident triage under 5 minutes",
      "- Preserve an audit trail for every status change",
    ].join("\n"),
    isDirty: false,
  },
  {
    id: "f2",
    name: "prd.md",
    content: [
      "# Product Requirements",
      "",
      "## Users",
      "- Support agents",
      "- Operations lead",
      "",
      "## Core flows",
      "1. Create ticket",
      "2. Assign owner",
      "3. Escalate SLA breaches",
    ].join("\n"),
    isDirty: false,
  },
  {
    id: "f3",
    name: "system-design.md",
    content: [
      "# System Design",
      "",
      "## Services",
      "- Ticket API",
      "- Rules engine",
      "- Notification worker",
      "",
      "## Data model sketch",
      "- Ticket(id, status, priority, owner, created_at)",
    ].join("\n"),
    isDirty: false,
  },
];

function shortTime() {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}

export function ChatCanvasWorkspace() {
  const [messages, setMessages] = useState<ChatMessage[]>(seedMessages);
  const [isAgentTyping, setIsAgentTyping] = useState(false);

  const [files, setFiles] = useState<CanvasFile[]>(seedFiles);
  const [activeFileId, setActiveFileId] = useState(seedFiles[0]?.id ?? "");
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);
  const [fileCursor, setFileCursor] = useState(0);

  const [mobileChatOpen, setMobileChatOpen] = useState(false);

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

  function handleselectFile(fileId: string) {
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
        handleselectFile(nextFile.id);
      }
    }
  }

  function handleChangeFileContent(next: string) {
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
   function handleToggleFileMenu() {
      if (!isFileMenuOpen) {
        const idx = files.findIndex((file) => file.id === activeFileId);
        setFileCursor(idx >= 0 ? idx : 0);
      }
      setIsFileMenuOpen((open) => !open);
    }

  function handleSendMessage(content: string) {
    if (!content || isAgentTyping) {
      return;
    }

 

    const nextUserMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      timestamp: shortTime(),
      status: "sent",
    };

    setMessages((previous) => [...previous, nextUserMessage]);
    setIsAgentTyping(true);

    window.setTimeout(() => {
      const response: ChatMessage = {
        id: crypto.randomUUID(),
        role: "agent",
        content:
          "Noted. I updated the structure and can draft acceptance criteria next.",
        timestamp: shortTime(),
        status: "sent",
      };
      setMessages((previous) => [...previous, response]);
      setIsAgentTyping(false);
    }, 850);
  }

  return (
    <>
      <WorkspaceShell
        mobileChatOpen={mobileChatOpen}
        onClose={() => setMobileChatOpen(false)}
        chat={
              <AgentChatPane
              messages={messages}
              isAgentTyping={isAgentTyping}
              onClose={() => setMobileChatOpen(false)}
              onSendMessage={handleSendMessage}
            />
        }
        canvas={
          <CanvasPane
            files={files}
            activeFile={activeFile}
            activeFileId={activeFileId}
            isFileMenuOpen={isFileMenuOpen}
            fileCursor={fileCursor}
            fileMenuRef={fileMenuRef}
            fileMenuButtonRef={fileMenuButtonRef}
            onToggleFileMenu={handleToggleFileMenu}
            onFileHover={setFileCursor}
            onFileMenuKeyDown={handleFileMenuKeyDown}
            onChangeFileContent={handleChangeFileContent}
            onOpenChat={() => setMobileChatOpen(true)}
            onSelectFile={handleselectFile}
          />
        }
      />
    </>
  );
}
