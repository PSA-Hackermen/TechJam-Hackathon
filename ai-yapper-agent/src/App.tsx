import { useEffect, useState } from '@lynx-js/react'
import { ChatList, InputPanel } from './components/index.js'
import { useChat, useKeyboard } from './hooks/index.js'

import './App.css'

export function App(props: {
  onRender?: () => void
}) {
  const [prompt, setPrompt] = useState<string>("");
  const [key, setKey] = useState(0);
  const { chatList, sendPrompt, callingAPI, sessionId } = useChat();
  const { keyboardVisible, setNativeProps } = useKeyboard();

  useEffect(() => {
    console.info('Hello, ReactLynx')
  }, [])
  
  props.onRender?.()

  const handleSend = () => {
    if (prompt.trim()) {
      sendPrompt(prompt);
      setPrompt('');
    }
  }

  const handleContentSizeChanged = (e: any) => {
    console.log('Content size changed:', e.detail);
  }

  return (
    <view>
      <view className='App'>
        <ChatList
          chatList={chatList}
          onContentSizeChanged={handleContentSizeChanged}
          callingAPI={callingAPI}
          sessionId={sessionId}
        />
        <InputPanel
          key={key}
          prompt={prompt}
          onPromptChange={setPrompt}
          onSend={() => {
            handleSend();
            setKey((k) => k + 1);
          }}
        />
      </view>
    </view>
  )
}