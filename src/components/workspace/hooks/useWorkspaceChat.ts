import { useState } from "react";
import { seedMessages } from "../data/seedMessages";
import type { ChatMessage } from "../types/workspace";
import { shortTime } from "../utils/time";

export function useWorkspaceChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(seedMessages);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  

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

  return { messages, isAgentTyping, handleSendMessage };
}