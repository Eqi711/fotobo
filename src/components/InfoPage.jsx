import React from "react";
import { BrandMark } from "./Photobooth";

const PAGE_CONTENT = {
  about: {
    eyebrow: "About FOTOBO",
    title: "A little booth, anywhere.",
    body: "FOTOBO is a browser-based photobooth for making playful photo strips without an app or a download. Pick a frame, take your shots, add a little personality, and keep the result.",
  },
  contact: {
    eyebrow: "Contact",
    title: "Let’s talk.",
    body: "For questions, feedback, collaborations, or a friendly hello, email us at",
    email: true,
  },
  privacy: {
    eyebrow: "Privacy Policy",
    title: "Your photos stay yours.",
    body: "FOTOBO is designed to keep the experience in your browser. Camera images are used to create your photo strip and are not uploaded by FOTOBO. You choose when to download or share your result.",
  },
  terms: {
    eyebrow: "Terms of Service",
    title: "Keep it kind and yours.",
    body: "Use FOTOBO for personal, lawful, and respectful creative work. You are responsible for the images you capture and share. The service is provided as-is and may change as we improve it.",
  },
};

export default function InfoPage({ page, onBack }) {
  const content = PAGE_CONTENT[page] || PAGE_CONTENT.about;

  return (
    <main className="min-h-screen bg-white text-black px-6 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between">
          <button type="button" onClick={onBack} aria-label="Back to FOTOBO home">
            <BrandMark className="w-24 h-auto" />
          </button>
          <button
            type="button"
            onClick={onBack}
            className="text-xs uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors"
          >
            Back home
          </button>
        </header>

        <section className="max-w-2xl pt-28 pb-20 sm:pt-40">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-6">{content.eyebrow}</p>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-8">{content.title}</h1>
          <p className="text-base sm:text-lg leading-relaxed text-gray-500">
            {content.body}{" "}
            {content.email && (
              <a className="text-black underline underline-offset-4" href="mailto:g.andrew.rahardja@gmail.com">
                g.andrew.rahardja@gmail.com
              </a>
            )}
          </p>
        </section>

        <footer className="border-t border-gray-200 pt-6 text-xs text-gray-400">
          FOTOBO · {new Date().getFullYear()}
        </footer>
      </div>
    </main>
  );
}
