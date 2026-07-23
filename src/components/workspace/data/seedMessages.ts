import type { ChatMessage } from "../types/workspace";

export const seedMessages: ChatMessage[] = [
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
