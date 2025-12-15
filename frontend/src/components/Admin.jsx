import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Header from './Header'
import { getAuthToken, getAuthHeaders, removeAuthToken, fileToBase64 } from '../utils/auth'

const Admin = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('upload') // 'upload' or 'manage'
  const [uploadType, setUploadType] = useState('standalone')
  const [file, setFile] = useState(null)
  const [galleryFiles, setGalleryFiles] = useState([])
  const [beforeFile, setBeforeFile] = useState(null)
  const [afterFile, setAfterFile] = useState(null)
  const [description, setDescription] = useState('')
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [portfolioItems, setPortfolioItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [user, setUser] = useState(null)

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = getAuthToken()
        if (!token) {
          navigate('/login')
          return
        }
        const response = await axios.get('/api/auth/check', {
          headers: getAuthHeaders()
        })
        if (response.data.authenticated) {
          setUser(response.data.user)
          setCheckingAuth(false)
        } else {
          removeAuthToken()
          navigate('/login')
        }
      } catch (error) {
        removeAuthToken()
        navigate('/login')
      }
    }
    checkAuth()
  }, [navigate])

  // Fetch portfolio items
  useEffect(() => {
    if (activeTab === 'manage') {
      fetchPortfolioItems()
    }
  }, [activeTab])

  const fetchPortfolioItems = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/portfolio')
      setPortfolioItems(response.data)
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/login')
      } else {
        setMessage('Failed to load portfolio items: ' + (error.response?.data?.error || error.message))
      }
    } finally {
      setLoading(false)
    }
  }

  const handleStandaloneUpload = async (e) => {
    e.preventDefault()
    if (!file) {
      setMessage('Please select a file')
      return
    }

    setUploading(true)
    setMessage('')

    try {
      // Convert file to base64
      const base64File = await fileToBase64(file)

      // Upload to Cloudinary via Netlify Function
      const uploadResponse = await axios.post('/api/upload', {
        file: base64File,
        fileName: file.name,
        fileType: file.type,
        uploadType: 'standalone',
        mimeType: file.type
      }, {
        headers: getAuthHeaders()
      })

      if (uploadResponse.data.success) {
        // Add to portfolio
        await axios.post('/api/portfolio', {
          type: 'standalone',
          cloudinaryUrl: uploadResponse.data.cloudinaryUrl,
          cloudinaryPublicId: uploadResponse.data.cloudinaryPublicId,
          mediaType: uploadResponse.data.mediaType,
          description: description
        }, {
          headers: getAuthHeaders()
        })

        setMessage('✅ Upload successful!')
        setFile(null)
        setDescription('')
        e.target.reset()
        if (activeTab === 'manage') {
          fetchPortfolioItems()
        }
      }
    } catch (error) {
      if (error.response?.status === 401) {
        removeAuthToken()
        navigate('/login')
      } else {
        setMessage('❌ Upload failed: ' + (error.response?.data?.error || error.message))
      }
    } finally {
      setUploading(false)
    }
  }

  const handleGalleryUpload = async (e) => {
    e.preventDefault()
    if (!galleryFiles || galleryFiles.length === 0) {
      setMessage('Please select at least one image')
      return
    }

    setUploading(true)
    setMessage('')

    try {
      // Convert all files to base64
      const base64Files = await Promise.all(
        galleryFiles.map(file => fileToBase64(file))
      )

      // Upload to Cloudinary via Netlify Function
      const uploadResponse = await axios.post('/api/upload', {
        galleryFiles: base64Files,
        uploadType: 'gallery'
      }, {
        headers: getAuthHeaders()
      })

      if (uploadResponse.data.success) {
        // Add to portfolio
        await axios.post('/api/portfolio', {
          type: 'gallery',
          images: uploadResponse.data.images.map(img => img.cloudinaryUrl),
          cloudinaryPublicIds: uploadResponse.data.images.map(img => img.cloudinaryPublicId),
          description: description
        }, {
          headers: getAuthHeaders()
        })

        setMessage('✅ Gallery uploaded successfully!')
        setGalleryFiles([])
        setDescription('')
        e.target.reset()
        if (activeTab === 'manage') {
          fetchPortfolioItems()
        }
      }
    } catch (error) {
      if (error.response?.status === 401) {
        removeAuthToken()
        navigate('/login')
      } else {
        setMessage('❌ Upload failed: ' + (error.response?.data?.error || error.message))
      }
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

    try {
      // Convert files to base64
      const beforeBase64 = await fileToBase64(beforeFile)
      const afterBase64 = await fileToBase64(afterFile)

      // Upload to Cloudinary via Netlify Function
      const uploadResponse = await axios.post('/api/upload', {
        beforeImage: beforeBase64,
        afterImage: afterBase64,
        uploadType: 'before-after'
      }, {
        headers: getAuthHeaders()
      })

      if (uploadResponse.data.success) {
        // Add to portfolio
        await axios.post('/api/portfolio', {
          type: 'before-after',
          beforeImageCloudinaryUrl: uploadResponse.data.beforeImage.cloudinaryUrl,
          afterImageCloudinaryUrl: uploadResponse.data.afterImage.cloudinaryUrl,
          beforeImage: uploadResponse.data.beforeImage.cloudinaryPublicId,
          afterImage: uploadResponse.data.afterImage.cloudinaryPublicId,
          description: description
        }, {
          headers: getAuthHeaders()
        })

        setMessage('✅ Upload successful!')
        setBeforeFile(null)
        setAfterFile(null)
        setDescription('')
        e.target.reset()
        if (activeTab === 'manage') {
          fetchPortfolioItems()
        }
      }
    } catch (error) {
      if (error.response?.status === 401) {
        removeAuthToken()
        navigate('/login')
      } else {
        setMessage('❌ Upload failed: ' + (error.response?.data?.error || error.message))
      }
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return
    }

    setDeleting(id)
    try {
      await axios.delete(`/api/portfolio?id=${id}`, {
        headers: getAuthHeaders()
      })
      setMessage('✅ Item deleted successfully!')
      fetchPortfolioItems()
    } catch (error) {
      if (error.response?.status === 401) {
        removeAuthToken()
        navigate('/login')
      } else {
        setMessage('❌ Delete failed: ' + (error.response?.data?.error || error.message))
      }
    } finally {
      setDeleting(null)
    }
  }

  const handleLogout = () => {
    removeAuthToken()
    navigate('/login')
  }

  const clearMessage = () => {
    setMessage('')
  }

  if (checkingAuth) {
    return (
      <div>
        <Header />
        <div style={{
          textAlign: 'center',
          padding: '80px 20px',
          color: 'var(--text-dark)'
        }}>
          <p>Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .admin-header {
            flex-direction: row !important;
            justify-content: space-between !important;
            align-items: flex-start !important;
          }
          .admin-header-left {
            flex: 1;
          }
          .admin-logout-btn {
            margin-top: 0 !important;
            align-self: flex-start !important;
          }
        }
      `}</style>
      <div>
        <Header />
        <div style={{
          maxWidth: '1200px',
          margin: '40px auto',
          padding: '20px'
        }}>
          <div className="admin-header" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px',
            flexWrap: 'wrap',
            gap: '15px'
          }}>
            <div className="admin-header-left">
              <h1 style={{ 
                margin: 0,
                marginBottom: '5px',
                color: 'var(--text-dark)'
              }}>
                Portfolio Admin
              </h1>
              {user && (
                <span style={{
                  color: 'var(--text-light)',
                  fontSize: '14px'
                }}>
                  Logged in as: {user.email}
                </span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="btn admin-logout-btn"
              style={{
                background: 'var(--text-light)',
                color: 'var(--white)',
                padding: '10px 20px',
                fontSize: '14px',
                alignSelf: 'flex-start',
                marginTop: '5px',
                flexShrink: 0
              }}
            >
              Logout
            </button>
          </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '30px',
          borderBottom: '2px solid #e0e0e0'
        }}>
          <button
            onClick={() => {
              setActiveTab('upload')
              clearMessage()
            }}
            style={{
              padding: '12px 24px',
              border: 'none',
              background: 'transparent',
              borderBottom: activeTab === 'upload' ? '3px solid var(--primary-color)' : '3px solid transparent',
              color: activeTab === 'upload' ? 'var(--primary-color)' : 'var(--text-light)',
              fontWeight: activeTab === 'upload' ? 600 : 400,
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'all 0.3s'
            }}
          >
            Upload New Item
          </button>
          <button
            onClick={() => {
              setActiveTab('manage')
              fetchPortfolioItems()
              clearMessage()
            }}
            style={{
              padding: '12px 24px',
              border: 'none',
              background: 'transparent',
              borderBottom: activeTab === 'manage' ? '3px solid var(--primary-color)' : '3px solid transparent',
              color: activeTab === 'manage' ? 'var(--primary-color)' : 'var(--text-light)',
              fontWeight: activeTab === 'manage' ? 600 : 400,
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'all 0.3s'
            }}
          >
            Manage Items ({portfolioItems.length})
          </button>
        </div>

        {/* Message Display */}
        {message && (
          <div style={{
            marginBottom: '20px',
            padding: '15px',
            borderRadius: '8px',
            background: message.includes('✅') ? '#d4edda' : '#f8d7da',
            color: message.includes('✅') ? '#155724' : '#721c24',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>{message}</span>
            <button
              onClick={clearMessage}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: 'inherit',
                padding: '0 10px'
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div style={{
            background: 'var(--white)',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            padding: '40px'
          }}>
            <h2 style={{ marginBottom: '30px', textAlign: 'center' }}>Upload Portfolio Item</h2>
            
            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 600 }}>
                Upload Type:
              </label>
              <select
                value={uploadType}
                onChange={(e) => {
                  setUploadType(e.target.value)
                  clearMessage()
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #ddd',
                  fontSize: '16px',
                  background: 'var(--white)'
                }}
              >
                <option value="standalone">Standalone Image/Video</option>
                <option value="gallery">Gallery (Multiple Images)</option>
                <option value="before-after">Before & After</option>
              </select>
            </div>

            {uploadType === 'standalone' && (
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
                    placeholder="Describe this project..."
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '2px solid #ddd',
                      fontFamily: 'inherit',
                      resize: 'vertical'
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

            {uploadType === 'gallery' && (
              <form onSubmit={handleGalleryUpload}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '10px', fontWeight: 600 }}>
                    Images (Select multiple):
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setGalleryFiles(Array.from(e.target.files))}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '2px solid #ddd'
                    }}
                  />
                  {galleryFiles.length > 0 && (
                    <p style={{ marginTop: '10px', color: 'var(--text-light)', fontSize: '14px' }}>
                      {galleryFiles.length} image{galleryFiles.length > 1 ? 's' : ''} selected
                    </p>
                  )}
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '10px', fontWeight: 600 }}>
                    Description (optional):
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="3"
                    placeholder="Describe this gallery project..."
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '2px solid #ddd',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={uploading}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  {uploading ? 'Uploading...' : `Upload Gallery (${galleryFiles.length} images)`}
                </button>
              </form>
            )}

            {uploadType === 'before-after' && (
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
                    placeholder="Describe this before/after project..."
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '2px solid #ddd',
                      fontFamily: 'inherit',
                      resize: 'vertical'
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
          </div>
        )}

        {/* Manage Tab */}
        {activeTab === 'manage' && (
          <div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p>Loading portfolio items...</p>
              </div>
            ) : portfolioItems.length === 0 ? (
              <div style={{
                background: 'var(--white)',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                padding: '40px',
                textAlign: 'center'
              }}>
                <p style={{ color: 'var(--text-light)', fontSize: '18px' }}>
                  No portfolio items yet. Upload some items to get started!
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '20px'
              }}>
                {portfolioItems.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      background: 'var(--white)',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                      overflow: 'hidden',
                      transition: 'transform 0.3s, box-shadow 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)'
                      e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                  >
                    {item.type === 'gallery' && item.images && item.images.length > 0 && (
                      <div style={{ position: 'relative', width: '100%', paddingTop: '100%', overflow: 'hidden' }}>
                        <img
                          src={`/api/uploads/${item.images[0]}`}
                          alt={item.description || 'Gallery'}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                        {item.images.length > 1 && (
                          <div style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            background: 'rgba(0,0,0,0.7)',
                            color: 'white',
                            padding: '5px 10px',
                            borderRadius: '5px',
                            fontSize: '0.8rem',
                            fontWeight: 600
                          }}>
                            +{item.images.length - 1}
                          </div>
                        )}
                      </div>
                    )}
                    {item.type === 'standalone' && item.filename && (
                      <div style={{ position: 'relative', width: '100%', paddingTop: '100%', overflow: 'hidden', background: '#000' }}>
                        {item.mediaType === 'video' ? (
                          <video
                            src={`/api/uploads/${item.filename}`}
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                            muted
                          />
                        ) : (
                          <img
                            src={`/api/uploads/${item.filename}`}
                            alt={item.description || 'Portfolio item'}
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        )}
                      </div>
                    )}
                    {item.type === 'before-after' && item.beforeImage && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
                        <img
                          src={`/api/uploads/${item.beforeImage}`}
                          alt="Before"
                          style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                        />
                        <img
                          src={`/api/uploads/${item.afterImage}`}
                          alt="After"
                          style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                        />
                      </div>
                    )}
                    <div style={{ padding: '20px' }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'start',
                        marginBottom: '10px'
                      }}>
                        <div>
                          <div style={{
                            fontSize: '0.85rem',
                            color: 'var(--text-light)',
                            textTransform: 'uppercase',
                            fontWeight: 600,
                            marginBottom: '5px'
                          }}>
                            {item.type === 'gallery' ? 'Gallery' : item.type === 'before-after' ? 'Before/After' : item.mediaType || 'Image'}
                          </div>
                          {item.description && (
                            <p style={{
                              color: 'var(--text-dark)',
                              fontSize: '0.95rem',
                              margin: 0
                            }}>
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-light)',
                        marginBottom: '15px'
                      }}>
                        {new Date(item.uploadedAt).toLocaleDateString()}
                      </div>
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deleting === item.id}
                        style={{
                          width: '100%',
                          padding: '10px',
                          background: deleting === item.id ? '#ccc' : '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: deleting === item.id ? 'not-allowed' : 'pointer',
                          fontWeight: 600,
                          transition: 'background 0.3s'
                        }}
                        onMouseEnter={(e) => {
                          if (deleting !== item.id) {
                            e.target.style.background = '#c82333'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (deleting !== item.id) {
                            e.target.style.background = '#dc3545'
                          }
                        }}
                      >
                        {deleting === item.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      </div>
    </>
  )
}

export default Admin
