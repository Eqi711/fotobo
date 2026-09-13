import React from "react";
import { RotateCw } from "lucide-react";
import { FRAME_DIMENSIONS } from "../config/framesConfig";
import logoSvg from "../assets/logo.svg";
import { drawCroppedImageToSlot } from "../utils/imageCrop";

export function BrandMark({ mode = "mono", color = "#111111", className = "" }) {
  const style =
    mode === "mono" && color !== "#ffffff"
      ? { filter: "brightness(0)" }
      : undefined;
  return (
    <img src={logoSvg} alt="FOTOBO logo" className={className} style={style} />
  );
}

export function FramePreview({
  frame,
  photos = [],
  photoFit = "cover",
  size = "md",
}) {
  const widthClass =
    size === "sm" ? "w-16" : size === "lg" ? "w-56" : size === "xl" ? "w-72" : "w-40";

  return (
    <div
      className={`${widthClass} relative overflow-hidden rounded-sm shadow-md select-none`}
      data-frame-size={`${FRAME_DIMENSIONS.width}x${FRAME_DIMENSIONS.height}`}
    >
      <img
        src={frame.imageSrc}
        alt={`${frame.name} frame`}
        className="relative z-20 block w-full h-auto"
      />
      {photos.map((photo, index) => {
        const slot = frame.photoSlots[index];
        if (!photo || !slot) return null;

        return (
          <img
            key={`${photo}-${index}`}
            src={photo}
            alt={`Captured photo ${index + 1}`}
            className={`absolute z-10 object-${photoFit} object-center`}
            style={{
              left: `${(slot.x / FRAME_DIMENSIONS.width) * 100}%`,
              top: `${(slot.y / FRAME_DIMENSIONS.height) * 100}%`,
              width: `${(slot.width / FRAME_DIMENSIONS.width) * 100}%`,
              height: `${(slot.height / FRAME_DIMENSIONS.height) * 100}%`,
            }}
          />
        );
      })}
    </div>
  );
}

export function StickerLayer({
  containerRef,
  stickers,
  onUpdate,
  onUpdateTransform,
  onRemove,
  editable,
}) {
  const [selectedId, setSelectedId] = React.useState(null);

  function handleDown(event, sticker) {
    if (!editable) return;
    event.preventDefault();
    event.stopPropagation();
    setSelectedId(sticker.id);

    const startX = event.clientX;
    const startY = event.clientY;
    const startXPercent = sticker.xPct;
    const startYPercent = sticker.yPct;

    const move = (moveEvent) => {
      const rect = containerRef.current.getBoundingClientRect();
      const x = moveEvent.clientX;
      const y = moveEvent.clientY;
      onUpdate(
        sticker.id,
        Math.min(100, Math.max(0, startXPercent + ((x - startX) / rect.width) * 100)),
        Math.min(100, Math.max(0, startYPercent + ((y - startY) / rect.height) * 100))
      );
    };

    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  function handleResizeDown(event, sticker) {
    event.preventDefault();
    event.stopPropagation();
    const stickerElement = event.currentTarget.parentElement;
    const startSize = sticker.sizePct || 18;
    const startDistance = Math.hypot(
      event.clientX - stickerElement.getBoundingClientRect().left - stickerElement.offsetWidth / 2,
      event.clientY - stickerElement.getBoundingClientRect().top - stickerElement.offsetHeight / 2
    );

    const move = (moveEvent) => {
      const rect = stickerElement.getBoundingClientRect();
      const distance = Math.hypot(
        moveEvent.clientX - rect.left - rect.width / 2,
        moveEvent.clientY - rect.top - rect.height / 2
      );
      onUpdateTransform(sticker.id, {
        sizePct: startSize * (distance / startDistance),
      });
    };

    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  function handleRotateDown(event, sticker) {
    event.preventDefault();
    event.stopPropagation();
    const stickerElement = event.currentTarget.parentElement;
    const rect = stickerElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const startAngle = Math.atan2(event.clientY - centerY, event.clientX - centerX) * (180 / Math.PI);
    const initialRotation = sticker.rotation || 0;

    const move = (moveEvent) => {
      const angle = Math.atan2(moveEvent.clientY - centerY, moveEvent.clientX - centerX) * (180 / Math.PI);
      onUpdateTransform(sticker.id, { rotation: initialRotation + angle - startAngle });
    };

    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  return (
    <div
      className="absolute inset-0 z-30 pointer-events-auto"
      onPointerDown={() => editable && setSelectedId(null)}
    >
      {stickers.map((sticker) => (
        <div
          key={sticker.id}
          onPointerDown={(event) => handleDown(event, sticker)}
          onDoubleClick={() => editable && onRemove(sticker.id)}
          className={
            editable
              ? "absolute pointer-events-auto cursor-move select-none"
              : "absolute select-none"
          }
          style={{
            left: `${sticker.xPct}%`,
            top: `${sticker.yPct}%`,
            width: `${sticker.sizePct || 18}%`,
            aspectRatio: "1",
            transform: `translate(-50%, -50%) rotate(${sticker.rotation || 0}deg)`,
            touchAction: "none",
            border: editable && selectedId === sticker.id ? "1px dashed #111111" : "1px solid transparent",
          }}
        >
          <img
            src={sticker.src}
            alt={sticker.name}
            className="block w-full h-full object-contain"
            draggable="false"
          />
          {editable && selectedId === sticker.id && (
            <>
              <button
                type="button"
                aria-label="Rotate sticker"
                onPointerDown={(event) => handleRotateDown(event, sticker)}
                className="absolute -top-3 -right-3 w-5 h-5 rounded-full bg-black text-white text-xs leading-none cursor-crosshair"
              >
                <RotateCw size={12} className="mx-auto" />
              </button>
              <button
                type="button"
                aria-label="Resize sticker"
                onPointerDown={(event) => handleResizeDown(event, sticker)}
                className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border border-black cursor-nwse-resize"
              />
            </>
          )}
        </div>
      ))}
    </div>
  );
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

export async function composeFinalImage({
  frame,
  photos,
  stickers,
  filterCss,
}) {
  const canvas = document.createElement("canvas");
  canvas.width = FRAME_DIMENSIONS.width;
  canvas.height = FRAME_DIMENSIONS.height;
  const context = canvas.getContext("2d");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);

  const headerHeight =
    frame.variant === "newspaper" ? 150 : frame.variant === "receipt" ? 110 : 0;
  const footerHeight =
    frame.variant === "newspaper" || frame.variant === "receipt" ? 130 : 210;
  const pad = 24;
  const gap = 18;
  const slotHeight =
    (canvas.height - footerHeight - headerHeight - pad * 2 - gap * 2) / 3;
  const slotWidth = canvas.width - pad * 2;
  const fallbackSlots = [
    { x: pad, y: pad + headerHeight, width: slotWidth, height: slotHeight },
    {
      x: pad,
      y: pad + headerHeight + slotHeight + gap,
      width: slotWidth,
      height: slotHeight,
    },
    {
      x: pad,
      y: pad + headerHeight + (slotHeight + gap) * 2,
      width: slotWidth,
      height: slotHeight,
    },
  ];
  const photoSlots = frame.photoSlots || fallbackSlots;

  for (let index = 0; index < 3; index += 1) {
    const slot = photoSlots[index];
    if (!slot) continue;
    if (!photos[index]) {
      context.fillStyle = "#e5e7eb";
      context.fillRect(slot.x, slot.y, slot.width, slot.height);
      continue;
    }
    try {
      const image = await loadImage(photos[index]);
      context.save();
      context.beginPath();
      context.rect(slot.x, slot.y, slot.width, slot.height);
      context.clip();
      context.filter = filterCss && filterCss !== "none" ? filterCss : "none";
      drawCroppedImageToSlot(
        context,
        image,
        slot.x,
        slot.y,
        slot.width,
        slot.height,
        slot.width / slot.height
      );
      context.restore();
    } catch {
      context.fillStyle = "#e5e7eb";
      context.fillRect(slot.x, slot.y, slot.width, slot.height);
    }
  }

  const footerY = canvas.height - footerHeight;
  if (frame.variant !== "newspaper" && frame.variant !== "receipt") {
    context.fillStyle = "#111111";
    context.fillRect(0, footerY, canvas.width, footerHeight);
    context.fillStyle = "#ffffff";
    context.font = "bold 42px monospace";
    context.textAlign = "center";
    context.fillText("FOTOBO", canvas.width / 2, footerY + footerHeight / 2 + 15);
  } else {
    context.fillStyle = "#666666";
    context.font = "16px monospace";
    context.textAlign = "center";
    context.fillText("fotobo.app", canvas.width / 2, footerY + 50);
  }

  for (const sticker of stickers) {
    try {
      const image = await loadImage(sticker.src);
      const width = (sticker.sizePct || 18) / 100 * canvas.width;
      const height = width * image.height / image.width;
      context.save();
      context.translate(
        (sticker.xPct / 100) * canvas.width,
        (sticker.yPct / 100) * canvas.height
      );
      context.rotate(((sticker.rotation || 0) * Math.PI) / 180);
      context.drawImage(
        image,
        -width / 2,
        -height / 2,
        width,
        height
      );
      context.restore();
    } catch {}
  }

  return canvas.toDataURL("image/png");
}