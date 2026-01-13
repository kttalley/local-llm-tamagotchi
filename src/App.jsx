import { FloatingButton } from './components/FloatingButton'
import { TamagotchiWidget } from './components/TamagotchiWidget'
import { usePetStore } from './store/petStore'

function App() {
  const { isWidgetOpen, toggleWidget, chatHistory, pet } = usePetStore()

  // Get the last pet message for the floating button preview
  const lastPetMessage = chatHistory
    .filter(msg => msg.role === 'pet')
    .slice(-1)[0]?.content

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Homepage content placeholder */}
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-white mb-4">Welcome</h1>
        <p className="text-slate-300">Your LLM-powered Tamagotchi is waiting for you!</p>
      </main>

      {/* Floating Tamagotchi Widget */}
      <TamagotchiWidget isOpen={isWidgetOpen} onClose={toggleWidget} />
      <FloatingButton
        onClick={toggleWidget}
        isOpen={isWidgetOpen}
        message={lastPetMessage}
        pixelGrid={pet?.pixelGrid}
      />
    </div>
  )
}

export default App
