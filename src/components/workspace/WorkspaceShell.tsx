import type { ReactNode } from "react";
import { cn } from "@mono-copilot/lib/utils";

type WorkspaceShellProps = {
  mobileChatOpen: boolean;
  onClose: () => void;
  chat: ReactNode;
  canvas: ReactNode;
};

export function WorkspaceShell({
  mobileChatOpen,
  onClose,
  chat,
  canvas
}: WorkspaceShellProps): import("react").JSX.Element {
  return(
    <main className="h-dvh w-full overflow-hidden bg-[radial-gradient(circle_at_top_left,color-mix(in_oklch,var(--foreground),transparent_92%),transparent_38%),linear-gradient(145deg,color-mix(in_oklch,var(--background),black_3%),var(--background))] p-3 md:p-4">
     <div className="relative mx-auto flex h-full min-h-0 w-full max-w-[1700px] overflow-hidden rounded-2xl border border-border/70 bg-background/85 shadow-[0_25px_80px_-40px_color-mix(in_oklch,var(--foreground),transparent_80%)] backdrop-blur-md">
        <aside
          role="complementary"
          aria-label="Conversation panel"
          className={cn(
             "absolute inset-y-0 left-0 z-50 flex w-[86%] max-w-90 transition-transform duration-300 ease-out",
              "md:static md:w-[320px] md:max-w-none md:translate-x-0",
               mobileChatOpen
               ? "translate-x-0"
               : "-translate-x-full md:translate-x-0",
  )}
>
  {chat}
</aside>
                
      {mobileChatOpen ? (
        <button
          className="absolute inset-0 z-40 bg-black/30 md:hidden"
          aria-label = "Close conversation panel"
          onClick={onClose}
        />
      ) : null}
      
        <section
            role="main"
            aria-label="Canvas"
            className="relative z-0 flex min-h-0 min-w-0 flex-1 flex-col "
        >
            {canvas}
        </section>
    </div>
  </main>
    );
}
