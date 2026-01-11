import { useState } from 'react'
import { usePetStore } from '../../store/petStore'
import { sendChatMessage } from '../../services/ollama'

interface ActionButtonsProps {
  isSleeping: boolean
  onShowChat: () => void
}

export function ActionButtons({ isSleeping, onShowChat }: ActionButtonsProps) {
  const { feed, play, sleep, wake, isLoading, setLoading, addChatMessage, pet, getMood, setCurrentAction } = usePetStore()
  const [chatInput, setChatInput] = useState('')
  const [showChatInput, setShowChatInput] = useState(false)

  const handleChat = async () => {
    if (!chatInput.trim() || !pet || isLoading) return

    const userMessage = chatInput.trim()
    setChatInput('')

    // Add user message
    addChatMessage({
      role: 'user',
      content: userMessage,
      timestamp: Date.now()
    })

    setLoading(true)
    setCurrentAction('talking')

    try {
      const response = await sendChatMessage(userMessage, pet, getMood())

      addChatMessage({
        role: 'pet',
        content: response,
        timestamp: Date.now()
      })

      onShowChat()
    } catch (error) {
      console.error('Chat error:', error)
      addChatMessage({
        role: 'pet',
        content: '*confused chirping*',
        timestamp: Date.now()
      })
    } finally {
      setLoading(false)
      setCurrentAction('idle')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleChat()
    }
  }

  return (
    <div className="space-y-2">
      {/* Main action buttons */}
      <div className="flex justify-center gap-2">
        <button
          onClick={isSleeping ? wake : feed}
          disabled={isLoading}
          className="retro-btn flex-1"
          title={isSleeping ? 'Wake up' : 'Feed'}
        >
          {isSleeping ? '☀️ Wake' : '🍖 Feed'}
        </button>

        <button
          onClick={play}
          disabled={isSleeping || isLoading}
          className="retro-btn flex-1"
          title="Play"
        >
          🎮 Play
        </button>

        <button
          onClick={sleep}
          disabled={isSleeping || isLoading}
          className="retro-btn flex-1"
          title="Sleep"
        >
          💤 Sleep
        </button>
      </div>

      {/* Chat toggle/input */}
      <div>
        {!showChatInput ? (
          <button
            onClick={() => setShowChatInput(true)}
            disabled={isSleeping || isLoading}
            className="retro-btn w-full"
          >
            💬 Talk
          </button>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Say something..."
              disabled={isLoading}
              className="
                flex-1 px-2 py-1
                bg-zinc-200 border-2 border-zinc-400
                text-xs font-mono
                focus:outline-none focus:border-zinc-600
              "
              autoFocus
            />
            <button
              onClick={handleChat}
              disabled={!chatInput.trim() || isLoading}
              className="retro-btn"
            >
              {isLoading ? '...' : '→'}
            </button>
            <button
              onClick={() => setShowChatInput(false)}
              className="retro-btn"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
