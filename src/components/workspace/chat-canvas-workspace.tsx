"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import {
  FileText,
  Menu,
  MessageSquare,
  SendHorizontal,
  Sparkles,
  X,
} from "lucide-react";

import { Button, buttonVariants } from "@mono-copilot/components/ui/button";
import { cn } from "@mono-copilot/lib/utils";
import { ThemeToggle } from "../theme-toggle";

type ChatMessage = {
  id: string;
  role: "user" | "agent";
  content: string;
  timestamp: string;
  status: "sent" | "pending";
};

type CanvasFile = {
  id: string;
  name: string;
  content: string;
  isDirty: boolean;
};

const seedMessages: ChatMessage[] = [
  {
    id: "m1",
    role: "agent",
    content: "What should we design first: goals, workflows, or data model?",
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
  const [draft, setDraft] = useState("");
  const [isAgentTyping, setIsAgentTyping] = useState(false);

  const [files, setFiles] = useState<CanvasFile[]>(seedFiles);
  const [activeFileId, setActiveFileId] = useState(seedFiles[0]?.id ?? "");
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);
  const [fileCursor, setFileCursor] = useState(0);

  const [mobileChatOpen, setMobileChatOpen] = useState(false);

  const fileMenuRef = useRef<HTMLDivElement | null>(null);
  const fileMenuButtonRef = useRef<HTMLButtonElement | null>(null);
  const messageViewRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    messageViewRef.current?.scrollTo({
      top: messageViewRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isAgentTyping]);

  function selectFile(fileId: string) {
    if (fileId === activeFileId) {
      setIsFileMenuOpen(false);
      return;
    }
    setActiveFileId(fileId);
    setIsFileMenuOpen(false);
  }

  function onFileMenuKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
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
        selectFile(nextFile.id);
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

  function sendMessage() {
    const content = draft.trim();
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
    setDraft("");
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

  function onComposerKeyDown(event: ReactKeyboardEvent<HTMLTextAreaElement>) {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  }

  return (
    <main className="h-dvh w-full overflow-hidden bg-[radial-gradient(circle_at_top_left,color-mix(in_oklch,var(--foreground),transparent_92%),transparent_38%),linear-gradient(145deg,color-mix(in_oklch,var(--background),black_3%),var(--background))] p-3 md:p-4">
      <ThemeToggle />
      <div className="relative mx-auto flex h-full w-full max-w-[1700px] overflow-hidden rounded-2xl border border-border/70 bg-background/85 shadow-[0_25px_80px_-40px_color-mix(in_oklch,var(--foreground),transparent_80%)] backdrop-blur-md">
        <aside
          role="complementary"
          aria-label="Conversation panel"
          className={cn(
            "absolute inset-y-0 left-0 z-30 flex w-[86%] max-w-90 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-300 ease-out md:static md:w-[320px] md:max-w-none md:translate-x-0",
            mobileChatOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0",
          )}
        >
          <header className="flex items-center justify-between border-b border-sidebar-border px-4 py-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="size-4" />
              <h1 className="text-sm font-semibold tracking-wide">
                Conversation
              </h1>
            </div>
            <Button
              size="icon-sm"
              variant="ghost"
              aria-label="Close conversation panel"
              className="md:hidden"
              onClick={() => setMobileChatOpen(false)}
            >
              <X />
            </Button>
          </header>

          <div
            ref={messageViewRef}
            className="flex-1 space-y-3 overflow-y-auto px-3 py-4"
          >
            {messages.length === 0 ? (
              <div className="rounded-xl border border-dashed border-sidebar-border px-4 py-5 text-sm text-muted-foreground">
                Start a conversation to shape your document together.
              </div>
            ) : null}

            {messages.map((message) => (
              <article
                key={message.id}
                className={cn(
                  "max-w-[92%] rounded-xl px-3 py-2 text-sm leading-relaxed",
                  message.role === "user"
                    ? "ml-auto bg-sidebar-primary text-sidebar-primary-foreground"
                    : "bg-sidebar-accent text-sidebar-accent-foreground",
                )}
              >
                <p>{message.content}</p>
                <p
                  className={cn(
                    "mt-2 text-[11px]",
                    message.role === "user"
                      ? "text-sidebar-primary-foreground/70"
                      : "text-muted-foreground",
                  )}
                >
                  {message.timestamp}
                </p>
              </article>
            ))}

            {isAgentTyping ? (
              <article className="max-w-[88%] rounded-xl bg-sidebar-accent px-3 py-2 text-sm text-sidebar-accent-foreground">
                <span className="inline-flex items-center gap-2 text-muted-foreground">
                  <Sparkles className="size-3.5" />
                  Agent is drafting...
                </span>
              </article>
            ) : null}
          </div>

          <div className="border-t border-sidebar-border p-3">
            <label className="sr-only" htmlFor="chat-composer">
              Message input
            </label>
            <textarea
              id="chat-composer"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={onComposerKeyDown}
              rows={3}
              placeholder="Ask the agent to shape this doc..."
              className="w-full resize-none rounded-xl border border-sidebar-border bg-background px-3 py-2 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
            />
            <div className="mt-2 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Cmd/Ctrl + Enter to send
              </p>
              <Button
                variant="secondary"
                size="sm"
                disabled={draft.trim().length === 0 || isAgentTyping}
                onClick={sendMessage}
              >
                <SendHorizontal />
                Send
              </Button>
            </div>
          </div>
        </aside>

        {mobileChatOpen ? (
          <button
            className="absolute inset-0 z-20 bg-black/30 md:hidden"
            aria-label="Close conversation overlay"
            onClick={() => setMobileChatOpen(false)}
          />
        ) : null}

        <section
          role="main"
          aria-label="Canvas panel"
          className="relative z-10 flex min-w-0 flex-1 flex-col"
        >
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
                onClick={() => {
                  if (!isFileMenuOpen) {
                    const idx = files.findIndex(
                      (file) => file.id === activeFileId,
                    );
                    setFileCursor(idx >= 0 ? idx : 0);
                  }
                  setIsFileMenuOpen((open) => !open);
                }}
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
                      aria-selected={file.id === activeFileId}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm transition",
                        file.id === activeFileId
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-muted",
                        index === fileCursor ? "ring-2 ring-ring/40" : "",
                      )}
                      onMouseEnter={() => setFileCursor(index)}
                      onClick={() => selectFile(file.id)}
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
              onClick={() => setMobileChatOpen(true)}
            >
              <MessageSquare />
              Chat
            </Button>
          </header>

          <div className="relative flex-1 overflow-hidden p-3 md:p-5">
            <div className="h-full rounded-xl border border-border/70 bg-card/70 p-1.5 shadow-inner">
              <label className="sr-only" htmlFor="canvas-doc">
                Active document editor
              </label>
              <textarea
                id="canvas-doc"
                value={activeFile?.content ?? ""}
                onChange={(event) => onChangeFileContent(event.target.value)}
                className="h-full w-full resize-none rounded-lg bg-transparent p-4 font-mono text-[14px] leading-6 outline-none"
                spellCheck={false}
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
