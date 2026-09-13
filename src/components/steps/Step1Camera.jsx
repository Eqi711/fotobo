import React, { useState } from "react";
import { Camera } from "lucide-react";
import { POLAROID_COLORS } from "../../config/polaroidTheme";

export default function Step1Camera({ fb }) {
  const [status, setStatus] = useState("idle");
  async function handleAllow() {
    setStatus("requesting");
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("unsupported");
      fb.mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      fb.setCameraAllowed(true);
      setStatus("granted");
      setTimeout(() => fb.goToStep(2), 350);
    } catch {
      fb.setCameraAllowed(false);
      setStatus("denied");
    }
  }
  return <div className="flex flex-col items-center justify-between h-full text-center py-4"><h2 className="text-2xl font-bold">Allow Camera Access</h2><div className="flex flex-col items-center gap-6"><Camera size={88} strokeWidth={1.3} /><p className="text-gray-600 max-w-xs">FOTOBO needs camera access to take your photos</p>{status === "denied" && <p className="text-sm max-w-xs" style={{ color: POLAROID_COLORS.pink }}>Camera unavailable here. Check browser permissions or continue with a simulated feed.</p>}</div><div className="flex flex-col items-center gap-3"><button onClick={handleAllow} disabled={status === "requesting"} className="px-6 py-3 rounded-full font-semibold disabled:opacity-60" style={{ backgroundColor: POLAROID_COLORS.yellow, color: "#171717" }}>{status === "requesting" ? "Requesting..." : status === "denied" ? "Try Camera Again" : "Allow Access & Continue"}</button><button onClick={() => { fb.setCameraAllowed(false); fb.goToStep(2); }} className="text-sm underline text-gray-500">Skip for now</button></div></div>;
}
