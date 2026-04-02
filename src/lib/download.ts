/**
 * Tải file về máy trực tiếp (không mở tab mới)
 */
export const downloadFile = async (url: string, filename?: string) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    
    // Tạo tên file từ URL nếu chưa có
    if (!filename) {
      const urlParts = url.split('/');
      filename = decodeURIComponent(urlParts[urlParts.length - 1].split('?')[0]) || 'download';
    }
    
    // Tạo link tạm và click để tải
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Download error:', error);
    // Fallback: mở trong tab mới nếu fetch thất bại
    window.open(url, '_blank');
  }
};
