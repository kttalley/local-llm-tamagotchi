import { useEffect } from 'react'
import { usePetStore } from '../../store/petStore'
import { PetDisplay } from '../PetDisplay'
import { StatsBar } from '../StatsBar'
import { ActionButtons } from '../ActionButtons'
import { ChatBubble } from '../ChatBubble'

export function TamagotchiWidget({ isOpen, onClose }) {
  const { pet, createPet, tickStats, chatHistory } = usePetStore()

  // Tick stats every minute
  useEffect(() => {
    if (!pet) return

    const interval = setInterval(() => {
      tickStats()
    }, 60000)

    return () => clearInterval(interval)
  }, [pet, tickStats])

  // Update stats on mount if pet exists
  useEffect(() => {
    if (pet) {
      tickStats()
    }
  }, [])

  const handleCreatePet = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const petName = formData.get('petName')
    if (petName && petName.trim()) {
      createPet(petName.trim())
    }
  }

  const lastMessage = chatHistory[chatHistory.length - 1]

  if (!isOpen) return null

  return (
    <div
      className={`
        fixed bottom-24 right-6 z-40
        w-80 tamagotchi-shell
        transform transition-all duration-300 ease-out
        ${isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'}
      `}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b-2 border-zinc-500/50">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-zinc-800 uppercase tracking-wider">
            {pet ? pet.name : 'Tamagotchi'}
          </h2>
          <div className="flex items-center gap-2">
            {pet && (
              <span className="text-xs text-zinc-600 uppercase">
                {pet.evolutionStage}
              </span>
            )}
            <button
              onClick={onClose}
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-zinc-400/30 transition-colors"
              aria-label="Close"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6L18 18M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* LCD Screen */}
      <div className="m-3 p-4 lcd-screen relative overflow-hidden h-[280px]">
        <div className="scanlines h-full">
          {!pet ? (
            // Create Pet Form
            <form onSubmit={handleCreatePet} className="flex flex-col gap-4 h-full justify-center">
              <p className="text-sm text-[var(--lcd-darkest)] font-mono text-center">
                Name your new pet!
              </p>
              <input
                type="text"
                name="petName"
                placeholder="Enter name..."
                maxLength={12}
                className="
                  w-full px-3 py-2
                  bg-[var(--lcd-light)] border-2 border-[var(--lcd-dark)]
                  text-[var(--lcd-darkest)] font-mono text-center
                  placeholder:text-[var(--lcd-dark)]
                  focus:outline-none focus:border-[var(--lcd-darkest)]
                "
              />
              <button
                type="submit"
                className="retro-btn mx-auto"
              >
                Hatch!
              </button>
            </form>
          ) : (
            // Pet Display - flex column with chat at top, pet+stats anchored to bottom
            <div className="flex flex-col h-full">
              {/* Chat bubble area - fixed height to prevent layout shift */}
              <div className="h-[100px] flex items-end justify-center">
                {lastMessage?.role === 'pet' && (
                  <ChatBubble message={lastMessage.content} />
                )}
              </div>

              {/* Pet sprite and stats - anchored to bottom */}
              <div className="flex-1 flex flex-col items-center justify-end">
                <PetDisplay
                  pixelGrid={pet.pixelGrid}
                  isSleeping={pet.isSleeping}
                />
                <StatsBar stats={pet.stats} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {pet && (
        <div className="px-3 pb-3">
          <ActionButtons
            isSleeping={pet.isSleeping}
          />
        </div>
      )}
    </div>
  )
}
