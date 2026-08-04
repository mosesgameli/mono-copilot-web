export type ChatMessage = {
  id: string;
  role: "user" | "agent";
  content: string;
  timestamp: string;
  status: "sending" | "sent" | "failed";
};

export type CanvasFile = {
  id: string;
  name: string;
  content: string;
  isDirty: boolean;
};

export type WorkspaceSelection = {
  fileId: string;
  selectedText: string;
  startOffset: number;
  endOffset: number;
};
