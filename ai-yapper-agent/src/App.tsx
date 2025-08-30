import { useCallback, useEffect, useState, useLynxGlobalEventListener } from '@lynx-js/react'

import './App.css'
import arrow from './assets/arrow.png'
import lynxLogo from './assets/lynx-logo.png'
import reactLynxLogo from './assets/react-logo.png'


export function App(props: {
  onRender?: () => void
}) {
  const [prompt, setPrompt] = useState('');
  const [chatList, setChatList] = useState<string[]>([]);

  // Function to scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (!lynx) return;
    
    lynx.createSelectorQuery()
      .select('#chatScrollView')
      .invoke({
        method: 'scrollTo',
        params: {
          offset: 999999, // Large offset to ensure we go to the bottom
          index: 0,
          smooth: true
        },
      })
      .exec();
  }, []);

  // Handle content size changes to auto-scroll
  const handleContentSizeChanged = useCallback((e: any) => {
    console.log('Content size changed:', e.detail);
    // Auto-scroll to bottom when content changes
    setTimeout(() => {
      scrollToBottom();
    }, 100); // Small delay to ensure content is rendered
  }, [scrollToBottom]);

  useEffect(() => {
    console.info('Hello, ReactLynx')
  }, [])
  props.onRender?.()

  // Auto-scroll when chatList updates
  useEffect(() => {
    if (chatList.length > 0) {
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [chatList, scrollToBottom]);

  const sendPrompt = (prompt: string) => {
    console.log("Sending prompt:", prompt);

    // const url = `https://wwkzwpjl19.execute-api.us-east-1.amazonaws.com/v1/infer`;

    // fetch(url, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'x-api-key': import.meta.env.PUBLIC_X_API_KEY as string
    //   },
    //   body: JSON.stringify({ "prompt": prompt, "sessionId": "session1" })
    // })
    //   .then(res => res.json())
    //   .then(json => {
    //     setData(json['response']);
    //     console.log("Response data:", json);
    //   })
    //   .catch(err => {
    //     setData("Error encountered: " + err.toString());
    //     console.error("Error fetching data:", err);
    //   });

    const fakeResponse = "This is a fake response";

    setChatList(prev => [...prev, prompt, fakeResponse, fakeResponse, fakeResponse, fakeResponse, fakeResponse]);

  }

  return (
    <view>
      <view className='App'>


        <view className='TextareaPanel'>
          <view className='InputContainer'>
            <textarea
              placeholder='Ask anything'
              value={prompt}
              bindinput={(e) => setPrompt(e.detail.value)}
            />
            <view
              className='SendButton'
              bindtap={() => {
                sendPrompt(prompt);
                setPrompt('');
              }}
            >
              <text>→</text>
            </view>
          </view>
        </view>
        <view className='Content' >
          {chatList.length <= 0 && <text className='Subtitle'>What can I help with?</text>}
          <scroll-view
            id="chatScrollView"
            scroll-orientation="vertical"
            scroll-bar-enable={true}
            style={{ width: "100%", height: "100%", paddingLeft: "10px", marginLeft: "5px" }}
            bindcontentsizechanged={handleContentSizeChanged}
          >

            {chatList && (
              chatList.map((msg, idx) => (
                idx % 2 === 1 ? (
                  // left side
                  <text key={idx} className="ChatMessage" style={{ marginBottom: '10px', padding: '10px', fontSize: '18px', alignSelf: 'flex-start' }}>{msg}</text>
                ) : (
                  // right side
                  <text key={idx} className="ChatMessage" style={{ marginBottom: '10px', background: 'rgb(49, 49, 49)', padding: '10px 14px', fontSize: '18px', alignSelf: 'flex-end', borderRadius: "20px" }}>{msg}</text>
                )
              ))
            )}
          </scroll-view>
        </view>
      </view>
    </view>
  )
}
