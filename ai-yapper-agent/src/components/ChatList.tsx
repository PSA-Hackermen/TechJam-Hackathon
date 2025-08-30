import React, { useCallback, useEffect } from 'react';
import { ChatMessage } from './ChatMessage.js';

interface ChatListProps {
  chatList: string[];
  onContentSizeChanged: (e: any) => void;
  callingAPI?: boolean;
  sessionId?: string | null;
}

export const ChatList: React.FC<ChatListProps> = ({ 
  chatList, 
  onContentSizeChanged,
  callingAPI = false,
  sessionId = null
}) => {
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

  // Auto-scroll when chatList updates
  useEffect(() => {
    if (chatList.length > 0) {
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [chatList, scrollToBottom]);

  return (
    <>
      <view className='Content'>
        {chatList.length <= 0 && (
          <text className='Subtitle'>What can I help with?</text>
        )}
        <scroll-view
          id="chatScrollView"
          scroll-orientation="vertical"
          scroll-bar-enable={true}
          style={{ width: "100%", height: "100%", paddingLeft: "10px", marginLeft: "5px" }}
          bindcontentsizechanged={onContentSizeChanged}
        >
          {chatList && chatList.map((msg, idx) => (
            <ChatMessage
              key={idx}
              message={msg}
              isUser={idx % 2 === 0}
            />
          ))}
        </scroll-view>
      </view>

      {callingAPI && (
        <view className="LoadingSpinner" style={{marginBottom:'40vh'}}>
          <image raw-text="Asking model..." />
        </view>
      )}

      {sessionId && (
        <text className='SessionId'>Session ID: {sessionId}</text>
      )}
    </>
  );
};
