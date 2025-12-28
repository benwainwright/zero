import { useEffect, useState } from 'react';

export const useOpenSocket = (url: string) => {
  const [socket, setSocket] = useState<WebSocket>();
  const [errorEvent, setErrorEvent] = useState<Event>();

  useEffect(() => {
    if (!socket) {
      const theSocket = new WebSocket(url);
      theSocket.addEventListener('open', () => {
        setSocket(theSocket);
      });
      theSocket.addEventListener('error', (event) => {
        setErrorEvent(event);
      });
    }
  }, [socket, url]);

  return { socket, errorEvent };
};
