import React, { useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { FRAME_PRESETS } from "../../config/framesConfig";
import { STICKERS } from "../../config/photoboothOptions";
import { POLAROID_COLORS } from "../../config/polaroidTheme";
import { FramePreview, StickerLayer } from "../Photobooth";

export default function Step4Edit({ fb }) {
  const frameRef = useRef(null);
  const frame =
    FRAME_PRESETS.find((item) => item.id === fb.selectedFrame) ||
    FRAME_PRESETS[0];
  const orderedPhotos = fb.photoOrder.map((index) => fb.capturedImages[index]);

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-bold text-center mb-4">edit</h2>
      <div className="flex-1 flex flex-col md:flex-row gap-10 overflow-y-auto">
        <div className="flex items-start gap-4 mx-auto md:mx-0">
          <div ref={frameRef} className="relative">
            <FramePreview
              frame={frame}
              photos={orderedPhotos}
              photoFit="contain"
              size="xl"
            />
            <StickerLayer
              containerRef={frameRef}
              stickers={fb.placedStickers}
              onUpdate={fb.updateStickerPos}
              onUpdateTransform={fb.updateStickerTransform}
              onRemove={fb.removeSticker}
              editable
            />
          </div>
          <div className="flex flex-col justify-around" style={{ height: 288 }}>
            {[0, 1, 2].map((index) => (
              <div key={index} className="flex flex-col">
                <button
                  disabled={index === 0}
                  onClick={() => fb.swapPhoto(index, -1)}
                  className="p-2 disabled:opacity-30"
                  aria-label="Move photo up"
                >
                  <ChevronUp size={22} />
                </button>
                <button
                  disabled={index === 2}
                  onClick={() => fb.swapPhoto(index, 1)}
                  className="p-2 disabled:opacity-30"
                  aria-label="Move photo down"
                >
                  <ChevronDown size={22} />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-10">
          <div>
            <h3 className="text-base font-semibold text-gray-500 mb-4">frames</h3>
            <div className="flex gap-4 overflow-x-auto pb-3">
              {FRAME_PRESETS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => fb.setSelectedFrame(item.id)}
                    className={`shrink-0 rounded-md border-2 p-2 ${
                    fb.selectedFrame === item.id
                      ? "border-black"
                      : "border-transparent"
                  }`}
                >
                  <FramePreview frame={item} size="md" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-500 mb-4">stickers</h3>
            <div className="grid grid-cols-5 grid-rows-2 gap-3 max-w-sm">
              {STICKERS.map((sticker) => (
                <button
                  key={sticker.id}
                  onClick={() => fb.addSticker(sticker)}
                  className="w-16 h-16 shrink-0 flex items-center justify-center p-3 rounded-lg hover:bg-gray-100"
                  aria-label={`Add ${sticker.name} sticker`}
                >
                  <img
                    src={sticker.src}
                    alt={sticker.name}
                    className="w-14 h-14 object-contain"
                  />
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-400 mt-3">
              select a sticker to resize or rotate it, drag to move, double-click to remove
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-6">
        <button
          onClick={() => fb.goToStep(5)}
          className="px-6 py-3 rounded-full font-semibold text-white"
          style={{ backgroundColor: POLAROID_COLORS.purple }}
        >
          Continue to Download
        </button>
      </div>
    </div>
  );
}