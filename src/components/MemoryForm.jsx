import { useRef, useState } from 'react'

const defaultMemory = {
  title: '',
  caption: '',
  date: new Date().toISOString().slice(0, 10),
  people: '',
  image: '/images/placeholder.svg'
}

function MemoryForm({ initialValue = defaultMemory, onSubmit, onCancel }) {
  const fileInputRef = useRef(null)
  const [formData, setFormData] = useState({
    title: initialValue.title || '',
    caption: initialValue.caption || '',
    date: initialValue.date || new Date().toISOString().slice(0, 10),
    people: initialValue.people && Array.isArray(initialValue.people)
      ? initialValue.people.join(', ')
      : initialValue.people || '',
    image: initialValue.image || '/images/placeholder.svg'
  })
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setFormData((current) => ({ ...current, image: String(reader.result) }))
      setError('')
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!formData.title.trim()) {
      setError('Please add a memory title.')
      return
    }

    if (!formData.date) {
      setError('Please add a date.')
      return
    }

    const nextMemory = {
      id: initialValue.id || `memory-${Date.now()}`,
      title: formData.title.trim(),
      caption: formData.caption.trim(),
      date: formData.date,
      people: formData.people
        .split(',')
        .map((person) => person.trim())
        .filter(Boolean),
      image: formData.image || '/images/placeholder.svg'
    }

    onSubmit(nextMemory)
  }

  return (
    <form onSubmit={handleSubmit} className="memory-form">
      {error && (
        <div className="error-box" role="alert">
          {error}
        </div>
      )}

      <div className="field-grid">
        <label>
          <span>Title</span>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="A joyful afternoon"
            aria-label="Memory title"
          />
        </label>

        <label>
          <span>Date</span>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            aria-label="Memory date"
          />
        </label>
      </div>

      <label>
        <span>Caption</span>
        <textarea
          name="caption"
          value={formData.caption}
          onChange={handleChange}
          placeholder="Write a gentle caption for this memory"
          aria-label="Memory caption"
        />
      </label>

      <label>
        <span>People</span>
        <input
          type="text"
          name="people"
          value={formData.people}
          onChange={handleChange}
          placeholder="Grandma June, Ravi, Asha"
          aria-label="People in the memory"
        />
      </label>

      <label>
        <span>Photo</span>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          aria-label="Upload memory photo"
        />
      </label>

      <div className="image-preview-wrap">
        <img src={formData.image} alt="Preview of selected memory" className="preview-image" />
      </div>

      <div className="form-actions">
        <button type="submit" className="primary">
          Save memory
        </button>
        <button type="button" className="secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}

export default MemoryForm
