export function Footer() {
  return (
    <footer className="border-t border-powder/70 py-8">
      <div className="section-container flex flex-col items-center justify-between gap-2 py-0 text-sm md:flex-row">
        <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="underline">
          LinkedIn
        </a>
        <p>© {new Date().getFullYear()} Coffee Chat Booking</p>
      </div>
    </footer>
  );
}
