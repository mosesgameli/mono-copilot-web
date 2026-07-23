import { WorkspaceProvider } from "@mono-copilot/components/workspace/providers/WorkspaceProvider";
import { ChatCanvasWorkspace } from "@mono-copilot/components/workspace/chat-canvas-workspace";


export default function Home() {
  return (
    <WorkspaceProvider>
      <ChatCanvasWorkspace />
    </WorkspaceProvider>
  );
}