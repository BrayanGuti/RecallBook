import { DeckProgress } from "@/components/deck/deck-progress";
import { DeckViewer } from "@/components/deck/deck-viewer";
import { DeckControls } from "@/components/deck/deck-controls";

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-8 px-4">
      <div className="w-full max-w-md">
        <DeckProgress />
        <DeckViewer />
        <DeckControls />
      </div>
    </main>
  );
}
