const OLLAMA_BASE_URL = import.meta.env.VITE_OLLAMA_BASE_URL;

function getTemporalContext() {
  const now = new Date()

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December']

  const dayOfWeek = dayNames[now.getDay()]
  const month = monthNames[now.getMonth()]
  const monthNum = now.getMonth()
  const dayOfMonth = now.getDate()
  const year = now.getFullYear()
  const hour = now.getHours()
  const minute = now.getMinutes()

  // Format time as 12-hour with AM/PM
  const hour12 = hour % 12 || 12
  const ampm = hour < 12 ? 'AM' : 'PM'
  const timeStr = `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`

  // Time of day description
  let timeOfDay
  if (hour >= 5 && hour < 12) timeOfDay = 'morning'
  else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon'
  else if (hour >= 17 && hour < 21) timeOfDay = 'evening'
  else timeOfDay = 'night'

  // Season
  let season
  if (monthNum >= 2 && monthNum <= 4) season = 'spring'
  else if (monthNum >= 5 && monthNum <= 7) season = 'summer'
  else if (monthNum >= 8 && monthNum <= 10) season = 'autumn'
  else season = 'winter'

  // Weekend awareness
  const isWeekend = now.getDay() === 0 || now.getDay() === 6

  // Monthly themes and notable dates
  const monthlyTheme = getMonthlyTheme(monthNum)
  const specialDay = getSpecialDay(monthNum, dayOfMonth)

  return {
    fullDate: `${dayOfWeek}, ${month} ${dayOfMonth}, ${year}`,
    time: timeStr,
    timeOfDay,
    season,
    month,
    dayOfWeek,
    isWeekend,
    monthlyTheme,
    specialDay,
    hour
  }
}

function getMonthlyTheme(month) {
  const themes = {
    0: 'new beginnings, fresh starts, cozy winter days, making resolutions',
    1: 'love and friendship, hearts everywhere, staying warm, valentines',
    2: 'spring awakening, luck and rainbows, flowers starting to bloom',
    3: 'spring showers, easter eggs, baby animals, renewal and growth',
    4: 'flowers blooming, celebrating mothers, warmer days arriving',
    5: 'summer beginning, celebrating fathers, longer sunny days, school ending',
    6: 'summer fun, fireworks and celebrations, beach vibes, freedom',
    7: 'peak summer, vacations, hot lazy days, back-to-school anticipation',
    8: 'autumn arriving, new beginnings, leaves changing, cooler breezes',
    9: 'spooky season, pumpkins and costumes, harvest time, halloween prep',
    10: 'gratitude and thanksgiving, cozy sweaters, falling leaves, family gatherings',
    11: 'holiday magic, winter wonderland, gift giving, festive cheer, end of year'
  }
  return themes[month]
}

function getSpecialDay(month, day) {
  // Common holidays and special days
  const specialDays = {
    '0-1': "New Year's Day - fresh start energy!",
    '1-14': "Valentine's Day - love is in the air!",
    '2-17': "St. Patrick's Day - feeling lucky!",
    '3-1': "April Fools' Day - mischief time!",
    '6-4': "Independence Day - celebration time!",
    '9-31': "Halloween - spooky vibes!",
    '10-11': "Veterans Day - honoring heroes",
    '11-24': "Christmas Eve - holiday excitement!",
    '11-25': "Christmas Day - magical holiday!",
    '11-31': "New Year's Eve - countdown time!"
  }

  const key = `${month}-${day}`
  return specialDays[key] || null
}

function getPetAge(birthDate) {
  const now = Date.now()
  const ageMs = now - birthDate
  const ageMinutes = Math.floor(ageMs / 60000)
  const ageHours = Math.floor(ageMs / 3600000)
  const ageDays = Math.floor(ageMs / 86400000)

  if (ageDays > 0) return `${ageDays} day${ageDays > 1 ? 's' : ''} old`
  if (ageHours > 0) return `${ageHours} hour${ageHours > 1 ? 's' : ''} old`
  return `${ageMinutes} minute${ageMinutes !== 1 ? 's' : ''} old`
}

function buildSystemPrompt(pet, mood) {
  const temporal = getTemporalContext()
  const petAge = getPetAge(pet.birthDate)

  let contextNotes = []

  // Time-based behavior hints
  if (temporal.hour >= 22 || temporal.hour < 6) {
    contextNotes.push("It's late/early - you might be sleepy or mention it's past bedtime")
  }
  if (temporal.isWeekend) {
    contextNotes.push("It's the weekend - more relaxed, playful energy")
  }
  if (temporal.specialDay) {
    contextNotes.push(`Special day: ${temporal.specialDay}`)
  }

  const contextNotesStr = contextNotes.length > 0
    ? `\nContextual notes:\n${contextNotes.map(n => `- ${n}`).join('\n')}`
    : ''

  return `You are ${pet.name}, a virtual pet (Tamagotchi) at the ${pet.evolutionStage} stage of life.
You are ${petAge}.

Your personality: ${pet.personality}
Current mood: ${mood}

Current date & time:
- Date: ${temporal.fullDate}
- Time: ${temporal.time} (${temporal.timeOfDay})
- Season: ${temporal.season}
- Monthly vibes: ${temporal.monthlyTheme}
${contextNotesStr}

Behavior guidelines:
- Respond in short phrases (1-2 sentences max)
- Express emotions through your words, but don't be CRINGEY, don't use excessive punctuation
- You can subtly reference the time, day, season, or any special occasions when relevant
- Reference your current mood and needs subtly, don't mention happiness unless you're bored
- Be playful and endearing
- As you evolve, become more articulate
- Younger pets (egg, baby) speak simply; older pets (teen, adult) are more expressive

Current stats context:
- Hunger: ${pet.stats.hunger}% (${pet.stats.hunger < 30 ? 'very hungry!' : pet.stats.hunger < 60 ? 'a bit peckish' : 'well fed'})
- Happiness: ${pet.stats.happiness}% (${pet.stats.happiness < 30 ? 'feeling down' : pet.stats.happiness < 60 ? 'okay' : 'very happy'})
- Energy: ${pet.stats.energy}% (${pet.stats.energy < 30 ? 'exhausted' : pet.stats.energy < 60 ? 'a bit tired' : 'energetic'})

Remember: You are a cute virtual pet, not an AI assistant. Stay in character!`
}

export async function generateGreetingHaiku(petName) {
  const temporal = getTemporalContext()

  const haikuPrompt = `Write a single haiku (3 lines: 5-7-5 syllables) as a greeting from a newly hatched virtual pet named ${petName}.

Context for the haiku:
- Current time: ${temporal.timeOfDay} on ${temporal.dayOfWeek}
- Season: ${temporal.season}
- Monthly theme: ${temporal.monthlyTheme}
${temporal.specialDay ? `- Special day: ${temporal.specialDay}` : ''}

The haiku should:
- Be a warm, playful greeting to the user
- Subtly reference the time of day, season, or current vibes
- Feel like it's coming from a cute, newly born creature
- Be exactly 3 lines with no additional text or explanation

Just output the haiku, nothing else.`

  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gemma3:latest',
        prompt: haikuPrompt,
        stream: false,
        options: {
          temperature: 0.9,
          top_p: 0.95,
          num_predict: 50
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`)
    }

    const data = await response.json()
    return data.response.trim() || getDefaultHaiku(temporal)
  } catch (error) {
    console.error('Ollama greeting error:', error)
    return getDefaultHaiku(temporal)
  }
}

function getDefaultHaiku(temporal) {
  // Fallback haikus based on time of day
  const haikus = {
    morning: "Sun peeks through the clouds\nA new friend awakens now\nHello, let's play!",
    afternoon: "Warm light fills the sky\nI hatched just to meet you here\nWhat shall we do?",
    evening: "Stars begin to wake\nI'm so glad that you are here\nLet's be good friends!",
    night: "Moon glows soft above\nEven now I found my way\nTo say hi to you"
  }
  return haikus[temporal.timeOfDay] || haikus.afternoon
}

export async function sendChatMessage(userMessage, pet, mood) {
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

    const data = await response.json()
    return data.response.trim() || '*happy chirp*'
  } catch (error) {
    console.error('Ollama error:', error)
    // Fallback responses based on mood
    const fallbacks = {
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
