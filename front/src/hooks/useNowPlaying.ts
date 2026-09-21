import { useEffect, useRef, useState } from "react";
import type { NowPlaying, ConnectionStatus } from "../types";
import { BACKEND_WEBSOCKET_URL } from "../config";

const WEBSOCKET_URL = "ws://localhost:3000/ws/now-playing";

export function useNowPlaying() {

  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>("connecting");

  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket(BACKEND_WEBSOCKET_URL);
    socketRef.current = socket;

    socket.onopen = () => setStatus("connected");
    socket.onclose = () => setStatus("disconnected");
    socket.onerror = () => setStatus("disconnected");

    socket.onmessage = (event) => {

      const data: NowPlaying = JSON.parse(event.data);
      setNowPlaying(data);
    };

    return () => {
      socket.close();
    };
  }, []);

  return { nowPlaying, status };
}
