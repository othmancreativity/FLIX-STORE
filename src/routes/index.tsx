import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/flix/Nav";
import { Hero } from "@/components/flix/Hero";

const Categories = lazy(() => import("@/components/flix/Categories").then((m) => ({ default: m.Categories })));
const WhyUs = lazy(() => import("@/components/flix/WhyUs").then((m) => ({ default: m.WhyUs })));
const Products = lazy(() => import("@/components/flix/Products").then((m) => ({ default: m.Products })));
const Offers = lazy(() => import("@/components/flix/Offers").then((m) => ({ default: m.Offers })));
const ComingSoon = lazy(() => import("@/components/flix/ComingSoon").then((m) => ({ default: m.ComingSoon })));
const HowItWorks = lazy(() => import("@/components/flix/HowItWorks").then((m) => ({ default: m.HowItWorks })));
const Payments = lazy(() => import("@/components/flix/Payments").then((m) => ({ default: m.Payments })));
const Testimonials = lazy(() => import("@/components/flix/Testimonials").then((m) => ({ default: m.Testimonials })));
const Contact = lazy(() => import("@/components/flix/Contact").then((m) => ({ default: m.Contact })));
const Footer = lazy(() => import("@/components/flix/Footer").then((m) => ({ default: m.Footer })));
const StickyWA = lazy(() => import("@/components/flix/StickyWA").then((m) => ({ default: m.StickyWA })));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FLIX STORE | اشتراكات PlayStation Plus في مصر بتسليم فوري" },
      { name: "description", content: "متجر FLIX STORE — اشتراكات PlayStation Plus (Essential / Extra / Premium) بتسليم فوري وأفضل الأسعار في مصر. المزيد من المنتجات قريباً." },
      { property: "og:title", content: "FLIX STORE | متجر الترفيه الرقمي الأول" },
      { property: "og:description", content: "اشتراكات PlayStation Plus بتسليم فوري ودعم 24/7." },
    ],
  }),
  component: Index,
});

function SectionFallback() {
  return <div className="h-64" />;
}

function Index() {
  return (
    <main className="relative">
      <Nav />
      <Hero />
      <Suspense fallback={<SectionFallback />}><Categories /></Suspense>
      <Suspense fallback={<SectionFallback />}><WhyUs /></Suspense>
      <Suspense fallback={<SectionFallback />}><Products /></Suspense>
      <Suspense fallback={<SectionFallback />}><Offers /></Suspense>
      <Suspense fallback={<SectionFallback />}><ComingSoon /></Suspense>
      <Suspense fallback={<SectionFallback />}><HowItWorks /></Suspense>
      <Suspense fallback={<SectionFallback />}><Payments /></Suspense>
      <Suspense fallback={<SectionFallback />}><Testimonials /></Suspense>
      <Suspense fallback={<SectionFallback />}><Contact /></Suspense>
      <Suspense fallback={<SectionFallback />}><Footer /></Suspense>
      <Suspense fallback={<SectionFallback />}><StickyWA /></Suspense>
    </main>
  );
}
