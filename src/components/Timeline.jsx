function Timeline({ memories, onViewMemory }) {
  return (
    <div className="timeline" aria-live="polite">
      {memories.map((memory) => (
        <div key={memory.id} className="timeline-item">
          <span className="timeline-marker" aria-hidden="true" />
          <div className="timeline-content">
            <p className="timeline-date">
              {new Date(memory.date).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </p>
            <h3>{memory.title}</h3>
            <p className="meta-text">People: {memory.people.join(', ') || 'Shared memory'}</p>
            <button type="button" className="soft-button" onClick={() => onViewMemory(memory)}>
              View memory
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Timeline
