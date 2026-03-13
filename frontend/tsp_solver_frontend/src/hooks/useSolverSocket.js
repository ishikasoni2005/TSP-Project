import { useEffect, useRef, useState } from "react";

import { createWebSocketUrl } from "../services/api";


export function useSolverSocket(sessionId, { enabled = true, onMessage } = {}) {
  const socketRef = useRef(null);
  const onMessageRef = useRef(onMessage);
  const [connectionState, setConnectionState] = useState("idle");

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!sessionId || !enabled) {
      return undefined;
    }

    const socket = new WebSocket(createWebSocketUrl(sessionId));
    socketRef.current = socket;
    setConnectionState("connecting");

    socket.onopen = () => {
      setConnectionState("open");
    };

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        onMessageRef.current?.(payload);
      } catch (error) {
        console.error("Failed to parse socket message", error);
      }
    };

    socket.onerror = () => {
      setConnectionState("error");
    };

    socket.onclose = () => {
      setConnectionState("closed");
    };

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, [enabled, sessionId]);

  function sendJson(payload) {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(payload));
    }
  }

  return { connectionState, sendJson };
}
