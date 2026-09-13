import React, { useCallback, useRef, useState } from "react";
import LandingPage from "./components/LandingPage";
import FlowLayout from "./components/FlowLayout";
import InfoPage from "./components/InfoPage";
import { FRAME_PRESETS } from "./config/framesConfig";

function useFotobo() {
  const [view, setView] = useState("landing");
  const [activeStep, setActiveStep] = useState(1);
  const [maxStepReached, setMaxStepReached] = useState(1);
  const [selectedFrame, setSelectedFrame] = useState(FRAME_PRESETS[0].id);
  const [capturedImages, setCapturedImages] = useState([]);
  const [photoOrder, setPhotoOrder] = useState([0, 1, 2]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [placedStickers, setPlacedStickers] = useState([]);
  const [cameraAllowed, setCameraAllowed] = useState(null);
  const [flash, setFlash] = useState(false);
  const [palmShutter, setPalmShutter] = useState(false);
  const mediaStreamRef = useRef(null);

  const goToStep = useCallback((step) => { setActiveStep(step); setMaxStepReached((current) => Math.max(current, step)); }, []);
  const enterFlow = useCallback((startStep = 1) => { setView("flow"); goToStep(startStep); }, [goToStep]);
  const openInfoPage = useCallback((page) => setView(page), []);
  const stopMediaStream = useCallback(() => { if (mediaStreamRef.current) { mediaStreamRef.current.getTracks().forEach((track) => track.stop()); mediaStreamRef.current = null; } }, []);
  const exitToLanding = useCallback(() => { stopMediaStream(); setView("landing"); }, [stopMediaStream]);
  const resetAll = useCallback(() => { stopMediaStream(); setCapturedImages([]); setPhotoOrder([0, 1, 2]); setPlacedStickers([]); setActiveFilter(null); setFlash(false); setCameraAllowed(null); setMaxStepReached(1); setActiveStep(1); }, [stopMediaStream]);
  const addCapturedImage = useCallback((dataUrl) => setCapturedImages((current) => [...current, dataUrl]), []);
  const swapPhoto = useCallback((index, direction) => setPhotoOrder((current) => { const nextIndex = index + direction; if (nextIndex < 0 || nextIndex > 2) return current; const next = [...current]; [next[index], next[nextIndex]] = [next[nextIndex], next[index]]; return next; }), []);
  const addSticker = useCallback((sticker) => setPlacedStickers((current) => [...current, { id: `${Date.now()}-${Math.random()}`, name: sticker.name, src: sticker.src, xPct: 45 + Math.random() * 10, yPct: 35 + Math.random() * 25, sizePct: 18, rotation: 0 }]), []);
  const updateStickerPos = useCallback((id, xPct, yPct) => setPlacedStickers((current) => current.map((sticker) => sticker.id === id ? { ...sticker, xPct, yPct } : sticker)), []);
  const updateStickerTransform = useCallback((id, transform) => setPlacedStickers((current) => current.map((sticker) => sticker.id === id ? { ...sticker, ...transform } : sticker)), []);
  const removeSticker = useCallback((id) => setPlacedStickers((current) => current.filter((sticker) => sticker.id !== id)), []);

  return { view, activeStep, maxStepReached, goToStep, enterFlow, openInfoPage, exitToLanding, resetAll, selectedFrame, setSelectedFrame, capturedImages, setCapturedImages, addCapturedImage, photoOrder, swapPhoto, activeFilter, setActiveFilter, placedStickers, addSticker, updateStickerPos, updateStickerTransform, removeSticker, cameraAllowed, setCameraAllowed, flash, setFlash, palmShutter, setPalmShutter, mediaStreamRef, stopMediaStream };
}

export default function App() {
  const fb = useFotobo();
  const infoPages = ["about", "contact", "privacy", "terms"];

  return (
    <div className="min-h-screen w-full bg-white" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" }}>
      {fb.view === "landing" && <LandingPage fb={fb} />}
      {fb.view === "flow" && <FlowLayout fb={fb} />}
      {infoPages.includes(fb.view) && <InfoPage page={fb.view} onBack={fb.exitToLanding} />}
    </div>
  );
}
