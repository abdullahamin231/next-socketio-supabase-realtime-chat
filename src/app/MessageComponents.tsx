"use client";
import { socket } from "../socket";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SendIcon, EllipsisVertical } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export const MessageBox = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState("");

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
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="border-b border-muted p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-muted-foreground">
              Last seen 2 hours ago
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <EllipsisVertical className="h-5 w-5" />
              <span className="sr-only">Call</span>
            </Button>
          </div>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="grid gap-4 p-4 sm:p-6">
          {messages.map((message, i) => (
            <MessageItem messageText={message} rightSide={false} />
          ))}
        </div>
      </ScrollArea>
      <div className="border-t border-muted p-4 sm:p-6">
        <div className="flex w-full items-center space-x-2">
          <Input
            id="message"
            placeholder="Type your message..."
            className="flex-1"
            autoComplete="off"
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button onClick={demo} size="icon">
            <SendIcon className="h-5 w-5" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export const MessageItem = ({
  messageText,
  rightSide = false,
}: {
  messageText: string;
  rightSide: boolean;
}) => {
  return (
    <>
      <div
        className={`flex w-max max-w-[65%] flex-col gap-2 rounded-full bg-muted px-4 py-2 text-sm ${
          rightSide ? "ml-auto" : ""
        }`}
      >
        {messageText}
      </div>
    </>
  );
};
