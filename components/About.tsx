const highlights = [
  "Mentored 100+ students on networking and resume strategy",
  "Campus ambassador for career-readiness workshops",
  "Former internship recruiter for early talent programs",
  "Built student communities around authentic professional growth"
];

export function About() {
  return (
    <section className="section-container" id="about">
      <div className="space-y-4">
        <h2 className="font-serif text-4xl">About & Experience</h2>
        <p className="max-w-3xl text-slateDeep/80">
          I&apos;m passionate about helping students navigate internships, first roles, and strategic
          LinkedIn outreach with confidence. These chats are designed to be calm, practical, and
          deeply useful.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {highlights.map((item) => (
          <article
            key={item}
            className="rounded-2xl border border-powder/70 bg-white/70 p-5 transition hover:-translate-y-1 hover:bg-powder/35 hover:shadow-soft"
          >
            <p>{item}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
