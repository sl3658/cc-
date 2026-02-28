export function Hero() {
  return (
    <section className="section-container grid items-center gap-10 md:grid-cols-2">
      <div className="rounded-3xl border border-powder/70 bg-white/60 p-8 shadow-soft">
        <div className="mb-4 text-sm uppercase tracking-[0.3em] text-slateDeep/60">
          illustration placeholder
        </div>
        <div className="flex h-72 items-center justify-center rounded-2xl border border-dashed border-powder bg-beige text-center text-slateDeep/70">
          Hand-drawn style portrait goes here
        </div>
      </div>

      <div className="space-y-6">
        <p className="text-sm uppercase tracking-[0.25em] text-slateDeep/60">Networking</p>
        <h1 className="font-serif text-5xl text-slateDeep md:text-6xl">Let&apos;s Connect</h1>
        <p className="max-w-xl text-lg leading-relaxed text-slateDeep/80">
          I host intentional coffee chats for students and early-career professionals who want
          meaningful LinkedIn and career conversations.
        </p>
        <div className="flex items-center gap-4">
          <a
            href="#booking"
            className="rounded-full bg-powder px-6 py-3 font-medium transition hover:bg-powderHover"
          >
            Schedule a Coffee Chat
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-powder decoration-2 underline-offset-4 transition hover:text-slateDeep/70"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}
