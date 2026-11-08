/**
 * Social sharing and clipboard utilities
 */

export function shareViaWhatsApp(text, url = window.location.href) {
  const fullMessage = `${text}\n\n${url}`;
  const encoded = encodeURIComponent(fullMessage);
  window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank', 'noopener,noreferrer');
}

export async function shareNative(data = {}) {
  const shareData = {
    title: data.title || 'The Art of Light — A Digital Diwali Experience',
    text: data.text || 'Happy Diwali! Explore this beautiful celebration of lights and traditions.',
    url: data.url || window.location.href,
  };

  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData);
      return { success: true, method: 'native' };
    } catch (err) {
      if (err.name === 'AbortError') {
        return { success: false, method: 'aborted' };
      }
    }
  }

  // Fallback: copy to clipboard
  return copyToClipboard(`${shareData.text}\n${shareData.url}`);
}

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return { success: true, method: 'clipboard' };
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    return { success: successful, method: 'clipboard-fallback' };
  }
}

