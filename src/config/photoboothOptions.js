import { Camera, Image as ImageIcon, Aperture, Palette, Download } from "lucide-react";
import { POLAROID_COLORS } from "./polaroidTheme";

export const STEP_DEFS = [
  { id: 1, label: "Allow Camera Access", color: POLAROID_COLORS.yellow, textOn: "#171717", Icon: Camera, blurb: "Grant camera access straight from your browser. No app, no download." },
  { id: 2, label: "Choose Frame", color: POLAROID_COLORS.orange, textOn: "#171717", Icon: ImageIcon, blurb: "Pick one of five Polaroid-style templates before you strike a pose." },
  { id: 3, label: "Snap", color: POLAROID_COLORS.pink, textOn: "#ffffff", Icon: Aperture, blurb: "A 3 second countdown fires three shots, with filters if you want them." },
  { id: 4, label: "Edit", color: POLAROID_COLORS.purple, textOn: "#ffffff", Icon: Palette, blurb: "Reorder your shots, swap the frame, and drop on a sticker or two." },
  { id: 5, label: "Download", color: POLAROID_COLORS.blue, textOn: "#ffffff", Icon: Download, blurb: "Save your strip as a PNG, or jump back in and shoot another." },
];

export const FILTERS = [
  { id: "sepia", name: "Sepia", css: "sepia(0.85) contrast(1.05)" },
  { id: "bw", name: "Black and White", css: "grayscale(1)" },
  { id: "plastic", name: "Plastic Camera", css: "saturate(1.8) hue-rotate(8deg) contrast(1.1)" },
  { id: "comic", name: "Comic Book", css: "contrast(1.5) saturate(1.6) brightness(1.05)" },
  { id: "normal", name: "Normal", css: "none" },
  { id: "pencil", name: "Color Pencil", css: "saturate(0.5) contrast(0.85) brightness(1.25)" },
  { id: "glow", name: "Glow", css: "brightness(1.3) saturate(1.3) contrast(0.9)" },
  { id: "thermal", name: "Thermal Camera", css: "hue-rotate(270deg) saturate(4) contrast(1.4)" },
  { id: "xray", name: "X-Ray", css: "invert(1) grayscale(1) contrast(1.2)" },
];

export const STICKERS = [
  { id: "baloon", name: "Baloon", src: "/stickers/baloon.png" },
  { id: "cart", name: "Cart", src: "/stickers/cart.png" },
  { id: "cursor", name: "Cursor", src: "/stickers/cursor.png" },
  { id: "headphones", name: "Headphones", src: "/stickers/headphones.png" },
  { id: "orange", name: "Orange", src: "/stickers/orange.png" },
  { id: "price-tag", name: "Price tag", src: "/stickers/price_tag.png" },
  { id: "record", name: "Record", src: "/stickers/record.png" },
  { id: "rock", name: "Rock", src: "/stickers/rock.png" },
  { id: "sparkle", name: "Sparkle", src: "/stickers/sparkle.png" },
  { id: "tv", name: "TV", src: "/stickers/tv.png" },
];
