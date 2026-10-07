/**
 * Client-side image resize + WebP encode before upload.
 * Videos and non-image files are returned unchanged.
 */
const MAX_EDGE = 1600
const WEBP_QUALITY = 0.8

function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = (err) => {
      URL.revokeObjectURL(url)
      reject(err || new Error('Failed to decode image'))
    }
    img.src = url
  })
}

function canvasToWebpBlob(canvas, quality) {
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => resolve(blob),
      'image/webp',
      quality
    )
  })
}

/**
 * @param {File} file
 * @returns {Promise<{ file: File, width: number|null, height: number|null, compressed: boolean }>}
 */
export async function compressImageForUpload(file) {
  if (!file || !file.type || !file.type.startsWith('image/')) {
    return { file, width: null, height: null, compressed: false }
  }

  try {
    const img = await loadImageFromFile(file)
    const srcW = img.naturalWidth || img.width
    const srcH = img.naturalHeight || img.height
    if (!srcW || !srcH) {
      return { file, width: null, height: null, compressed: false }
    }

    const longEdge = Math.max(srcW, srcH)
    const scale = longEdge > MAX_EDGE ? MAX_EDGE / longEdge : 1
    const width = Math.max(1, Math.round(srcW * scale))
    const height = Math.max(1, Math.round(srcH * scale))

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return { file, width: srcW, height: srcH, compressed: false }
    }
    ctx.drawImage(img, 0, 0, width, height)

    const blob = await canvasToWebpBlob(canvas, WEBP_QUALITY)
    if (!blob) {
      return { file, width: srcW, height: srcH, compressed: false }
    }

    const baseName = (file.name || 'portfolio').replace(/\.[^.]+$/, '')
    const compressedFile = new File([blob], `${baseName}.webp`, {
      type: 'image/webp',
      lastModified: Date.now(),
    })

    return { file: compressedFile, width, height, compressed: true }
  } catch {
    return { file, width: null, height: null, compressed: false }
  }
}

/** Default stored alt text: title/description, else city-specific, else generic */
export function defaultPortfolioAltText({ title, city } = {}) {
  const t = typeof title === 'string' ? title.trim() : ''
  if (t) return t
  const c = typeof city === 'string' ? city.trim() : ''
  if (c) return `Stump grinding job in ${c}, FL`
  return 'Stump grinding work in the Tampa Bay area'
}

/**
 * Cloudinary video frame as JPG poster (so_0 = first frame).
 */
export function cloudinaryVideoPosterUrl(url) {
  if (!url || typeof url !== 'string') return null
  if (!url.includes('res.cloudinary.com') || !url.includes('/video/upload/')) {
    return null
  }
  return url
    .replace('/video/upload/', '/video/upload/so_0,f_jpg,q_auto,w_800/')
    .replace(/\.(mp4|mov|webm|m4v)(\?.*)?$/i, '.jpg$2')
}
