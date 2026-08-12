const MAX_STORED_IMAGE_LENGTH = 1400000;
export const ACCEPTED_IMAGE_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);
export const ACCEPTED_AUDIO_TYPES = new Set(['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/x-m4a']);

export const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onerror = () => reject(new Error('mediaFileReadError'));
  reader.onload = () => resolve(String(reader.result || ''));
  reader.readAsDataURL(file);
});

export const prepareImage = async (file) => {
  if (!ACCEPTED_IMAGE_TYPES.has(file.type)) throw new Error('mediaImageTypeError');
  if (file.size > 5 * 1024 * 1024) throw new Error('mediaImageSizeError');
  const original = await readFileAsDataUrl(file);
  if (original.length <= MAX_STORED_IMAGE_LENGTH) return original;

  const image = await new Promise((resolve, reject) => {
    const node = new Image();
    node.onload = () => resolve(node);
    node.onerror = () => reject(new Error('mediaImageProcessError'));
    node.src = original;
  });
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  let maxSize = 2200;
  let quality = .9;

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));
    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const compressed = canvas.toDataURL('image/jpeg', quality);
    if (compressed.length <= MAX_STORED_IMAGE_LENGTH) return compressed;
    if (quality > .58) quality -= .1;
    else { maxSize = Math.round(maxSize * .82); quality = .78; }
  }
  throw new Error('mediaImageStorageError');
};
