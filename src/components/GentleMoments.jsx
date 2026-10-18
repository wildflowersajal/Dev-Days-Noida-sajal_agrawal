import { useMemo } from 'react'

function GentleMoments({ memories }) {
  const prompts = useMemo(() => {
    if (!memories || memories.length < 3) {
      return [
        'What stands out most in this memory?',
        'Who do you remember most clearly?',
        'What feelings come back when you look at this moment?'
      ]
    }

    return [
      `Would you like to tell me more about “${memories[0].title}”?`,
      `What do you remember most about ${memories[1].title.toLowerCase()}?`,
      `Who do you see in the story of “${memories[2].title}”?`
    ]
  }, [memories])

  return (
    <div className="gentle-questions">
      <ol>
        {prompts.map((prompt, index) => (
          <li key={prompt + index}>
            <button type="button" className="question-button" aria-label={prompt}>
              {prompt}
            </button>
          </li>
        ))}
      </ol>
      <p className="small-note">
        These gentle conversation prompts are for connection and reflection only and are not a medical assessment.
      </p>
    </div>
  )
}

export default GentleMoments
