interface ChatBubbleProps {
  message: string
}

export function ChatBubble({ message }: ChatBubbleProps) {
  return (
    <div className="relative max-w-full mb-2 animate-fade-in">
      <div
        className="
          px-3 py-2
          bg-[var(--lcd-light)]
          border-2 border-[var(--lcd-darkest)]
          text-[var(--lcd-darkest)]
          text-xs font-mono
          rounded-lg rounded-bl-none
          max-w-[200px]
        "
      >
        {message}
      </div>
      {/* Speech bubble tail */}
      <div
        className="
          absolute -bottom-1 ml-[50%]
          w-0 h-0
          border-t-8 border-t-[var(--lcd-darkest)]
          border-r-8 border-r-transparent
        "
      />
    </div>
  )
}
