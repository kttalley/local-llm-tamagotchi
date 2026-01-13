export function ChatBubble({ message }) {
  return (
    <div className="relative max-w-full animate-fade-in">
      <div
        className="
          px-3 py-2
          bg-[var(--lcd-light)]
          border-2 border-[var(--lcd-darkest)]
          text-[var(--lcd-darkest)]
          text-xs font-mono leading-tight
          rounded-lg rounded-bl-none
          max-w-[200px]
          overflow-hidden
        "
      >
        <span className="line-clamp-4">{message}</span>
      </div>
      {/* Speech bubble tail */}
      <div
        className="
          absolute -bottom-2 left-1/2 -translate-x-1/2
          w-0 h-0
          border-t-8 border-t-[var(--lcd-dark)]
          border-l-4 border-l-transparent
          border-r-4 border-r-transparent
        "
      />
    </div>
  )
}
