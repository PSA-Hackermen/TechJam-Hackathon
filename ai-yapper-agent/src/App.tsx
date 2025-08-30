import { useCallback, useEffect, useState, useLynxGlobalEventListener } from '@lynx-js/react'

import './App.css'
import arrow from './assets/arrow.png'
import lynxLogo from './assets/lynx-logo.png'
import reactLynxLogo from './assets/react-logo.png'

// Global error prevention for lynx object
if (typeof window !== 'undefined') {
  // Create a safe proxy for lynx if it doesn't exist or is incomplete
  if (typeof (window as any).lynx === 'undefined') {
    (window as any).lynx = {};
  }

  // Ensure lynx object has safe fallbacks for all methods
  const lynxSafety = (window as any).lynx;
  if (!lynxSafety.switchKeyBoardDetect) {
    lynxSafety.switchKeyBoardDetect = (enabled: boolean) => {
      console.log('switchKeyBoardDetect called with:', enabled, '(fallback implementation)');
    };
  }

  if (!lynxSafety.createSelectorQuery) {
    lynxSafety.createSelectorQuery = () => ({
      select: () => ({
        setNativeProps: () => ({
          exec: () => {
            console.log('createSelectorQuery called (fallback implementation)');
          }
        })
      })
    });
  }
}

export function App(props: {
  onRender?: () => void
}) {
  const [prompt, setPrompt] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [chatList, setChatList] = useState<string[]>([]);

  const setNativeProps = (itemId: string, props: Record<string, unknown>) => {
    // Check if lynx global object is available
    if (typeof lynx !== 'undefined' && lynx?.createSelectorQuery) {
      lynx
        .createSelectorQuery()
        .select(`#${itemId}`)
        .setNativeProps(props)
        .exec();
    } else {
      console.warn('Lynx global object not available, skipping setNativeProps for:', itemId);
    }
  };

  const keyboardChanged = (keyboardHeightInPx: number) => {
    const isKeyboardVisible = keyboardHeightInPx > 0;
    setKeyboardVisible(isKeyboardVisible);

    try {
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
    } catch (error) {
      console.error('Error in keyboardChanged:', error);
    }
  };

  useLynxGlobalEventListener(
    "keyboardstatuschanged",
    (status: unknown, keyboardHeight: unknown) => {
      try {
        console.log("Keyboard status:", status);
        console.log("Keyboard height:", keyboardHeight);
        // @ts-ignore
        keyboardChanged(status === "on" ? keyboardHeight : 0);
      } catch (error) {
        console.error('Error in keyboard event listener:', error);
      }
    },
  );

  useEffect(() => {
    console.info('Hello, ReactLynx')

    // Add global error handler for debugging
    const handleGlobalError = (event: ErrorEvent) => {
      console.error('Global error caught:', event.error);
      if (event.error?.message?.includes('switchKeyBoardDetect')) {
        console.error('switchKeyBoardDetect error details:', {
          lynxAvailable: typeof lynx !== 'undefined',
          lynxValue: typeof lynx !== 'undefined' ? lynx : 'undefined',
          error: event.error
        });
      }
    };

    window.addEventListener('error', handleGlobalError);

    // Check and initialize lynx global object
    if (typeof lynx !== 'undefined' && lynx !== null) {
      console.log('Lynx global object is available');
      // Initialize keyboard detection if available
      const lynxWithKeyboard = lynx as any;
      if (lynxWithKeyboard && typeof lynxWithKeyboard.switchKeyBoardDetect === 'function') {
        try {
          lynxWithKeyboard.switchKeyBoardDetect(true);
          console.log('Keyboard detection enabled');
        } catch (error) {
          console.error('Error enabling keyboard detection:', error);
        }
      } else {
        console.log('switchKeyBoardDetect not available on lynx object');
      }
    } else {
      console.warn('Lynx global object not available');
    }

    // Cleanup function
    return () => {
      window.removeEventListener('error', handleGlobalError);
    };
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
          {/* <text className='Description'>Tap the logo and have fun!</text>
          <text className='Hint'>
            Edit<text
              style={{
                fontStyle: 'italic',
                color: 'rgba(255, 255, 255, 0.85)',
              }}
            >
              {' src/App.tsx '}
            </text>
            to see updates!
          </text> */}
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
