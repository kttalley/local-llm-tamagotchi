import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const DECAY_RATE = {
  hunger: 0.5,    // per minute
  happiness: 0.3,
  energy: 0.2
}

const EVOLUTION_THRESHOLDS = {
  egg: 0,
  baby: 100,
  child: 300,
  teen: 600,
  adult: 1000
}

function generateId() {
  return Math.random().toString(36).substring(2, 9)
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

// Generate a symmetrical 8x8 pixel grid (like GitHub identicons)
function generatePixelGrid() {
  const grid = []

  for (let row = 0; row < 8; row++) {
    const rowData = []
    // Generate left half (4 pixels), then mirror for right half
    for (let col = 0; col < 4; col++) {
      // Higher probability in center for more cohesive shapes
      const distFromCenter = Math.abs(col - 1.5) + Math.abs(row - 3.5)
      const probability = distFromCenter < 3 ? 0.6 : 0.3
      rowData.push(Math.random() < probability ? 1 : 0)
    }
    // Mirror to create symmetry
    for (let col = 3; col >= 0; col--) {
      rowData.push(rowData[col])
    }
    grid.push(rowData)
  }

  return grid
}

function getNextEvolutionStage(current) {
  const stages = ['egg', 'baby', 'child', 'teen', 'adult']
  const idx = stages.indexOf(current)
  if (idx < stages.length - 1) {
    return stages[idx + 1]
  }
  return null
}

export const usePetStore = create(
  persist(
    (set, get) => ({
      pet: null,
      isWidgetOpen: true,
      currentAction: 'idle',
      chatHistory: [],
      isLoading: false,

      toggleWidget: () => set(state => ({ isWidgetOpen: !state.isWidgetOpen })),

      createPet: (name) => {
        const newPet = {
          id: generateId(),
          name,
          birthDate: Date.now(),
          evolutionStage: 'egg',
          stats: {
            hunger: 80,
            happiness: 80,
            energy: 80
          },
          personality: 'curious and playful',
          careScore: 0,
          lastInteraction: Date.now(),
          isSleeping: false,
          pixelGrid: generatePixelGrid()
        }
        set({ pet: newPet, chatHistory: [] })
      },

      feed: () => {
        const { pet } = get()
        if (!pet || pet.isSleeping) return

        set({ currentAction: 'eating' })

        setTimeout(() => {
          set(state => {
            if (!state.pet) return state
            const newStats = {
              ...state.pet.stats,
              hunger: clamp(state.pet.stats.hunger + 25, 0, 100),
              happiness: clamp(state.pet.stats.happiness + 5, 0, 100)
            }
            return {
              pet: {
                ...state.pet,
                stats: newStats,
                careScore: state.pet.careScore + 10,
                lastInteraction: Date.now()
              },
              currentAction: 'idle'
            }
          })
        }, 1500)
      },

      play: () => {
        const { pet } = get()
        if (!pet || pet.isSleeping) return

        set({ currentAction: 'playing' })

        setTimeout(() => {
          set(state => {
            if (!state.pet) return state
            const newStats = {
              ...state.pet.stats,
              happiness: clamp(state.pet.stats.happiness + 20, 0, 100),
              energy: clamp(state.pet.stats.energy - 15, 0, 100)
            }
            return {
              pet: {
                ...state.pet,
                stats: newStats,
                careScore: state.pet.careScore + 15,
                lastInteraction: Date.now()
              },
              currentAction: 'idle'
            }
          })
        }, 2000)
      },

      sleep: () => {
        const { pet } = get()
        if (!pet) return

        set(state => ({
          pet: state.pet ? { ...state.pet, isSleeping: true } : null,
          currentAction: 'sleeping'
        }))
      },

      wake: () => {
        set(state => {
          if (!state.pet) return state
          return {
            pet: {
              ...state.pet,
              isSleeping: false,
              stats: {
                ...state.pet.stats,
                energy: clamp(state.pet.stats.energy + 30, 0, 100)
              }
            },
            currentAction: 'idle'
          }
        })
      },

      addChatMessage: (message) => {
        set(state => ({
          chatHistory: [...state.chatHistory.slice(-20), message]
        }))
      },

      setLoading: (loading) => set({ isLoading: loading }),

      setCurrentAction: (action) => set({ currentAction: action }),

      tickStats: () => {
        set(state => {
          if (!state.pet) return state

          const now = Date.now()
          const minutesPassed = (now - state.pet.lastInteraction) / 60000

          if (minutesPassed < 1) return state

          const decayMultiplier = state.pet.isSleeping ? 0.5 : 1

          const newStats = {
            hunger: clamp(
              state.pet.stats.hunger - (DECAY_RATE.hunger * minutesPassed * decayMultiplier),
              0, 100
            ),
            happiness: clamp(
              state.pet.stats.happiness - (DECAY_RATE.happiness * minutesPassed * decayMultiplier),
              0, 100
            ),
            energy: state.pet.isSleeping
              ? clamp(state.pet.stats.energy + (0.5 * minutesPassed), 0, 100)
              : clamp(state.pet.stats.energy - (DECAY_RATE.energy * minutesPassed), 0, 100)
          }

          return {
            pet: {
              ...state.pet,
              stats: newStats,
              lastInteraction: now
            }
          }
        })
      },

      getMood: () => {
        const { pet } = get()
        if (!pet) return 'neutral'

        const avgStats = (pet.stats.hunger + pet.stats.happiness + pet.stats.energy) / 3

        if (avgStats < 20) return 'sick'
        if (avgStats < 40) return 'sad'
        if (avgStats < 60) return 'neutral'
        if (avgStats < 80) return 'happy'
        return 'ecstatic'
      },

      shouldEvolve: () => {
        const { pet } = get()
        if (!pet) return false

        const nextStage = getNextEvolutionStage(pet.evolutionStage)
        if (!nextStage) return false

        return pet.careScore >= EVOLUTION_THRESHOLDS[nextStage]
      },

      evolve: () => {
        set(state => {
          if (!state.pet) return state

          const nextStage = getNextEvolutionStage(state.pet.evolutionStage)
          if (!nextStage) return state

          return {
            pet: {
              ...state.pet,
              evolutionStage: nextStage
            }
          }
        })
      }
    }),
    {
      name: 'tamagotchi-storage',
      version: 1,
      partialize: (state) => ({
        pet: state.pet,
        chatHistory: state.chatHistory
      }),
      migrate: (persistedState, version) => {
        const state = persistedState
        // Migration: add pixelGrid to existing pets
        if (state.pet && !state.pet.pixelGrid) {
          state.pet.pixelGrid = generatePixelGrid()
        }
        return state
      }
    }
  )
)
