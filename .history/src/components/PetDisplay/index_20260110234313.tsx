import { usePetStore } from '../../store/petStore'
import type { PixelGrid } from '../../types/pet'

interface PetDisplayProps {
  pixelGrid: PixelGrid
  isSleeping: boolean
}

// Renders an 8x8 pixel grid
function PixelGridRenderer({ grid }: { grid: PixelGrid }) {
  const cellSize = 10  // pixels per cell

  return (
    <div
      className="pixel-art"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(8, ${cellSize}px)`,
        gridTemplateRows: `repeat(8, ${cellSize}px)`,
        
        backgroundColor: 'var(--lcd-light)',
        
        borderRadius: '2px',
        outline: 'none'
      }}
    >
      {grid.map((row, rowIdx) =>
        row.map((cell, colIdx) => (
          <div
            key={`${rowIdx}-${colIdx}`}
            style={{
              width: cellSize,
              height: cellSize,
              backgroundColor: cell === 1 ? 'var(--lcd-darkest)' : 'var(--lcd-bg)'
            }}
          />
        ))
      )}
    </div>
  )
}

// Sleeping overlay - Z's
function SleepingOverlay() {
  return (
    <div className="absolute -top-2 right-0 text-[var(--lcd-darkest)] font-bold text-xs">
      <span className="animate-pulse">Z</span>
      <span className="animate-pulse delay-100 text-sm ml-1">z</span>
      <span className="animate-pulse delay-200 text-xs ml-0.5">z</span>
    </div>
  )
}

export function PetDisplay({ pixelGrid, isSleeping }: PetDisplayProps) {
  const { currentAction, getMood } = usePetStore()
  const mood = getMood()

  return (
    <div className="relative flex items-center justify-center py-4">
      <div
        className={`
          relative
          ${!isSleeping && currentAction === 'idle' ? 'pet-idle' : ''}
          ${currentAction === 'eating' ? 'animate-bounce' : ''}
          ${currentAction === 'playing' ? 'animate-spin' : ''}
          ${mood === 'sick' ? 'opacity-60' : ''}
        `}
      >
        <PixelGridRenderer grid={pixelGrid} />

        {isSleeping && <SleepingOverlay />}

        {/* Action indicators */}
        {currentAction === 'eating' && (
          <div className="absolute -right-6 top-1/2 text-lg">
            🍖
          </div>
        )}
      </div>
    </div>
  )
}
