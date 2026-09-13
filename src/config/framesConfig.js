export const FRAME_DIMENSIONS = { width: 600, height: 1800 };

export const FRAME_PRESETS = [
  {
    id: 1,
    name: "receipt",
    variant: "receipt",
    imageSrc: "/frames/frame_1.png",
    ...FRAME_DIMENSIONS,
    photoSlots: [
      { x: 24, y: 160, width: 552, height: 564 },
      { x: 24, y: 160+460, width: 552, height: 564 },
      { x: 24, y: 160+460*2, width: 552, height: 564 },
    ],
  },
  {
    id: 2,
    name: "tetris",
    variant: "tetris",
    imageSrc: "/frames/frame_2.png",
    ...FRAME_DIMENSIONS,
    photoSlots: [
      { x: 24, y:-52, width: 552, height: 564 },
      { x: 24, y: -52+437, width: 552, height: 564 },
      { x: 24, y: -52+437*2, width: 552, height: 564 },
    ],
  },
  {
    id: 3,
    name: "lines",
    variant: "lines",
    imageSrc: "/frames/frame_3.png",
    ...FRAME_DIMENSIONS,
    photoSlots: [
      { x: 24, y: 100, width: 552, height: 564 },
      { x: 24, y: 100 + 462, width: 552, height: 564 },
      { x: 24, y: 100 + 462*2, width: 552, height: 564 },
    ],
  },
  {
    id: 4,
    name: "retro",
    variant: "retro",
    imageSrc: "/frames/frame_4.png",
    ...FRAME_DIMENSIONS,
    photoSlots: [
      { x: 24, y: -52, width: 552, height: 564 },
      { x: 24, y: -52+462, width: 552, height: 564 },
      { x: 24, y: -52+462*2, width: 552, height: 564 },
    ],
  },
  {
    id: 5,
    name: "newspaper",
    variant: "newspaper",
    imageSrc: "/frames/frame_5.png",
    ...FRAME_DIMENSIONS,
    photoSlots: [
      { x: 24, y: 294, width: 552, height: 564 },
      { x: 24, y: 294+430, width: 552, height: 564 },
      { x: 24, y: 294+430*2, width: 552, height: 564 },
    ],
  },
];
