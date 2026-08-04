"use client";

import { createContext, type ReactNode } from "react";

import { useWorkspaceFiles } from "../hooks/useWorkspaceFiles";
import { useWorkspaceChat } from "../hooks/useWorkspaceChat";
import { useWorkspaceSelection} from "../hooks/useWorkspaceSelection"

type WorkspaceContextValue = {
    files: ReturnType<typeof useWorkspaceFiles>;
    chat: ReturnType<typeof useWorkspaceChat>;
    selection: ReturnType<typeof useWorkspaceSelection>;
};

export const WorkspaceContext = createContext<
    WorkspaceContextValue | undefined
>(undefined);

type WorkspaceProviderProps = {
    children: ReactNode;
};

export function WorkspaceProvider({
    children,
}: WorkspaceProviderProps) {
    const files = useWorkspaceFiles();
    const chat = useWorkspaceChat();
    const selection = useWorkspaceSelection()

    const value = {
        files, 
        chat, 
        selection,
    };

    return (
        <WorkspaceContext.Provider value={value}>
            {children}
        </WorkspaceContext.Provider>
    );
}
