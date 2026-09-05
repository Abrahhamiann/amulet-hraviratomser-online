import React, { useEffect, useRef } from 'react';

// Shared medium pace for every catalog/modal preview, including future templates.
const PREVIEW_PIXELS_PER_SECOND = 60;
const SCROLL_LEG_FRACTION = 0.45;

export default function ScrollingPreviewImage({ onLoad, ...props }) {
  const imageRef = useRef(null);

  const updateMotion = () => {
    const image = imageRef.current;
    const viewport = image?.parentElement;
    if (!image || !viewport || !image.naturalWidth) return;
    const renderedHeight = image.clientWidth * image.naturalHeight / image.naturalWidth;
    const distance = Math.max(0, renderedHeight - viewport.clientHeight);
    image.style.setProperty('--template-preview-distance', `${distance}px`);
    image.style.setProperty('--template-preview-duration', `${Math.max(0.1, distance / PREVIEW_PIXELS_PER_SECOND / SCROLL_LEG_FRACTION)}s`);
  };

  useEffect(() => {
    const image = imageRef.current;
    const viewport = image?.parentElement;
    if (!image || !viewport) return undefined;
    updateMotion();
    const observer = new ResizeObserver(updateMotion);
    observer.observe(viewport);
    observer.observe(image);
    return () => observer.disconnect();
  }, [props.src]);

  return <img {...props} ref={imageRef} onLoad={(event) => {
    updateMotion();
    onLoad?.(event);
  }} />;
}
