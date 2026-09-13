export function drawCroppedImageToSlot(
  context,
  image,
  destX,
  destY,
  destWidth,
  destHeight,
  targetRatio = 4 / 3
) {
  const sourceWidth = image.videoWidth || image.naturalWidth || image.width;
  const sourceHeight = image.videoHeight || image.naturalHeight || image.height;
  const imageRatio = sourceWidth / sourceHeight;
  let sourceCropWidth;
  let sourceCropHeight;

  if (imageRatio > targetRatio) {
    sourceCropHeight = sourceHeight;
    sourceCropWidth = sourceHeight * targetRatio;
  } else {
    sourceCropWidth = sourceWidth;
    sourceCropHeight = sourceWidth / targetRatio;
  }

  context.drawImage(
    image,
    (sourceWidth - sourceCropWidth) / 2,
    (sourceHeight - sourceCropHeight) / 2,
    sourceCropWidth,
    sourceCropHeight,
    destX,
    destY,
    destWidth,
    destHeight
  );
}