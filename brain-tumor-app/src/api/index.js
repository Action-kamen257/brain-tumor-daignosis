import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
})

/**
 * Send MRI image to /predict endpoint
 * @param {File} file - The MRI image file
 * @returns {Promise<{class: string, confidence: number, heatmap: string}>}
 */
export async function predictImage(file) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await api.post('/predict', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return response.data
}

/**
 * Get Grad-CAM heatmap for an MRI image
 * @param {File} file - The MRI image file
 * @returns {Promise<{heatmap_base64: string} | string>}
 */
export async function getGradCam(file) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await api.post('/gradcam', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return response.data
}

/**
 * Fetch a served static output file (e.g. heatmap image)
 * @param {string} path - relative path like outputs/heatmap/foo.jpg
 * @returns {string} Full URL
 */
export function getOutputUrl(path) {
  return `${BASE_URL}/${path}`
}

export default api
