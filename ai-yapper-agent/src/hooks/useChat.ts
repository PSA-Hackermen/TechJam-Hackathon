import { useState, useCallback } from 'react';

export const useChat = () => {
  const [chatList, setChatList] = useState<string[]>([]);
  const [callingAPI, setCallingAPI] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const sendPrompt = useCallback((prompt: string) => {
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
      body: sessionId === null ? JSON.stringify({prompt}) : JSON.stringify({ prompt: prompt, sessionId: sessionId })
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
  }, [sessionId]);

  const clearChat = useCallback(() => {
    setChatList([]);
  }, []);

  return {
    chatList,
    sendPrompt,
    clearChat,
    callingAPI,
    sessionId
  };
};
