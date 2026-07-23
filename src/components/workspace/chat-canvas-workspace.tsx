"use client";

import { useState } from "react";

import { WorkspaceShell } from "./WorkspaceShell";
import { useWorkspace } from "./providers/useWorkspace";
import { AgentChatPane } from "./agent_chat/Agent_Chat_Pane";
import {CanvasPane} from "./canvas/CanvasPane";



export function ChatCanvasWorkspace() {
  const { files, chat } = useWorkspace()
  
  const [mobileChatOpen, setMobileChatOpen] = useState(false); 

  return (
      <WorkspaceShell
        mobileChatOpen={mobileChatOpen}
        onClose={() => setMobileChatOpen(false)}
        chat={
          <AgentChatPane
            messages={chat.messages}
            isAgentTyping={chat.isAgentTyping}
            onClose={() => setMobileChatOpen(false)}
            onSendMessage={chat.handleSendMessage}
          />
        }
        canvas={
          <CanvasPane
            files={files.files}
            activeFile={files.activeFile}
            activeFileId={files.activeFileId}
            isFileMenuOpen={files.isFileMenuOpen}
            fileCursor={files.fileCursor}
            fileMenuRef={files.fileMenuRef}
            fileMenuButtonRef={files.fileMenuButtonRef}
            onToggleFileMenu={files.onToggleFileMenu}
            onFileHover={files.setFileCursor}
            onFileMenuKeyDown={files.handleFileMenuKeyDown}
            onChangeFileContent={files.onChangeFileContent}
            onOpenChat={() => setMobileChatOpen(true)}
            onSelectFile={files.onSelectFile}
          />
        }
      />
  );
    }