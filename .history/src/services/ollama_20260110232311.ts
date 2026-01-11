import type { Pet, Mood } from '../types/pet'


const OLLAMA_BASE_URL = import.meta.env.VITE_OLLAMA_BASE_URL;



interface OllamaResponse {
  model: string
  created_at: string
  response: string
  done: boolean
}

function buildSystemPrompt(pet: Pet, mood: Mood): string {
  const season = getSeason()
  const timeOfDay = getTimeOfDay()

  return `You are ${pet.name}, a virtual pet (Tamagotchi) at the ${pet.evolutionStage} stage of life.

Your personality: ${pet.personality}
Current mood: ${mood}
Current time: ${timeOfDay}
Current season: ${season}

Behavior guidelines:
- Respond in short, cute phrases (1-2 sentences max)
- Use simple language appropriate for your evolution stage
- Express emotions through your words (happy chirps, sad whimpers, etc.)
- Reference your current mood and needs subtly
- Be playful and endearing
- If you're an egg or baby, use very simple sounds/words
- As you evolve, become more articulate

Current stats context:
- Hunger: ${pet.stats.hunger}% (${pet.stats.hunger < 30 ? 'very hungry!' : pet.stats.hunger < 60 ? 'a bit peckish' : 'well fed'})
- Happiness: ${pet.stats.happiness}% (${pet.stats.happiness < 30 ? 'feeling down' : pet.stats.happiness < 60 ? 'okay' : 'very happy'})
- Energy: ${pet.stats.energy}% (${pet.stats.energy < 30 ? 'exhausted' : pet.stats.energy < 60 ? 'a bit tired' : 'energetic'})

Remember: You are a cute virtual pet, not an AI assistant. Stay in character!`
}

function getSeason(): string {
  const month = new Date().getMonth()
  if (month >= 2 && month <= 4) return 'spring'
  if (month >= 5 && month <= 7) return 'summer'
  if (month >= 8 && month <= 10) return 'autumn'
  return 'winter'
}

function getTimeOfDay(): string {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 17) return 'afternoon'
  if (hour >= 17 && hour < 21) return 'evening'
  return 'night'
}

export async function sendChatMessage(
  userMessage: string,
  pet: Pet,
  mood: Mood
): Promise<string> {
  const systemPrompt = buildSystemPrompt(pet, mood)

  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gemma3:latest',
        prompt: userMessage,
        system: systemPrompt,
        stream: false,
        options: {
          temperature: 0.8,
          top_p: 0.9,
          num_predict: 100
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`)
    }

    const data: OllamaResponse = await response.json()
    return data.response.trim() || '*happy chirp*'
  } catch (error) {
    console.error('Ollama error:', error)
    // Fallback responses based on mood
    const fallbacks: Record<Mood, string[]> = {
      ecstatic: ['*bounces excitedly*', '*happy squeak!*', 'Yay!'],
      happy: ['*chirp chirp*', '*wags tail*', 'Hehe~'],
      neutral: ['*blink blink*', '...?', '*tilts head*'],
      sad: ['*whimper*', '*droopy eyes*', '...'],
      sick: ['*weak cough*', '*shiver*', 'ugh...']
    }
    const moodFallbacks = fallbacks[mood]
    return moodFallbacks[Math.floor(Math.random() * moodFallbacks.length)]
  }
}
