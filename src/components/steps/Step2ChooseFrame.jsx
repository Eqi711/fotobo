import React from "react";
import { FRAME_PRESETS } from "../../config/framesConfig";
import { FramePreview } from "../Photobooth";

export default function Step2ChooseFrame({ fb }) {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-bold text-center mb-6">Choose Frame</h2>
      <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-6 content-start overflow-y-auto justify-items-center py-2">
        {FRAME_PRESETS.map((frame) => (
          <button
            key={frame.id}
            onClick={() => {
              fb.setSelectedFrame(frame.id);
              setTimeout(() => fb.goToStep(3), 250);
            }}
            className={`flex flex-col items-center gap-2 p-2 rounded-lg border-2 transition ${
              fb.selectedFrame === frame.id
                ? "border-black"
                : "border-transparent hover:border-gray-300"
            }`}
          >
            <FramePreview frame={frame} />
            <span className="text-xs text-gray-600">{frame.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}