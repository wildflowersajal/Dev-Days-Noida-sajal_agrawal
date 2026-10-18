import { useMemo, useState } from 'react'
import MemoryForm from './MemoryForm'

function MemoryGarden({ memories, onAddMemory, onViewMemory, onEditMemory, onDeleteMemory }) {
  const [search, setSearch] = useState('')
  const [yearFilter, setYearFilter] = useState('all')
  const [isFormOpen, setIsFormOpen] = useState(false)

  const years = useMemo(
    () =>
      Array.from(new Set(memories.map((memory) => new Date(memory.date).getFullYear()))).sort(
        (a, b) => b - a
      ),
    [memories]
  )

  const filteredMemories = useMemo(() => {
    return memories.filter((memory) => {
      const matchesSearch =
        !search ||
        memory.title.toLowerCase().includes(search.toLowerCase()) ||
        memory.caption.toLowerCase().includes(search.toLowerCase()) ||
        memory.people.join(' ').toLowerCase().includes(search.toLowerCase())

      const matchesYear = yearFilter === 'all' || new Date(memory.date).getFullYear().toString() === yearFilter

      return matchesSearch && matchesYear
    })
  }, [search, yearFilter, memories])

  return (
    <section className="panel" aria-labelledby="memory-garden-heading">
      <div className="panel-heading-row panel-heading-wrap">
        <h2 id="memory-garden-heading">Memory Garden</h2>

        <div className="toolbar">
          <label className="input-wrap" htmlFor="memory-search">
            <span className="sr-only">Search memories</span>
            <input
              id="memory-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search memories"
              aria-label="Search memories"
            />
          </label>

          <label className="input-wrap select-wrap" htmlFor="year-filter">
            <span className="sr-only">Filter by year</span>
            <select
              id="year-filter"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              aria-label="Filter memories by year"
            >
              <option value="all">All years</option>
              {years.map((year) => (
                <option key={year} value={String(year)}>
                  {year}
                </option>
              ))}
            </select>
          </label>

          <button type="button" className="primary" onClick={() => setIsFormOpen(true)}>
            + Add memory
          </button>
        </div>
      </div>

      {isFormOpen && (
        <div className="form-panel">
          <MemoryForm
            onSubmit={(memory) => {
              onAddMemory(memory)
              setIsFormOpen(false)
            }}
            onCancel={() => setIsFormOpen(false)}
          />
        </div>
      )}

      <div className="card-grid">
        {filteredMemories.length === 0 ? (
          <p className="empty-state">No memories match that search yet.</p>
        ) : (
          filteredMemories.map((memory) => (
            <article key={memory.id} className="memory-card" tabIndex={0}>
              <img src={memory.image} alt={memory.title} className="memory-image" />

              <div className="memory-card-body">
                <div className="memory-heading-row">
                  <h3>{memory.title}</h3>
                </div>
                <p className="meta-text">{new Date(memory.date).toLocaleDateString()}</p>
                <p>{memory.caption}</p>
                <p className="meta-text">People: {memory.people.join(', ') || 'Shared memory'}</p>
              </div>

              <div className="card-actions">
                <button type="button" className="soft-button" onClick={() => onViewMemory(memory)}>
                  View
                </button>
                <button type="button" className="soft-button" onClick={() => onEditMemory(memory)}>
                  Edit
                </button>
                <button type="button" className="danger-button" onClick={() => onDeleteMemory(memory.id)}>
                  Delete
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  )
}

export default MemoryGarden
