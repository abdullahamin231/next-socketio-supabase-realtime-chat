"use client";

import { useEffect, useState } from "react";
import { socket } from "../socket"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TestPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  useEffect(() => {
    const handleResponse = (message: string) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.on("response", handleResponse);

    return () => {
      socket.off("response", handleResponse);
    };
  }, []);

  const demo = () => {
    socket.emit("message", message);
  };

  return (
    <div>
      <p>Status: {isConnected ? "connected" : "disconnected"}</p>
      <p>Transport: {transport}</p>
      <Input type="text" placeholder="Enter message" onChange={(e) => setMessage(e.target.value)} />
      <Button onClick={demo}>Connect</Button>
      <ul>
        {messages.map((message, i) => (
          <li key={i}>{message}</li>
        ))}
      </ul>
    </div>
  );
}
