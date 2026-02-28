import { About } from "@/components/About";
import { BookingSection } from "@/components/BookingSection";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <BookingSection />
      <About />
      <Footer />
    </main>
  );
}
