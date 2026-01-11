export type EvolutionStage = 'egg' | 'baby' | 'child' | 'teen' | 'adult'

export type Mood = 'ecstatic' | 'happy' | 'neutral' | 'sad' | 'sick'

export type PetAction = 'idle' | 'eating' | 'playing' | 'sleeping' | 'talking'

export interface PetStats {
  hunger: number      // 0-100, 100 = full
  happiness: number   // 0-100, 100 = very happy
  energy: number      // 0-100, 100 = fully rested
}

// 8x8 pixel grid - each cell is 0 (off) or 1 (on)
export type PixelGrid = number[][]

export interface Pet {
  id: string
  name: string
  birthDate: number   // timestamp
  evolutionStage: EvolutionStage
  stats: PetStats
  personality: string
  careScore: number   // accumulated care quality for evolution
  lastInteraction: number
  isSleeping: boolean
  pixelGrid: PixelGrid  // 8x8 unique visual identity
}

export interface ChatMessage {
  role: 'user' | 'pet'
  content: string
  timestamp: number
}

export interface PetState {
  pet: Pet | null
  isWidgetOpen: boolean
  currentAction: PetAction
  chatHistory: ChatMessage[]
  isLoading: boolean
}
