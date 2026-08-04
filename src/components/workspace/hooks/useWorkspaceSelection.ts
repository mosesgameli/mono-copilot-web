"use client";

import { useState } from "react";
import type { WorkspaceSelection } from "../types/workspace";

export function useWorkspaceSelection() {
    const [selection, setSelection] =
        useState<WorkspaceSelection | null>(null)

       function updateSelection(
        nextSelection: WorkspaceSelection
    ) {
        console.log("Workspace selection updated:", nextSelection);
        setSelection(nextSelection);
    }

        function clearSelection() {
            setSelection(null);
        }

        return {
            selection,
            updateSelection,
            clearSelection,
        };
}