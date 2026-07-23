"use client";

import { createContext, type ReactNode } from "react";

import { useWorkspaceFiles } from "../hooks/useWorkspaceFiles";
import { useWorkspaceChat } from "../hooks/useWorkspaceChat";

type WorkspaceContextValue = {
    files: ReturnType<typeof useWorkspaceFiles>;
    chat: ReturnType<typeof useWorkspaceChat>;
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

    const value = {
        files, chat
    }

    return (
        <WorkspaceContext.Provider value={value}>
            {children}
        </WorkspaceContext.Provider>
    );
}
