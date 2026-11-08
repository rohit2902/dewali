import { toPng } from 'html-to-image';

/**
 * Exports a DOM node as a PNG greeting card.
 * Ensures font loading completes before capture.
 *
 * @param {HTMLElement} element
 * @param {string} fileName
 * @returns {Promise<boolean>}
 */
export async function downloadGreeting(element, fileName = 'diwali-greeting.png') {
  if (!element) return false;

  try {
    // Wait for fonts (especially Hindi Noto fonts) to be fully ready
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    const dataUrl = await toPng(element, {
      quality: 0.98,
      pixelRatio: 2, // Crisp retina output
      cacheBust: true,
      skipFonts: false,
    });

    const link = document.createElement('a');
    link.download = fileName;
    link.href = dataUrl;
    link.click();
    return true;
  } catch (error) {
    console.error('Failed to export greeting PNG:', error);
    return false;
  }
}

