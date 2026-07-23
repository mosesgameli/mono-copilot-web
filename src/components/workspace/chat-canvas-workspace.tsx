"use client";

import { useState } from "react";

import { WorkspaceShell } from "./WorkspaceShell";
import { useWorkspaceFiles } from "./hooks/useWorkspaceFiles";
import { useWorkspaceChat } from "./hooks/useWorkspaceChat";
import { AgentChatPane } from "./agent_chat/Agent_Chat_Pane";
import {CanvasPane} from "./canvas/CanvasPane";


export function ChatCanvasWorkspace() {
  const workspaceFiles = useWorkspaceFiles();
  const workspaceChat = useWorkspaceChat();
  
  const [mobileChatOpen, setMobileChatOpen] = useState(false); 

  return (
    <>
      <WorkspaceShell
        mobileChatOpen={mobileChatOpen}
        onClose={() => setMobileChatOpen(false)}
        chat={
              <AgentChatPane
              messages={workspaceChat.messages}
              isAgentTyping={workspaceChat.isAgentTyping}
              onClose={() => setMobileChatOpen(false)}
              onSendMessage={workspaceChat.handleSendMessage}
            />
        }
        canvas={
          <CanvasPane
            files={workspaceFiles.files}
            activeFile={workspaceFiles.activeFile}
            activeFileId={workspaceFiles.activeFileId}
            isFileMenuOpen={workspaceFiles.isFileMenuOpen}
            fileCursor={workspaceFiles.fileCursor}
            fileMenuRef={workspaceFiles.fileMenuRef}
            fileMenuButtonRef={workspaceFiles.fileMenuButtonRef}
            onToggleFileMenu={workspaceFiles.onToggleFileMenu}
            onFileHover={workspaceFiles.setFileCursor}
            onFileMenuKeyDown={workspaceFiles.handleFileMenuKeyDown}
            onChangeFileContent={workspaceFiles.onChangeFileContent}
            onOpenChat={() => setMobileChatOpen(true)}
            onSelectFile={workspaceFiles.onSelectFile}
          />
        }
      />
    </>
  );
}