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


  useEffect(() => {
    console.info('Hello, ReactLynx')
  }, [])
  props.onRender?.()



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

    setChatList(prev => [...prev, prompt, fakeResponse]);

  }

  return (
    <view>
      <view className='App'>

        <view className='Content'>
          {chatList.length <= 0 && <text className='Subtitle'>What can I help with?</text>}

            {chatList && (
              chatList.map((msg, idx) => (
                idx % 2 === 1 ? (
                  // left side
                  <text key={idx} className="ChatMessage" style={{ padding: '10px', fontSize: '18px', alignSelf: 'flex-start' }}>{msg}</text>
                ) : (
                  // right side
                  <text key={idx} className="ChatMessage" style={{ background: 'rgb(49, 49, 49)', padding: '10px 14px', fontSize: '18px', alignSelf: 'flex-end', borderRadius: "20px" }}>{msg}</text>
                )
              ))
            )}
        </view>
        <view
          id="textareaPanel"
          className='TextareaPanel'
        >
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
      </view>
    </view>
  )
}
