import { useEffect, useState } from '@lynx-js/react'
import { ChatList, InputPanel } from './components/index.js'
import { useChat, useKeyboard } from './hooks/index.js'

import './App.css'

export function App(props: {
  onRender?: () => void
}) {
  const [prompt, setPrompt] = useState('');
  const [data, setData] = useState(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [chatList, setChatList] = useState<string[]>([]);
  const [callingAPI, setCallingAPI] = useState(false);

  const [sessionId, setSessionId] = useState(null);

  const setNativeProps = (itemId: string, props: Record<string, unknown>) => {
    lynx
      .createSelectorQuery()
      .select(`#${itemId}`)
      .setNativeProps(props)
      .exec();
  };

  const keyboardChanged = (keyboardHeightInPx: number) => {
    const isKeyboardVisible = keyboardHeightInPx > 0;
    setKeyboardVisible(isKeyboardVisible);

    if (keyboardHeightInPx === 0) {
      setNativeProps("textareaPanel", {
        transform: `translateY(${0}px)`,
        transition: "transform 0.3s ease",
      });
    } else {
      setNativeProps("textareaPanel", {
        transform: `translateY(${-keyboardHeightInPx}px)`,
        transition: "transform 0.3s ease",
      });
      // Refocus textarea after a short delay to allow transform to complete
      setTimeout(() => {
        setNativeProps("userTextarea", {
          focus: true
        });
      }, 350); // Slightly longer than transition duration
    }
  };

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


  useLynxGlobalEventListener(
    "keyboardstatuschanged",
    (status: unknown, keyboardHeight: unknown) => {
      console.log("Keyboard status:", status);
      console.log("Keyboard height:", keyboardHeight);
      // @ts-ignore
      keyboardChanged(status === "on" ? keyboardHeight : 0);
    },
  );

  useEffect(() => {
    console.info('Hello, ReactLynx')
  }, [])
  
  props.onRender?.()

  const handleSend = () => {
    if (prompt.trim()) {
      sendPrompt(prompt);
      setPrompt('');
    }
  }, [chatList, scrollToBottom]);

  props.onRender?.()

  const onTap = useCallback(() => {
    'background only'
    setAlterLogo(prevAlterLogo => !prevAlterLogo)
  }, [])

  const sendPrompt = (prompt: string) => {
    console.log("Sending prompt:", prompt);
    setChatList(prev => [...prev, prompt]);

    const url = `https://wwkzwpjl19.execute-api.us-east-1.amazonaws.com/v1/infer`;

    setCallingAPI(true);
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': import.meta.env.PUBLIC_X_API_KEY as string
      },
      body: sessionId === null ? JSON.stringify({prompt}) : JSON.stringify({ prompt: prompt, sessionId:  sessionId })
    })
      .then(res => res.json())
      .then(json => {
        setChatList(prev => [...prev, json['response']]);
        if (sessionId == null && json['sessionId']) {
          setSessionId(json['sessionId']);
          console.log("New sessionId:", json['sessionId']);
        }
        console.log("Response data:", json);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
      })
      .finally(() => {
        setCallingAPI(false);
      });
  }

  const handleContentSizeChanged = (e: any) => {
    console.log('Content size changed:', e.detail);
  }

  return (
    <view>
      <view className='App'>
        {/* <view className='Banner'>
          <view className='Logo' bindtap={onTap}>
            {alterLogo
              ? <image src={reactLynxLogo} className='Logo--react' />
              : <image src={lynxLogo} className='Logo--lynx' />}
          </view>
          </view> */}
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

        {callingAPI && (
          <view className="LoadingSpinner" style={{marginBottom:'40vh'}}>
            <image raw-text="Asking model..." />
          </view>
        )}

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
                // You can add additional logic here if needed
                sendPrompt(prompt);
                setPrompt(''); // This will trigger any side effects
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