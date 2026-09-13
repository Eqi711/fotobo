import React, { useEffect, useRef, useState } from "react";
import { Camera } from "lucide-react";
import "@mediapipe/hands";
import { FILTERS } from "../../config/photoboothOptions";
import { POLAROID_COLORS } from "../../config/polaroidTheme";
import { drawCroppedImageToSlot } from "../../utils/imageCrop";

function FxGrid({ cameraStream, hasLiveVideo, onSelect }) {
  const videoRefs = useRef([]);

  useEffect(() => {
    if (!cameraStream) return undefined;

    const videos = videoRefs.current;
    videos.forEach((video) => {
      if (!video) return;
      video.srcObject = cameraStream;
      video.play().catch(() => {});
    });

    return () => {
      videos.forEach((video) => {
        if (!video) return;
        video.pause();
        video.srcObject = null;
      });
    };
  }, [cameraStream]);

  return (
    <div className="grid h-full w-full grid-cols-3 grid-rows-3 gap-0 overflow-hidden" aria-label="Choose a live camera effect">
      {FILTERS.map((filter, index) => (
        <button
          type="button"
          key={filter.id}
          onClick={() => onSelect(filter.id)}
          aria-label={`Use ${filter.name} effect`}
          className="group relative min-w-0 rounded-none border-0 p-0 text-left focus:outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-black"
        >
          <div className="relative h-full overflow-hidden rounded-none bg-gray-300">
            {hasLiveVideo ? (
              <video
                ref={(element) => { videoRefs.current[index] = element; }}
                autoPlay
                muted
                playsInline
                aria-hidden="true"
                className="h-full w-full object-cover object-center"
                style={{ filter: filter.css }}
              />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center text-gray-500"
                style={{ filter: filter.css }}
              >
                <Camera size={28} strokeWidth={1.3} />
              </div>
            )}
          </div>
          <span className="pointer-events-none absolute inset-x-0 bottom-0 block truncate bg-black/65 px-1 py-1 text-center text-xs leading-tight text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            {filter.name}
          </span>
        </button>
      ))}
    </div>
  );
}

export default function Step3Snap({ fb }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [hasLiveVideo, setHasLiveVideo] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [count, setCount] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showFx, setShowFx] = useState(false);
  const [flashPulse, setFlashPulse] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [cameraAttempt, setCameraAttempt] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(3);
  const [showTimerOptions, setShowTimerOptions] = useState(false);
  const [palmStatus, setPalmStatus] = useState("Show your palm to take a photo");
  const captureInProgressRef = useRef(false);
  const shutterButtonRef = useRef(null);
  const palmStartedAtRef = useRef(null);
  const palmLostAtRef = useRef(null);
  const palmArmedRef = useRef(true);

  const currentFilterCss = () =>
    (FILTERS.find((filter) => filter.id === fb.activeFilter) || {}).css ||
    "none";

  useEffect(() => {
    let cancelled = false;
    const attach = (stream) => {
      setCameraStream(stream);
      setHasLiveVideo(true);
      setCameraError(false);
    };
    const setup = async () => {
      if (fb.mediaStreamRef.current) return attach(fb.mediaStreamRef.current);
      if (fb.cameraAllowed === false) return;
      try {
        if (!navigator.mediaDevices?.getUserMedia)
          throw new Error("unsupported");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
        if (cancelled) stream.getTracks().forEach((track) => track.stop());
        else {
          fb.mediaStreamRef.current = stream;
          fb.setCameraAllowed(true);
          attach(stream);
        }
      } catch {
        fb.setCameraAllowed(false);
        setCameraError(true);
      }
    };
    setup();
    return () => {
      cancelled = true;
    };
  }, [cameraAttempt]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !cameraStream) return undefined;

    video.srcObject = cameraStream;
    video.play().catch(() => {});

    return () => {
      video.pause();
      video.srcObject = null;
    };
  }, [cameraStream, showFx]);

  useEffect(() => {
    if (!fb.palmShutter) {
      palmStartedAtRef.current = null;
      palmLostAtRef.current = null;
      palmArmedRef.current = true;
      setPalmStatus("Show your palm to take a photo");
      return undefined;
    }

    if (!hasLiveVideo || !cameraStream) {
      setPalmStatus("Camera video is required");
      return undefined;
    }

    let cancelled = false;
    let animationFrameId;
    let isSending = false;
    const hands = new window.Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    hands.onResults((results) => {
      if (cancelled) return;
      const landmarks = results.multiHandLandmarks?.[0];
      const fingersAreOpen = landmarks
        ? [
            [8, 6],
            [12, 10],
            [16, 14],
            [20, 18],
          ].every(([tip, pip]) => {
            const tipDistance = Math.hypot(
              landmarks[tip].x - landmarks[0].x,
              landmarks[tip].y - landmarks[0].y
            );
            const pipDistance = Math.hypot(
              landmarks[pip].x - landmarks[0].x,
              landmarks[pip].y - landmarks[0].y
            );
            return tipDistance > pipDistance * 1.05;
          })
        : false;

      if (!fingersAreOpen) {
        if (palmLostAtRef.current === null) palmLostAtRef.current = performance.now();
        if (performance.now() - palmLostAtRef.current > 250) {
          palmStartedAtRef.current = null;
          palmArmedRef.current = true;
          setPalmStatus("Show your palm to take a photo");
        }
        return;
      }

      palmLostAtRef.current = null;
      if (!palmArmedRef.current) {
        setPalmStatus("Lower your palm to rearm");
        return;
      }

      const now = performance.now();
      if (palmStartedAtRef.current === null) palmStartedAtRef.current = now;
      const heldFor = now - palmStartedAtRef.current;
      if (heldFor < 1000) {
        setPalmStatus("Hold your palm steady...");
        return;
      }

      if (captureInProgressRef.current) return;
      palmStartedAtRef.current = null;
      palmArmedRef.current = false;
      setPalmStatus("Photo timer started");
      shutterButtonRef.current?.click();
    });

    const processFrame = async () => {
      if (cancelled) return;
      const video = videoRef.current;
      if (video?.readyState >= 2 && !isSending) {
        isSending = true;
        try {
          await hands.send({ image: video });
        } catch {
          if (!cancelled) setPalmStatus("Palm shutter is unavailable");
        } finally {
          isSending = false;
        }
      }
      animationFrameId = requestAnimationFrame(processFrame);
    };

    processFrame();
    return () => {
      cancelled = true;
      palmStartedAtRef.current = null;
      cancelAnimationFrame(animationFrameId);
      hands.close();
    };
  }, [cameraStream, fb.palmShutter, hasLiveVideo]);

  function capturePhotoOnce() {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvas.width = 1200;
    canvas.height = 900;
    context.filter = currentFilterCss();
    if (hasLiveVideo && videoRef.current?.videoWidth) {
      drawCroppedImageToSlot(
        context,
        videoRef.current,
        0,
        0,
        canvas.width,
        canvas.height
      );
    } else {
      const gradient = context.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );
      gradient.addColorStop(0, POLAROID_COLORS.pink);
      gradient.addColorStop(1, POLAROID_COLORS.purple);
      context.fillStyle = gradient;
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "white";
      context.font = "bold 28px monospace";
      context.textAlign = "center";
      context.fillText(
        `shot ${fb.capturedImages.length + 1}`,
        canvas.width / 2,
        canvas.height / 2
      );
    }
    if (fb.flash) {
      setFlashPulse(true);
      setTimeout(() => setFlashPulse(false), 150);
    }
    fb.addCapturedImage(canvas.toDataURL("image/png"));
  }

  function countdown() {
    return new Promise((resolve) => {
      setCount(timerSeconds);
      const id = setInterval(
        () =>
          setCount((value) => {
            if (value <= 1) {
              clearInterval(id);
              resolve();
              return null;
            }
            return value - 1;
          }),
        1000
      );
    });
  }

  async function captureNextPhoto() {
    if (captureInProgressRef.current || isCapturing) return;
    if (fb.capturedImages.length >= 3) return;
    captureInProgressRef.current = true;
    setIsCapturing(true);
    setShowTimerOptions(false);
    try {
      await countdown();
      capturePhotoOnce();
      if (fb.capturedImages.length + 1 >= 3) fb.goToStep(4);
    } finally {
      captureInProgressRef.current = false;
      setIsCapturing(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-bold text-center mb-4">Snap</h2>
      <div className="relative flex-1 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center min-h-0">
        {showFx ? (
          <FxGrid
            cameraStream={cameraStream}
            hasLiveVideo={hasLiveVideo}
            onSelect={(filterId) => {
              fb.setActiveFilter(filterId);
              setShowFx(false);
            }}
          />
        ) : (
          <div className="relative w-full max-h-full aspect-[4/3] overflow-hidden rounded-md bg-gray-200">
            {hasLiveVideo ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                onLoadedMetadata={() => videoRef.current?.play().catch(() => {})}
                className="w-full h-full object-cover object-center"
                style={{ filter: currentFilterCss() }}
              />
            ) : (
              <div
                className="flex h-full w-full flex-col items-center justify-center gap-3 text-gray-500"
                style={{ filter: currentFilterCss() }}
              >
                <Camera size={72} strokeWidth={1.3} />
                <span className="text-sm">simulated feed</span>
              </div>
            )}
          </div>
        )}
        {cameraError && (
          <div className="absolute inset-x-4 top-4 rounded-lg bg-white/95 p-3 text-center shadow-lg">
            <p className="text-sm text-gray-700">Camera access is unavailable. Check your browser permission.</p>
            <button
              type="button"
              onClick={() => {
                setCameraError(false);
                fb.setCameraAllowed(null);
                setCameraAttempt((attempt) => attempt + 1);
              }}
              className="mt-2 text-sm font-semibold underline"
            >
              Try again
            </button>
          </div>
        )}
        {count !== null && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
          >
            <span className="text-white font-bold" style={{ fontSize: 96 }}>
              {count}
            </span>
          </div>
        )}
        {flashPulse && <div className="fixed inset-0 z-[100] bg-white pointer-events-none" />}
        <div className="absolute bottom-3 left-3 flex gap-1">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor:
                  index < fb.capturedImages.length
                    ? "#ffffff"
                    : "rgba(255,255,255,0.35)",
              }}
            />
          ))}
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
      <div className="flex items-center justify-center gap-6 sm:gap-8 mt-6">
        <button
          type="button"
          onClick={() => fb.setPalmShutter((value) => !value)}
          disabled={isCapturing}
          aria-label="Toggle palm shutter"
          className="p-2 rounded-full disabled:cursor-not-allowed disabled:opacity-40"
        >
          <img
            src={fb.palmShutter ? "/icons/palm_active.png" : "/icons/palm_inactive.png"}
            alt=""
            className="h-5 w-5 object-contain"
            aria-hidden="true"
          />
        </button>
        {fb.palmShutter && (
          <span className="absolute mt-24 text-center text-xs text-gray-500" aria-live="polite">
            {palmStatus}
          </span>
        )}
        <button
          type="button"
          onClick={() => fb.setFlash((value) => !value)}
          disabled={isCapturing}
          aria-label="Toggle flash"
          className="p-2 rounded-full disabled:cursor-not-allowed disabled:opacity-40"
        >
          <img
            src={fb.flash ? "/icons/flash_active.png" : "/icons/flash_inactive.png"}
            alt=""
            className="h-5 w-5 object-contain"
            aria-hidden="true"
          />
        </button>
        <button
          type="button"
          onClick={captureNextPhoto}
          ref={shutterButtonRef}
          disabled={showFx || isCapturing}
          aria-label="Take photo"
          title={!fb.activeFilter ? "Choose an FX first" : "Take photo"}
          className="w-16 h-16 rounded-full border-4 border-gray-800 bg-white shadow-lg active:scale-95 transition disabled:cursor-not-allowed disabled:opacity-40"
        />
        <button
          onClick={() => setShowFx((value) => !value)}
          disabled={isCapturing}
          aria-label={showFx ? "Close FX mode" : "Open FX mode"}
          className={`p-2 rounded-full text-sm font-semibold transition-opacity hover:opacity-100 focus:outline-none focus-visible:opacity-100 disabled:cursor-not-allowed disabled:opacity-40 ${fb.activeFilter && fb.activeFilter !== "normal" ? "opacity-100" : "opacity-50"}`}
        >
          fx
        </button>
        <div className="relative" aria-label="Capture timer">
          <button
            type="button"
            onClick={() => setShowTimerOptions((value) => !value)}
            disabled={isCapturing}
            aria-label={`Capture timer: ${timerSeconds} seconds`}
            aria-expanded={showTimerOptions}
            className="flex items-center gap-1 rounded-full px-2 py-1 text-sm font-semibold text-gray-500 hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-black disabled:cursor-not-allowed disabled:opacity-40"
          >
            {timerSeconds}s
          </button>
          {showTimerOptions && (
            <div className="absolute left-full top-1/2 ml-2 flex -translate-y-1/2 gap-1 rounded-full bg-white p-1 shadow-lg">
              {[3, 5, 10].map((seconds) => (
                <button
                  type="button"
                  key={seconds}
                  onClick={() => {
                    setTimerSeconds(seconds);
                    setShowTimerOptions(false);
                  }}
                  disabled={isCapturing}
                  aria-label={`Set timer to ${seconds} seconds`}
                  aria-pressed={timerSeconds === seconds}
                  className={`rounded-full px-2 py-1 text-sm font-semibold transition-colors ${timerSeconds === seconds ? "bg-black text-white" : "text-gray-300 hover:bg-gray-100 hover:text-gray-700"}`}
                >
                  {seconds}s
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}