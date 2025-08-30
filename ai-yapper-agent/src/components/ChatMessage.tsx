import React from 'react';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isUser }) => {
  const messageStyle = isUser 
    ? {
        marginBottom: '10px',
        background: 'rgb(49, 49, 49)',
        padding: '10px 14px',
        fontSize: '18px',
        alignSelf: 'flex-end',
        borderRadius: '20px'
      }
    : {
        marginBottom: '10px',
        padding: '10px',
        fontSize: '18px',
        alignSelf: 'flex-start'
      };

  return (
    <text className="ChatMessage" style={messageStyle}>
      {message}
    </text>
  );
};
