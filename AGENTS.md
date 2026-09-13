# Photobo Agent Guide

## Project Overview

Photobo is a Vite + React photobooth application using Tailwind CSS, Lucide icons, MediaPipe dependencies, and browser camera APIs.

The user flow is:

`Landing -> Camera Access -> Choose Frame -> Snap -> Edit -> Download`

The current UI is split into:

- `src/App.jsx`: global state, camera stream lifecycle, navigation, and view switching.
- `src/components/LandingPage.jsx`: landing page sections and entry points into the flow.
- `src/components/FlowLayout.jsx`: five-color dynamic accordion shell.
- `src/components/steps/`: one component for each photobooth step.
- `src/components/PhotoboothPrimitives.jsx`: shared logo, frame preview, sticker layer, and image composition helpers.
- `src/config/polaroidTheme.js`: Polaroid color tokens.
- `src/config/framesConfig.js`: frame dimensions, presets, and photo slot geometry.
- `src/config/photoboothOptions.js`: step metadata, filters, and stickers.

## Development Rules

- Keep global workflow state in `src/App.jsx`; pass behavior into presentational components through the existing `fb` object.
- Keep frame geometry and visual tokens in `src/config/`; do not hardcode new frame coordinates inside step components.
- Prefer small React components and existing shared primitives over duplicating preview, sticker, or export logic.
- Preserve the five-step flow and the ability to revisit completed steps.
- Use the provided `src/assets/logo.svg` for FOTOBO branding.
- Use `npm run build` after structural or behavior changes.
- Use `npm run lint` for code-quality checks. Existing lint warnings around imperative media refs and camera effects should be reviewed before introducing new warnings.
- Do not commit generated `dist/` output unless explicitly requested.

## TODO

### Phase 1: Stabilize the Foundation

- [x] Split the monolithic `App.jsx` into configuration, landing, flow, and step modules.
- [x] Add the local FOTOBO SVG logo asset to shared branding.
- [x] Keep the global state flow working with simulated camera fallback.

### Phase 2: Frame Configuration and Rendering

- [ ] Expand `framesConfig.js` with explicit per-frame `overlaySrc` values from `public/frames/`.
- [ ] Define three frame slots per preset using normalized or percentage-based coordinates.
- [ ] Render each photo with absolute positioning and a fixed 3:4 aspect ratio inside a 600x1800 canvas wrapper.
- [ ] Layer transparent frame PNG/SVG overlays above photos with `pointer-events: none`.
- [ ] Make the on-screen `FramePreview` and downloaded output use the same frame geometry.

### Phase 3: Camera and Capture Experience

- [x] Request camera access with `navigator.mediaDevices.getUserMedia({ video: true })`.
- [x] Provide a simulated feed when camera access is unavailable.
- [ ] Add a robust camera permission/error state with retry and browser guidance.
- [ ] Add MediaPipe Hands processing for the palm shutter using `@mediapipe/hands`.
- [ ] Trigger capture only after an open palm is detected continuously for about one second.
- [ ] Stop MediaPipe processing and camera tracks when leaving the snap step or returning home.
- [ ] Add a real shutter sound.
- [ ] Extend the flash overlay to approximately 300ms and ensure it does not block navigation.

### Phase 4: FX Mode

- [ ] Replace the current filter modal with a 3x3 live FX preview grid.
- [ ] Render nine filtered views from one camera stream or synchronized canvas snapshots.
- [ ] Include sepia, grayscale, glow, invert, normal, thermal, X-ray, hue rotate, and saturation presets.
- [ ] Select a grid cell to apply its filter to the main feed and close FX mode.
- [ ] Keep the selected filter consistent across capture, preview, and export.
- [ ] Add an accessible label and keyboard focus state to every FX cell.

### Phase 5: Edit Workspace

- [x] Support photo reordering with up/down controls and `[0, 1, 2]` order state.
- [x] Add a draggable sticker layer and double-click removal.
- [ ] Extend sticker state to `{ id, x, y, scale, rotation, iconSrc }`.
- [ ] Add sticker resizing and rotation controls.
- [ ] Add touch-friendly drag behavior with pointer events instead of separate mouse/touch listeners.
- [ ] Add a delete affordance and selected-sticker state.
- [ ] Ensure sticker coordinates stay aligned between preview dimensions and exported dimensions.
- [ ] Add drag-and-drop photo reordering as an optional enhancement.

### Phase 6: Download and Export

- [ ] Replace the hand-drawn export path with `html-to-image` `toPng(node)` for pixel parity with the DOM preview.
- [ ] Export frame overlay, photos, filters, and stickers in one image.
- [ ] Add export progress and a recoverable error message in the UI.
- [ ] Verify downloaded PNG dimensions are exactly 600x1800.
- [ ] Add a filename strategy based on date/time without exposing private camera data.
- [ ] Test download behavior in Chromium, Firefox, and Safari where available.

### Phase 7: Landing Page Polish

- [x] Add hero CTA, stacked step cards, frame selection, filters/stickers showcase, and footer.
- [ ] Add the second feature ticker with star separators.
- [ ] Add the logo text variation marquee using barcode, newspaper, pixel, and playful treatments.
- [ ] Make frame showcase buttons announce the selected frame and target step to screen readers.
- [ ] Add reduced-motion handling for sticky sections and marquees.
- [ ] Check horizontal overflow and typography at small mobile widths.
