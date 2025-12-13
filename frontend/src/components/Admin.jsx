import { useState } from 'react'
import axios from 'axios'
import Header from './Header'

const Admin = () => {
  const [uploadType, setUploadType] = useState('standalone')
  const [file, setFile] = useState(null)
  const [beforeFile, setBeforeFile] = useState(null)
  const [afterFile, setAfterFile] = useState(null)
  const [description, setDescription] = useState('')
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  const handleStandaloneUpload = async (e) => {
    e.preventDefault()
    if (!file) {
      setMessage('Please select a file')
      return
    }

    setUploading(true)
    setMessage('')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('description', description)

    try {
      const response = await axios.post('/api/portfolio/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setMessage('Upload successful!')
      setFile(null)
      setDescription('')
      e.target.reset()
    } catch (error) {
      setMessage('Upload failed: ' + (error.response?.data?.error || error.message))
    } finally {
      setUploading(false)
    }
  }

  const handleBeforeAfterUpload = async (e) => {
    e.preventDefault()
    if (!beforeFile || !afterFile) {
      setMessage('Please select both before and after images')
      return
    }

    setUploading(true)
    setMessage('')

    const formData = new FormData()
    formData.append('beforeImage', beforeFile)
    formData.append('afterImage', afterFile)
    formData.append('description', description)

    try {
      const response = await axios.post('/api/portfolio/upload-before-after', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setMessage('Upload successful!')
      setBeforeFile(null)
      setAfterFile(null)
      setDescription('')
      e.target.reset()
    } catch (error) {
      setMessage('Upload failed: ' + (error.response?.data?.error || error.message))
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <Header />
      <div style={{
        maxWidth: '600px',
        margin: '40px auto',
        padding: '40px',
        background: 'var(--white)',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: '30px', textAlign: 'center' }}>Upload Portfolio Item</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 600 }}>
            Upload Type:
          </label>
          <select
            value={uploadType}
            onChange={(e) => setUploadType(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: '2px solid #ddd',
              fontSize: '16px'
            }}
          >
            <option value="standalone">Standalone Image/Video</option>
            <option value="before-after">Before & After</option>
          </select>
        </div>

        {uploadType === 'standalone' ? (
          <form onSubmit={handleStandaloneUpload}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 600 }}>
                File (Image or Video):
              </label>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setFile(e.target.files[0])}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '2px solid #ddd'
                }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 600 }}>
                Description (optional):
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '2px solid #ddd',
                  fontFamily: 'inherit'
                }}
              />
            </div>
            <button
              type="submit"
              disabled={uploading}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleBeforeAfterUpload}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 600 }}>
                Before Image:
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setBeforeFile(e.target.files[0])}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '2px solid #ddd'
                }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 600 }}>
                After Image:
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setAfterFile(e.target.files[0])}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '2px solid #ddd'
                }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 600 }}>
                Description (optional):
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '2px solid #ddd',
                  fontFamily: 'inherit'
                }}
              />
            </div>
            <button
              type="submit"
              disabled={uploading}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </form>
        )}

        {message && (
          <div style={{
            marginTop: '20px',
            padding: '15px',
            borderRadius: '8px',
            background: message.includes('success') ? '#d4edda' : '#f8d7da',
            color: message.includes('success') ? '#155724' : '#721c24'
          }}>
            {message}
          </div>
        )}
      </div>
    </div>
  )
}

export default Admin

