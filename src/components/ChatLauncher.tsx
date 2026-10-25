'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { MessageCircle } from 'lucide-react'

const ChatWidget = dynamic(() => import('./ChatWidget'), { ssr: false })

export default function ChatLauncher() {
  const [opened, setOpened] = useState(false)

  if (opened) {
    return <ChatWidget startOpen />
  }

  return (
    <button
      type="button"
      onClick={() => setOpened(true)}
      className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-brass text-ink shadow-lg shadow-black/40 transition-transform hover:scale-110 hover:bg-brass-bright"
      aria-label="Open chat"
    >
      <MessageCircle size={24} />
    </button>
  )
}
