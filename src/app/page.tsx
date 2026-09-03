import { Button } from "@/components/ui/button";

const UNSPLASH_BOOK_IMAGE = "relaxed-person-sitting-comfortably-in-a-s.png";

export default function Home() {
  return (
    <main className="min-h-svh bg-[var(--bright-snow)]">
      <header className="px-4 pt-6">
        <div className="mx-auto max-w-5xl text-center">
          <span className="text-2xl font-bold tracking-tight text-[#f98e47]">
            📖 RecallBook
          </span>
        </div>
      </header>

      <section className="flex min-h-[calc(100svh-88px)] flex-col items-center px-4 pb-32 pt-6">
        <div className="flex w-full max-w-md flex-1 flex-col items-center gap-10">
          <div
            className="h-[45svh] min-h-[260px] w-full rounded-2xl bg-cover bg-center bg-no-repeat shadow-sm"
            style={{ backgroundImage: `url(${UNSPLASH_BOOK_IMAGE})` }}
            role="img"
            aria-label="Libros y aprendizaje"
          />

          <div className="flex flex-1 items-center justify-center">
            <h1 className="max-w-md text-center text-3xl font-bold leading-tight tracking-tight text-[#1c1917] sm:text-4xl">
              La forma más efectiva de recordar las enseñanzas de tus libros
              favoritos
            </h1>
          </div>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-10">
        <div className="mx-auto max-w-md">
          <Button
            size="lg"
            className="
              mx-auto 
               max-w-md
              h-14 w-full
              rounded-xl
              border-x-0 border-t-0 border-b-[6px]
              border-[#dc6725]
              bg-[#f98e47]
              px-6
              text-base font-bold text-white
              shadow-none
              hover:bg-[#dc6725]
              active:translate-y-1
              active:border-b-0
              active:mb-[6px]
            "
          >
            <a href="/demo">Empezar mazo</a>
          </Button>
        </div>
      </div>
    </main>
  );
}
