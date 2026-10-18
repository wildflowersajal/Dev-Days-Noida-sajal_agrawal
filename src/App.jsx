import { useEffect, useMemo, useState } from 'react'
import MemoryGarden from './components/MemoryGarden'
import GentleMoments from './components/GentleMoments'
import Timeline from './components/Timeline'
import MemoryForm from './components/MemoryForm'

const STORAGE_KEY = 'memory-genie-memories'

const sampleMemories = [
  {
    id: 'm-1',
    title: 'Grandma June Baking Day',
    caption: 'June taught us her apple pie recipe in a bright kitchen full of laughter.',
    date: '2018-06-12',
    people: ['Grandma June', 'Asha'],
    image: '/images/memory1.svg'
  },
  {
    id: 'm-2',
    title: 'Picnic by the Lake',
    caption: 'A gentle autumn picnic with blankets, lemonade, and warm conversation.',
    date: '2019-10-03',
    people: ['Ravi', 'Asha'],
    image: '/images/memory2.svg'
  },
  {
    id: 'm-3',
    title: 'First Garden Butterflies',
    caption: 'Watching butterflies drift among the marigolds and listening to the breeze.',
    date: '2020-05-21',
    people: ['Asha', 'Maya'],
    image: '/images/memory3.svg'
  },
  {
    id: 'm-4',
    title: 'Painting Afternoon',
    caption: 'A rainy afternoon filled with messy finger paints and cheerful stories.',
    date: '2021-11-09',
    people: ['Maya', 'Grandpa Arun'],
    image: '/images/memory4.svg'
  },
  {
    id: 'm-5',
    title: 'Festival Lanterns',
    caption: 'Lanterns glowed softly as the family gathered at dusk for music and tea.',
    date: '2022-11-01',
    people: ['Family'],
    image: '/images/memory5.svg'
  },
  {
    id: 'm-6',
    title: 'Singing on the Balcony',
    caption: 'A sunny morning of tea, humming, and gentle songs with Grandma June.',
    date: '2024-03-15',
    people: ['Grandma June'],
    image: '/images/memory6.svg'
  }
]

function App() {
  const [memories, setMemories] = useState([])
  const [selectedMemory, setSelectedMemory] = useState(null)
  const [editingMemory, setEditingMemory] = useState(null)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMemories(parsed)
          setIsHydrated(true)
          return
        }
      } catch (error) {
        console.error('Could not parse saved memories:', error)
      }
    }

    setMemories(sampleMemories)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleMemories))
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(memories))
    }
  }, [memories, isHydrated])

  const sortedMemories = useMemo(
    () => [...memories].sort((a, b) => new Date(a.date) - new Date(b.date)),
    [memories]
  )

  const handleAddMemory = (memory) => {
    setMemories((current) => [memory, ...current])
  }

  const handleEditMemory = (memory) => {
    setMemories((current) =>
      current.map((item) => (item.id === memory.id ? memory : item))
    )
    setEditingMemory(null)
  }

  const handleDeleteMemory = (id) => {
    const target = memories.find((memory) => memory.id === id)
    if (!target) return

    const confirmed = window.confirm(
      `Delete “${target.title}”? This will remove it from the Memory Garden.`
    )

    if (!confirmed) return

    setMemories((current) => current.filter((memory) => memory.id !== id))
    if (selectedMemory?.id === id) {
      setSelectedMemory(null)
    }
    if (editingMemory?.id === id) {
      setEditingMemory(null)
    }
  }

  if (!isHydrated) {
    return <div className="loading-shell">Loading Memory Genie…</div>
  }

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="container topbar-inner">
          <div>
            <p className="eyebrow">Family memory companion</p>
            <h1>Memory Genie</h1>
          </div>
          <div className="icon-badge" aria-hidden="true">
            <svg viewBox="0 0 64 64" role="img" aria-label="Memory Genie icon">
              <rect x="8" y="8" width="48" height="48" rx="16" fill="#E6F1E6" />
              <circle cx="32" cy="26" r="8" fill="#7A9D83" />
              <path d="M18 46c2-7 9-10 14-10s12 3 14 10" fill="none" stroke="#7A9D83" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </header>

      <main className="container main-layout">
        <MemoryGarden
          memories={memories}
          onAddMemory={handleAddMemory}
          onViewMemory={setSelectedMemory}
          onEditMemory={setEditingMemory}
          onDeleteMemory={handleDeleteMemory}
        />

        <section className="panel panel-soft" aria-labelledby="gentle-moments-heading">
          <div className="panel-heading-row">
            <h2 id="gentle-moments-heading">Gentle Moments</h2>
          </div>
          <GentleMoments memories={sortedMemories} />
        </section>

        <section className="panel" aria-labelledby="timeline-heading">
          <div className="panel-heading-row">
            <h2 id="timeline-heading">Life Threads</h2>
          </div>
          <Timeline memories={sortedMemories} onViewMemory={setSelectedMemory} />
        </section>
      </main>

      {selectedMemory && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="memory-modal-title">
          <div className="modal-card">
            <button
              type="button"
              className="close-button"
              onClick={() => setSelectedMemory(null)}
              aria-label="Close memory details"
            >
              ×
            </button>

            <div className="modal-image-wrap">
              <img src={selectedMemory.image} alt={selectedMemory.title} />
            </div>

            <div className="modal-content">
              <p className="eyebrow small">Memory</p>
              <h3 id="memory-modal-title">{selectedMemory.title}</h3>
              <p className="meta-text">
                {new Date(selectedMemory.date).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p>{selectedMemory.caption}</p>
              <p className="meta-text">People: {selectedMemory.people.join(', ') || 'Shared memories'}</p>

              <div className="modal-actions">
                <button type="button" className="secondary" onClick={() => setEditingMemory(selectedMemory)}>
                  Edit
                </button>
                <button type="button" className="danger" onClick={() => handleDeleteMemory(selectedMemory.id)}>
                  Delete
                </button>
                <button type="button" className="primary" onClick={() => setSelectedMemory(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editingMemory && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="edit-memory-title">
          <div className="modal-card modal-card-form">
            <button
              type="button"
              className="close-button"
              onClick={() => setEditingMemory(null)}
              aria-label="Close memory form"
            >
              ×
            </button>
            <h3 id="edit-memory-title">Edit memory</h3>
            <MemoryForm
              initialValue={editingMemory}
              onSubmit={handleEditMemory}
              onCancel={() => setEditingMemory(null)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
