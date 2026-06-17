import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/flix/Nav";
import { Hero } from "@/components/flix/Hero";
import { WhyUs } from "@/components/flix/WhyUs";
import { Products } from "@/components/flix/Products";
import { Offers } from "@/components/flix/Offers";
import { ComingSoon } from "@/components/flix/ComingSoon";
import { HowItWorks } from "@/components/flix/HowItWorks";
import { Payments } from "@/components/flix/Payments";
import { Testimonials } from "@/components/flix/Testimonials";
import { Contact } from "@/components/flix/Contact";
import { Footer } from "@/components/flix/Footer";
import { StickyWA } from "@/components/flix/StickyWA";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FLIX STORE | اشتراكات PlayStation Plus وألعاب PS4/PS5 في مصر" },
      {
        name: "description",
        content:
          "FLIX STORE — اشتراكات PlayStation Plus (Essential / Extra) وأحدث ألعاب PS4 و PS5 بأسعار Prim5 / Prim4 / Sec وتسليم فوري في مصر.",
      },
      {
        property: "og:title",
        content: "FLIX STORE | متجر الترفيه الرقمي الأول",
      },
      {
        property: "og:description",
        content: "اشتراكات PS Plus وعروض ألعاب PS4/PS5 بتسليم فوري ودعم 24/7.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative">
      <Nav />
      <Hero />
      <WhyUs />
      <Products />
      <Offers />
      <ComingSoon />
      <HowItWorks />
      <Payments />
      <Testimonials />
      <Contact />
      <Footer />
      <StickyWA />
    </main>
  );
}
