import { useState, useEffect } from 'react'

// Mini pixel grid renderer for the floating button
function MiniPixelGrid({ grid }) {
  const cellSize = 4 // smaller cells for the button

  return (
    <div
      className="pixel-art rounded-sm overflow-hidden"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(8, ${cellSize}px)`,
        gridTemplateRows: `repeat(8, ${cellSize}px)`,
      }}
    >
      {grid.map((row, rowIdx) =>
        row.map((cell, colIdx) => (
          <div
            key={`${rowIdx}-${colIdx}`}
            style={{
              width: cellSize,
              height: cellSize,
              backgroundColor: cell === 1 ? '#1f2937' : '#dcf428'
            }}
          />
        ))
      )}
    </div>
  )
}

export function FloatingButton({ onClick, isOpen, message, pixelGrid }) {
  const [showPreview, setShowPreview] = useState(false)
  const [prevMessage, setPrevMessage] = useState(null)

  // Show preview when message changes and widget is closed
  useEffect(() => {
    if (message && message !== prevMessage && !isOpen) {
      setShowPreview(true)
      setPrevMessage(message)

      // Auto-hide after 3 seconds
      const timer = setTimeout(() => {
        setShowPreview(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [message, isOpen, prevMessage])

  // Hide preview when widget opens
  useEffect(() => {
    if (isOpen) {
      setShowPreview(false)
    }
  }, [isOpen])

  const dismissPreview = (e) => {
    e.stopPropagation()
    setShowPreview(false)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Message preview bubble - shows above button when closed */}
      {!isOpen && showPreview && message && (
        <div
          className="
            relative
            max-w-[220px] p-3 pb-2
            lcd-screen
            rounded-xl rounded-br-sm
            cursor-default
            animate-fade-in
          "
        >
          {/* Close button */}
          <button
            onClick={dismissPreview}
            className="
              absolute -top-2 -right-2
              w-6 h-6 rounded-full
              bg-[var(--lcd-darkest)] text-[var(--lcd-bg)]
              flex items-center justify-center
              hover:scale-110 transition-transform
              shadow-md
            "
            aria-label="Dismiss"
          >
            <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M6 6L18 18M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>

          <p className="text-xs text-[var(--lcd-darkest)] font-mono leading-relaxed whitespace-pre-line line-clamp-4">
            {message}
          </p>

          {/* Speech bubble tail pointing down-right */}
          <div
            className="
              absolute -bottom-2 right-4
              w-0 h-0
              border-t-8 border-t-[var(--lcd-bg)]
              border-l-8 border-l-transparent
            "
          />
        </div>
      )}

      {/* Floating action button */}
      <button
        onClick={onClick}
        className={`
          w-16 h-16 rounded-full
          bg-none
          shadow-lg shadow-purple-500/30
          flex items-center justify-center flex-shrink-0
          transition-all duration-300 ease-out
          hover:scale-110 hover:shadow-xl hover:shadow-purple-500/40
          active:scale-95
          ${isOpen ? 'rotate-90' : 'rotate-0'}
        `}
        aria-label={isOpen ? 'Close Tamagotchi' : 'Open Tamagotchi'}
      >
        {isOpen ? (
          // X icon when open
          <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none">
            <path
              d="M8 8L24 24M24 8L8 24"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        ) : pixelGrid ? (
          // Pet sprite when closed and pet exists
          <MiniPixelGrid grid={pixelGrid} />
        ) : (
          // Default egg icon when no pet
          <svg viewBox="0 0 32 32" className="w-8 h-8 pixel-art" fill="none">
            <ellipse cx="16" cy="18" rx="10" ry="12" fill="white" />
            <ellipse cx="16" cy="18" rx="8" ry="10" fill="#dcf428" />
            <circle cx="12" cy="16" r="2" fill="#1f2937" />
            <circle cx="20" cy="16" r="2" fill="#1f2937" />
            <path
              d="M13 20 Q16 23 19 20"
              stroke="#1f2937"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
        )}
      </button>
    </div>
  )
}
