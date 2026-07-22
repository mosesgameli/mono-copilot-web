import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import {
  MessageSquare,
  SendHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@mono-copilot/components/ui/button";
import { cn } from "@mono-copilot/lib/utils";
import { ChatMessage } from "../types/workspace";

type AgentChatPaneProps = {
  messages: ChatMessage[];
  isAgentTyping: boolean;
  onClose: () => void;
  onSendMessage: (message: string) => void;
};

export function AgentChatPane({
  messages,
  isAgentTyping,
  onClose,
  onSendMessage,
}: AgentChatPaneProps) {
  const [draft, setDraft] = useState("");
  const sendDraftMessage = () => {
    const message = draft.trim();

    if (!message || isAgentTyping) {
      return;
    } 
      onSendMessage(message);
      setDraft("");
  };
  const handleComposerKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendDraftMessage();
    }
  };
  const messageViewRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    messageViewRef.current?.scrollTo({
      top: messageViewRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isAgentTyping]);
  return (
    <div className="flex h-full flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <header className="flex items-center justify-between border-b border-sidebar-border py-3 px-4">
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
          onClick={onClose}
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
                : "bg-sidebar-accent text-sidebar-accent-foreground"
            )}
          >
            <p>{message.content}</p>
            <p
              className={cn(
                "mt-2 text-[11px]",
                message.role === "user"
                  ? "text-sidebar-primary-foreground/70"
                  : "text-muted-foreground"
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
          onKeyDown={handleComposerKeyDown}
          rows={3}
          placeholder="Ask the agent to shape this doc..."
          className="w-full resize-none rounded-xl border border-sidebar-border bg-background px-3 py-2 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
        />
        <div className="mt-2 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Enter to send
          </p>
          <Button
            variant="secondary"
            size="sm"
            disabled={draft.trim().length === 0 || isAgentTyping}
            onClick={sendDraftMessage}
          >
            <SendHorizontal />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
