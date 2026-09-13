# FOTOBO

FOTOBO is a browser-based photobooth built with React and Vite. Create a three-photo strip, choose a frame, add a filter and stickers, then download the finished image.

## Features

- Camera access with a simulated feed fallback when a camera is unavailable
- Five editable steps that can be revisited as you work
- Five frame presets with 600 x 1800 photo-strip geometry
- Photo capture with palm-shutter support in the capture flow
- Photo reordering, filters, draggable stickers, and sticker transforms
- PNG export using the composed frame, photos, and decorations

## Getting Started

Node.js 20 or newer is recommended.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Camera access is requested by the browser when you enter the camera step. For the most reliable camera behavior, use `localhost` or a secure HTTPS origin and allow camera permission when prompted.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server with HMR |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run Oxlint |

## Photobooth Flow

1. **Camera**: allow camera access or continue with the simulated feed.
2. **Choose frame**: select one of the available photo-strip designs.
3. **Snap**: capture three photos and apply a filter.
4. **Edit**: reorder photos and place or transform stickers.
5. **Download**: review and export the finished strip as a PNG.

## Project Structure

```text
src/
	App.jsx                         Global workflow state and camera lifecycle
	components/
		LandingPage.jsx               Landing page and frame showcase
		FlowLayout.jsx                Five-step accordion shell
		Photobooth.jsx                Shared preview and branding primitives
		steps/                        One component for each workflow step
	config/
		framesConfig.js               Frame dimensions, presets, and photo slots
		photoboothOptions.js          Step metadata, filters, and stickers
		polaroidTheme.js              Shared color tokens
	utils/                          Image and crop helpers
public/
	frames/                         Frame overlay assets
	stickers/                       Sticker assets
```

## Notes

- Camera access is browser-controlled and may be unavailable in embedded previews or unsupported browsers.
- The app is client-side; captured images remain in the current browser session until the flow is reset or the page is closed.
