import { useEffect, useState } from 'react'
import { usePetStore } from '../../store/petStore'
import { PetDisplay } from '../PetDisplay'
import { StatsBar } from '../StatsBar'
import { ActionButtons } from '../ActionButtons'
import { ChatBubble } from '../ChatBubble'

interface TamagotchiWidgetProps {
  isOpen: boolean
  onClose: () => void
}

export function TamagotchiWidget({ isOpen }: TamagotchiWidgetProps) {
  const { pet, createPet, tickStats, chatHistory } = usePetStore()
  const [petName, setPetName] = useState('')
  const [showChat, setShowChat] = useState(false)

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

  const handleCreatePet = (e: React.FormEvent) => {
    e.preventDefault()
    if (petName.trim()) {
      createPet(petName.trim())
      setPetName('')
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
          {pet && (
            <span className="text-xs text-zinc-600 uppercase">
              {pet.evolutionStage}
            </span>
          )}
        </div>
      </div>

      {/* LCD Screen */}
      <div className="m-3 p-4 lcd-screen relative overflow-hidden min-h-[200px]">
        <div className="scanlines">
          {!pet ? (
            // Create Pet Form
            <form onSubmit={handleCreatePet} className="flex flex-col gap-4">
              <p className="text-sm text-[var(--lcd-darkest)] font-mono text-center">
                Name your new pet!
              </p>
              <input
                type="text"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
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
                disabled={!petName.trim()}
                className="retro-btn mx-auto disabled:opacity-50"
              >
                Hatch!
              </button>
            </form>
          ) : (
            // Pet Display
            <div className="flex flex-col justify-between gap-2 flex-grow">
              {/* Chat bubble */}
              {showChat && lastMessage?.role === 'pet' && (
                <ChatBubble message={lastMessage.content} />
              )}
              <div className='flex flex-col justify-end '>
              {/* Pet sprite */}
              <PetDisplay
                pixelGrid={pet.pixelGrid}
                isSleeping={pet.isSleeping}
              />

              {/* Stats */}
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
            onShowChat={() => setShowChat(true)}
          />
        </div>
      )}
    </div>
  )
}
