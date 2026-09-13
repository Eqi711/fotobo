import React, { useRef, useState } from "react";
import { Download, RotateCcw } from "lucide-react";
import { toPng } from "html-to-image";
import { FRAME_PRESETS } from "../../config/framesConfig";
import { POLAROID_COLORS } from "../../config/polaroidTheme";
import { FramePreview, StickerLayer } from "../Photobooth";

export default function Step5Download({ fb }) {
  const frameRef = useRef(null);
  const frame =
    FRAME_PRESETS.find((item) => item.id === fb.selectedFrame) ||
    FRAME_PRESETS[0];
  const orderedPhotos = fb.photoOrder.map((index) => fb.capturedImages[index]);
  const [busy, setBusy] = useState(false);
  async function handleDownload() {
    setBusy(true);
    try {
      const dataUrl = await toPng(frameRef.current, {
        cacheBust: true,
        pixelRatio: 600 / frameRef.current.offsetWidth,
      });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "fotobo-photo.png";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download failed", error);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col h-full items-center">
      <h2 className="text-2xl font-bold text-center mb-6">download</h2>
      <div
        className="relative flex-1 flex items-center justify-center"
      >
        <div ref={frameRef} className="relative overflow-hidden">
          <FramePreview
            frame={frame}
            photos={orderedPhotos}
            photoFit="contain"
            size="xl"
          />
          <StickerLayer
            containerRef={frameRef}
            stickers={fb.placedStickers}
            onUpdate={() => {}}
            onRemove={() => {}}
            editable={false}
          />
        </div>
      </div>
      <div className="flex flex-col items-center gap-3 mt-6 mb-2">
        <button
          onClick={handleDownload}
          disabled={busy}
          className="px-6 py-3 rounded-full font-semibold text-white flex items-center gap-2 disabled:opacity-60"
          style={{ backgroundColor: POLAROID_COLORS.blue }}
        >
          <Download size={18} />
          {busy ? "Preparing…" : "Download PNG"}
        </button>
        <button
          onClick={fb.resetAll}
          className="text-sm underline text-gray-500 flex items-center gap-1"
        >
          <RotateCcw size={14} />
          Take Another Photo
        </button>
      </div>
    </div>
  );
}