interface FloatingButtonProps {
  onClick: () => void
  isOpen: boolean
}

export function FloatingButton({ onClick, isOpen }: FloatingButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        fixed bottom-6 right-6 z-50
        w-16 h-16 rounded-full
        bg-gradient-to-br from-pink-400 to-purple-500
        shadow-lg shadow-purple-500/30
        flex items-center justify-center
        transition-all duration-300 ease-out
        hover:scale-110 hover:shadow-xl hover:shadow-purple-500/40
        active:scale-95
        ${isOpen ? 'rotate-90' : 'rotate-0'}
      `}
      aria-label={isOpen ? 'Close Tamagotchi' : 'Open Tamagotchi'}
    >
      {/* Pixel art egg/pet icon */}
      <svg
        viewBox="0 0 32 32"
        className="w-8 h-8 pixel-art"
        fill="none"
      >
        {isOpen ? (
          // X icon when open
          <path
            d="M8 8L24 24M24 8L8 24"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
          />
        ) : (
          // Egg icon when closed
          <>
            <ellipse cx="16" cy="18" rx="10" ry="12" fill="white" />
            <ellipse cx="16" cy="18" rx="8" ry="10" fill="#f4f428" />
            <circle cx="12" cy="16" r="2" fill="#1f2937" />
            <circle cx="20" cy="16" r="2" fill="#1f2937" />
            <path
              d="M13 20 Q16 23 19 20"
              stroke="#1f2937"
              strokeWidth="1.5"
              fill="none"
            />
          </>
        )}
      </svg>
    </button>
  )
}
