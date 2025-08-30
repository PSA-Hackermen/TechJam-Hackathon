import React from 'react';

interface InputPanelProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  onSend: () => void;
}

export const InputPanel: React.FC<InputPanelProps> = ({ 
  prompt, 
  onPromptChange, 
  onSend 
}) => {
  return (
    <view
      id="textareaPanel"
      className='TextareaPanel'
    >
      <view className='InputContainer'>
        <textarea
          placeholder='Ask anything'
          value={prompt}
          bindinput={(e: { detail: { value: string } }) => onPromptChange(e.detail.value)}
        />
        <view
          className='SendButton'
          bindtap={onSend}
        >
          <text>→</text>
        </view>
      </view>
    </view>
  );
};
