import { DeckProgress } from "@/components/deck/deck-progress";
import { DeckViewer } from "@/components/deck/deck-viewer";
import { DeckControls } from "@/components/deck/deck-controls";

export default function DemoPage() {
  return (
    <main
      className="fixed inset-0 overflow-hidden bg-[#f9f9f9]"
      style={
        {
          "--progress-pt": "clamp(0.625rem, 1.8dvh, 1rem)", // 10px → 16px
          "--progress-bar-h": "clamp(1.25rem, 3.2dvh, 2rem)", // 20px → 32px (h-8 original)
          "--progress-breathing": "clamp(1rem, 3dvh, 2.375rem)", // 16px → 38px

          "--controls-btn-h": "clamp(2.75rem, 7dvh, 3.5rem)", // 44px → 56px (h-14 original)
          "--controls-pb": "clamp(1.25rem, 5dvh, 2.5rem)", // 20px → 40px (pb-10 original)
          "--controls-breathing": "clamp(0.5rem, 2dvh, 1rem)", // 8px → 16px
        } as React.CSSProperties
      }
    >
      <DeckProgress />
      <div
        className="h-full w-full px-4"
        style={{
          paddingTop:
            "calc(var(--progress-pt) + var(--progress-bar-h) * 1.3125 + var(--progress-breathing))",
          paddingBottom:
            "calc(var(--controls-pb) + var(--controls-btn-h) + var(--controls-breathing))",
        }}
      >
        <div className="mx-auto flex h-full w-full max-w-md min-h-0 justify-center">
          <DeckViewer />
        </div>
      </div>

      <DeckControls />
    </main>
  );
}
