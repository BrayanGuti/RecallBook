import { DeckProgress } from "@/components/deck/deck-progress";
import { DeckViewer } from "@/components/deck/deck-viewer";
import { DeckControls } from "@/components/deck/deck-controls";

export default function DemoPage() {
  return (
    <main className="fixed inset-0 overflow-hidden bg-gray-50">
      <DeckProgress />

      <div className="h-full w-full px-4 pt-24 pb-28">
        <div className="mx-auto flex h-full w-full max-w-md items-center justify-center">
          <DeckViewer />
        </div>
      </div>

      <DeckControls />
    </main>
  );
}
