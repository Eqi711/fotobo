import React, { useEffect, useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FRAME_PRESETS } from "../config/framesConfig";
import { POLAROID_RAINBOW } from "../config/polaroidTheme";
import { BrandMark, FramePreview } from "./Photobooth";
import marqueelogo1 from "../assets/marquee_logo/marquee_logo_1.png";
import marqueelogo2 from "../assets/marquee_logo/marquee_logo_2.png";
import marqueelogo3 from "../assets/marquee_logo/marquee_logo_3.png";
import marqueelogo4 from "../assets/marquee_logo/marquee_logo_4.png";
import marqueelogo5 from "../assets/marquee_logo/marquee_logo_5.png";

gsap.registerPlugin(ScrollTrigger);

const MARQUEE_LOGOS = [marqueelogo1, marqueelogo2, marqueelogo3, marqueelogo4, marqueelogo5];
const SHOWCASE_PREVIEWS = [
  "/previews/preview_1.png",
  "/previews/preview_2.png",
  "/previews/preview_3.png",
];

/* ------------------------------------------------------------------ */
/*  Rainbow header bar                                                 */
/* ------------------------------------------------------------------ */
function LandingHeader() {
  const barRef = useRef(null);

  useEffect(() => {
    const bars = barRef.current?.querySelectorAll("[data-bar]");
    if (!bars) return;
    gsap.fromTo(
      bars,
      { scaleX: 0, transformOrigin: "left center" },
      { scaleX: 1, duration: 0.6, stagger: 0.08, ease: "power3.out", delay: 0.2 }
    );
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm">
      <div ref={barRef} className="w-full h-1.5 flex">
        {POLAROID_RAINBOW.map((color) => (
          <div key={color} data-bar style={{ backgroundColor: color, flex: 1 }} />
        ))}
      </div>
      <div className="flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">
        <BrandMark className="w-20 h-auto" />
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Full-screen cinematic hero                                         */
/* ------------------------------------------------------------------ */
function Hero({ fb }) {
  const heroRef = useRef(null);
  const logoRef = useRef(null);
  const ctaRef = useRef(null);
  const rainbowRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Hero bands reveal from top to bottom
      tl.fromTo(
        Array.from(rainbowRef.current.children),
        { scaleY: 0, transformOrigin: "top center" },
        { scaleY: 1, duration: 0.8, stagger: 0.08, ease: "power2.out" }
      );

      // Logo scales up from nothing
      tl.fromTo(
        logoRef.current,
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.0 },
        "-=0.3"
      );

      // CTA fades up
      tl.fromTo(
        ctaRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        "-=0.3"
      );

      // Parallax on scroll
      gsap.to(logoRef.current, {
        y: -80,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-16 overflow-hidden"
    >
      {/* Five equal vertical bands forming a square */}
      <div
        ref={rainbowRef}
        className="absolute top-0 left-1/2 -translate-x-1/2 flex h-[17rem] sm:h-[18rem] w-36 sm:w-44 pointer-events-none"
      >
        {POLAROID_RAINBOW.map((color) => (
          <div key={color} style={{ backgroundColor: color, flex: 1 }} />
        ))}
      </div>

      {/* Massive FOTOBO logo */}
      <div ref={logoRef} className="w-full flex justify-center mt-16 sm:mt-20">
        <BrandMark className="w-[20rem] sm:w-[28rem] md:w-[36rem] lg:w-[44rem] h-auto" />
      </div>

      {/* Subtitle */}
      <p
        className="mt-8 text-gray-400 text-sm sm:text-base tracking-wide max-w-md text-center"
        style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" }}
      >
        a browser-based photobooth. snap a strip, dress it up, download it.
      </p>

      {/* CTA */}
      <div ref={ctaRef} className="mt-10">
        <button
          onClick={() => fb.enterFlow(1)}
          className="group relative px-10 py-3.5 rounded-full font-bold text-sm tracking-widest uppercase bg-black text-white overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_rgba(0,0,0,0.2)]"
        >
          <span className="relative z-10">snap now</span>
          <span className="absolute inset-0 bg-gradient-to-r from-[#FFBE0B] via-[#FF006E] to-[#3A86FF] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <span className="absolute inset-0 bg-black group-hover:opacity-0 transition-opacity duration-500" />
        </button>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Frame showcase with GSAP scroll-triggered fade-scale               */
/* ------------------------------------------------------------------ */
function FrameShowcase({ fb }) {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const gridRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Heading line reveal
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Frame cards stagger in
      const cards = gridRef.current?.querySelectorAll("[data-frame-card]");
      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 60, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="px-6 py-24 sm:py-32">
      <h2
        ref={headingRef}
        className="text-center text-sm text-gray-400 tracking-[0.2em] uppercase mb-12"
      >
        Frame selection
      </h2>
      <div
        ref={gridRef}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-8 justify-items-center max-w-5xl mx-auto"
      >
        {FRAME_PRESETS.map((frame) => (
          <button
            key={frame.id}
            data-frame-card
            onClick={() => {
              fb.setSelectedFrame(frame.id);
              fb.enterFlow(2);
            }}
            className="group flex flex-col items-center gap-3 transition-transform duration-500 ease-out hover:-translate-y-2"
          >
            <div className="overflow-hidden rounded-sm transition-shadow duration-500 group-hover:shadow-xl">
              <FramePreview frame={frame} />
            </div>
            <span className="text-xs text-gray-400 tracking-wide group-hover:text-black transition-colors duration-300">
              {frame.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Feature text marquee with diamond separators                       */
/* ------------------------------------------------------------------ */
function FeatureMarquee() {
  const words = ["SIMPLE", "BROWSER BASED", "FILTERS", "DOWNLOAD", "FAST", "MINIMAL", "QUICK"];
  const trackRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        trackRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: trackRef.current,
            start: "top 95%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  const marqueeContent = words.map((word) => `${word} `).join("+ ");
  const repeatedContent = (marqueeContent + "+ ").repeat(6);

  return (
    <div ref={trackRef} className="mt-24 sm:mt-32 overflow-hidden border-y border-gray-200 py-5 select-none">
      <style>{`
        @keyframes fotobo-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .fotobo-marquee-track {
          display: flex;
          width: max-content;
          animation: fotobo-marquee 30s linear infinite;
        }
        .fotobo-marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div className="fotobo-marquee-track">
        <span className="text-lg sm:text-xl font-bold whitespace-nowrap pr-4 tracking-wider text-black/70">
          {repeatedContent}
        </span>
        <span
          className="text-lg sm:text-xl font-bold whitespace-nowrap pr-4 tracking-wider text-black/70"
          aria-hidden="true"
        >
          {repeatedContent}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Logo variation marquee (actual PNG assets, reverse direction)      */
/* ------------------------------------------------------------------ */
function LogoMarquee() {
  const trackRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        trackRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: trackRef.current,
            start: "top 95%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={trackRef} className="overflow-hidden border-y border-gray-200 py-6 select-none bg-white">
      <style>{`
        @keyframes fotobo-logo-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .fotobo-logo-marquee-track {
          display: flex;
          align-items: center;
          width: max-content;
          animation: fotobo-logo-marquee 25s linear infinite;
          animation-direction: reverse;
        }
        .fotobo-logo-marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div className="fotobo-logo-marquee-track">
        {Array.from({ length: 8 }).map((_, repeatIndex) =>
          MARQUEE_LOGOS.map((logo, logoIndex) => (
            <img
              key={`${repeatIndex}-${logoIndex}`}
              src={logo}
              alt=""
              className="h-8 sm:h-10 mx-8 sm:mx-12 object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
              draggable="false"
            />
          ))
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Filters & stickers with real sticker PNGs                          */
/* ------------------------------------------------------------------ */
function FiltersStickersShowcase({ fb }) {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const stickerRefs = useRef([]);

  /* Layout: scattered stickers around angled frame previews, matching mockup */
  const stickerLayout = [
    { src: "/stickers/cart.png", name: "Cart", top: "42%", left: "0%", rotate: -8, size: "w-36 sm:w-44" },
    { src: "/stickers/headphones.png", name: "Headphones", top: "76%", left: "1%", rotate: 5, size: "w-24 sm:w-28" },
    { src: "/stickers/orange.png", name: "Orange", top: "8%", left: "6%", rotate: 12, size: "w-28 sm:w-36" },
    { src: "/stickers/record.png", name: "Record", top: "4%", right: "1%", rotate: -5, size: "w-28 sm:w-36" },
    { src: "/stickers/price_tag.png", name: "Price tag", bottom: "1%", left: "14%", rotate: 15, size: "w-24 sm:w-28" },
    { src: "/stickers/tv.png", name: "TV", top: "48%", right: "0%", rotate: 8, size: "w-28 sm:w-32" },
    { src: "/stickers/cursor.png", name: "Cursor", bottom: "14%", right: "3%", rotate: -12, size: "w-20 sm:w-24" },
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Stickers fly in from edges
      stickerRefs.current.forEach((el, i) => {
        if (!el) return;
        const fromLeft = i % 2 === 0;
        gsap.fromTo(
          el,
          { x: fromLeft ? -120 : 120, opacity: 0, rotate: (i % 2 === 0 ? -30 : 30) },
          {
            x: 0,
            opacity: 1,
            rotate: 0,
            duration: 0.9,
            ease: "power3.out",
            delay: i * 0.08,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // Frame previews scale in
      const frames = sectionRef.current?.querySelectorAll("[data-showcase-frame]");
      if (frames) {
        gsap.fromTo(
          frames,
          { opacity: 0, scale: 0.8, y: 40 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="px-6 py-24 sm:py-32 bg-gray-50 relative overflow-hidden">
      <h2
        ref={headingRef}
        className="text-center text-sm text-gray-400 tracking-[0.2em] uppercase mb-14"
      >
        Filters and Stickers
      </h2>

      <div className="relative max-w-4xl mx-auto" style={{ minHeight: 420 }}>
        {/* Scattered sticker PNGs */}
        {stickerLayout.map((sticker, index) => (
          <img
            key={sticker.name}
            ref={(el) => { stickerRefs.current[index] = el; }}
            src={sticker.src}
            alt={sticker.name}
            className={`absolute z-30 ${sticker.size} object-contain select-none pointer-events-none`}
            style={{
              top: sticker.top,
              left: sticker.left,
              right: sticker.right,
              bottom: sticker.bottom,
              transform: `rotate(${sticker.rotate}deg)`,
            }}
            draggable="false"
          />
        ))}

        {/* Angled frame previews in the center */}
        <div className="flex items-center justify-center gap-0 relative" style={{ minHeight: 380 }}>
          <div
            data-showcase-frame
            className="relative z-0"
            style={{ transform: "rotate(-8deg) translateX(-20px)" }}
          >
            <img
              src={SHOWCASE_PREVIEWS[0]}
              alt="Frame preview 1"
              className="w-40 sm:w-48 h-auto object-contain"
              draggable="false"
            />
          </div>
          <div data-showcase-frame className="relative z-20" style={{ transform: "translateY(-10px)" }}>
            <img
              src={SHOWCASE_PREVIEWS[1]}
              alt="Frame preview 2"
              className="w-40 sm:w-48 h-auto object-contain"
              draggable="false"
            />
          </div>
          <div
            data-showcase-frame
            className="relative z-0"
            style={{ transform: "rotate(8deg) translateX(20px)" }}
          >
            <img
              src={SHOWCASE_PREVIEWS[2]}
              alt="Frame preview 3"
              className="w-40 sm:w-48 h-auto object-contain"
              draggable="false"
            />
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex justify-center mt-14">
        <button
          onClick={() => fb.enterFlow(1)}
          className="group px-8 py-3 rounded-full border border-black text-sm font-semibold tracking-wider uppercase transition-all duration-500 hover:bg-black hover:text-white hover:shadow-[0_0_30px_rgba(0,0,0,0.15)]"
        >
          try now
        </button>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Scrubbing text reveal (GSAP ScrollTrigger scrub)                   */
/* ------------------------------------------------------------------ */
function ScrubRevealSection() {
  const containerRef = useRef(null);
  const wordsRef = useRef([]);

  const sentence = "Snap three shots. Pick your favorite frame. Add stickers. Download your strip. All from your browser.";
  const words = sentence.split(" ");

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      wordsRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0.08 },
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: `${(i / words.length) * 60 + 10}% center`,
              end: `${((i + 1) / words.length) * 60 + 15}% center`,
              scrub: 0.5,
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [words.length]);

  return (
    <section
      ref={containerRef}
      className="py-40 sm:py-56 px-6 flex items-center justify-center"
      style={{ minHeight: "60vh" }}
    >
      <p
        className="max-w-4xl text-center text-3xl sm:text-4xl md:text-5xl font-bold leading-snug tracking-tight"
        style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" }}
      >
        {words.map((word, i) => (
          <span
            key={i}
            ref={(el) => { wordsRef.current[i] = el; }}
            className="inline-block mr-[0.35em]"
          >
            {word}
          </span>
        ))}
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */
function LandingFooter({ fb }) {
  const footerRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        footerRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 95%",
            toggleActions: "play none none none",
          },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="bg-black text-white px-6 py-16">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between gap-12">
        <div className="max-w-xs">
          <BrandMark mode="rainbow" className="w-24 h-auto mb-4" />
          <p className="text-sm text-gray-500 leading-relaxed">
            Product designer building thoughtful digital experiences.
          </p>
        </div>
        <div className="flex gap-16 text-sm text-gray-500">
          <div>
            <div className="font-semibold mb-4 text-white tracking-wide text-xs uppercase">
              Company
            </div>
            <div className="space-y-2">
              <button type="button" onClick={() => fb.openInfoPage("about")} className="block hover:text-white transition-colors duration-200">About</button>
              <button type="button" onClick={() => fb.openInfoPage("contact")} className="block hover:text-white transition-colors duration-200">Contact</button>
            </div>
          </div>
          <div>
            <div className="font-semibold mb-4 text-white tracking-wide text-xs uppercase">
              Legal
            </div>
            <div className="space-y-2">
              <button type="button" onClick={() => fb.openInfoPage("privacy")} className="block hover:text-white transition-colors duration-200">Privacy Policy</button>
              <button type="button" onClick={() => fb.openInfoPage("terms")} className="block hover:text-white transition-colors duration-200">Terms of Service</button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto text-xs text-gray-600 mt-12 pt-6 border-t border-white/10">
        Andrew Rahardja &middot; {new Date().getFullYear()} FOTOBO
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Landing page composition                                           */
/* ------------------------------------------------------------------ */
export default function LandingPage({ fb }) {
  useEffect(() => {
    // Refresh ScrollTrigger on mount to recalculate positions
    ScrollTrigger.refresh();
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <main className="overflow-x-clip w-full max-w-full">
      <LandingHeader />
      <Hero fb={fb} />
      <FeatureMarquee />
      <FrameShowcase fb={fb} />
      <LogoMarquee />
      <ScrubRevealSection />
      <FiltersStickersShowcase fb={fb} />
      <LandingFooter fb={fb} />
    </main>
  );
}