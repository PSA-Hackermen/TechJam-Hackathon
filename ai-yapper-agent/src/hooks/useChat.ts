import { useState, useCallback } from 'react';

export const useChat = () => {
  const [chatList, setChatList] = useState<string[]>([]);

  const sendPrompt = useCallback((prompt: string) => {
    console.log("Sending prompt:", prompt);

    // TODO: Replace with actual API call
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
  }, []);

  const clearChat = useCallback(() => {
    setChatList([]);
  }, []);

  return {
    chatList,
    sendPrompt,
    clearChat
  };
};
