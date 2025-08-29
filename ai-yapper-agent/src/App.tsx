import { useCallback, useEffect, useState, useLynxGlobalEventListener } from '@lynx-js/react'

import './App.css'
import arrow from './assets/arrow.png'
import lynxLogo from './assets/lynx-logo.png'
import reactLynxLogo from './assets/react-logo.png'

export function App(props: {
  onRender?: () => void
}) {
  const [alterLogo, setAlterLogo] = useState(false)
  const [prompt, setPrompt] = useState('');
  const [data, setData] = useState(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

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

    fetch('https://api.genderize.io?name=peter')
      .then(res => res.json())
      .then(json => {
        setData(json);
        console.log(json);
      })
      .catch(err => console.error(err))

  }, [])
  props.onRender?.()

  const onTap = useCallback(() => {
    'background only'
    setAlterLogo(prevAlterLogo => !prevAlterLogo)
  }, [])

  return (
    <view>
      {/* <view className='Background' /> */}
      <view className='App'>
        {/* <view className='Banner'>
          <view className='Logo' bindtap={onTap}>
            {alterLogo
              ? <image src={reactLynxLogo} className='Logo--react' />
              : <image src={lynxLogo} className='Logo--lynx' />}
          </view>
          </view> */}
        <view className='Content'>
          <text className='Subtitle'>What can I help with?</text>
          <image src={arrow} className='Arrow' />
          <text className='Title'>Current prompt is {prompt}</text>
          {/* <input
            type="text"
            placeholder="Username"
            value={username}
            bindinput={(e) => setUsername(e.detail.value)}
          /> */}
          {data && <text className='Description'>{JSON.stringify(data)}</text>}
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
                // You can add additional logic here if needed
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
