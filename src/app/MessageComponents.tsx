"use client";

import { socket } from "../socket";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SendIcon, EllipsisVertical, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Contact } from "./ContactComponents";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

export const MessageBox = ({
  contact,
  userData,
  closeMessageBox,
  conversationId,
}: {
  contact: Contact;
  userData: User;
  closeMessageBox: () => void;
  conversationId: string;
}) => {
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<MessageItemProps[]>([]);
  const [message, setMessage] = useState("");

  const joinRoom = (roomId: string) => {
    socket.emit("join_room", roomId);
  };

  useEffect(() => {
    joinRoom(conversationId as string);
  }, []);

  useEffect(() => {
    const handleResponse = ({
      message,
      id,
    }: {
      message: string;
      id: string;
    }) => {
      setMessages((prevMessages: MessageItemProps[]) => [
        ...prevMessages,
        { messageText: message, rightSide: id === userData.id },
      ]);
    };

    socket.on("response", handleResponse);

    return () => {
      socket.off("response", handleResponse);
    };
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    socket.emit("message", { conversationId, message, senderId: userData.id });
    setMessage("");
  };

  if (loading) {
    return <SkeletonBox />;
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="border-b border-muted p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border">
            <AvatarFallback>{contact.fallback}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{contact.name}</p>
            <p className="text-xs text-muted-foreground">
              Last seen {contact.lastSeen} ago
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" size="icon">
                  <EllipsisVertical className="h-5 w-5" />
                  <span className="sr-only">Call</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={closeMessageBox}>
                  Close Chat
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="grid gap-4 p-4 sm:p-6">
          {messages.map((message, i) => (
            <MessageItem
              key={i}
              messageText={message.messageText}
              rightSide={message.rightSide}
            />
          ))}
        </div>
      </ScrollArea>
      <div className="border-t border-muted p-4 sm:p-6">
        <div className="flex w-full items-center space-x-2">
          <form onSubmit={sendMessage}>
            <Input
              id="message"
              placeholder="Type your message..."
              className="flex-1"
              autoComplete="off"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button type="submit" size="icon">
              <SendIcon className="h-5 w-5" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

interface MessageItemProps {
  messageText: string;
  rightSide: boolean;
}
export const MessageItem = ({
  messageText,
  rightSide = false,
}: MessageItemProps) => {
  return (
    <>
      <div
        className={`flex w-max max-w-[65%] flex-col gap-2 rounded-full ${
          rightSide ? "bg-primary text-muted" : "bg-muted text-primary"
        } px-4 py-2 text-sm ${rightSide ? "ml-auto" : ""}`}
      >
        {messageText}
      </div>
    </>
  );
};

const SkeletonBox = () => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="border-b border-muted p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 border rounded-full" />
          <div className="flex flex-col items-start space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-2 w-[90px]" />
            <Skeleton className="h-2 w-[75px]" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" size="icon">
                  <EllipsisVertical className="h-5 w-5" />
                  <span className="sr-only">Call</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Close Chat</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="grid gap-4 p-4 sm:p-6">
          <Skeleton className="h-8 w-[65%]" />
        </div>
      </ScrollArea>
      <div className="border-t border-muted p-4 sm:p-6">
        <div className="flex w-full items-center space-x-2">
          <Input
            id="message"
            placeholder="Type your message..."
            className="flex-1"
            autoComplete="off"
          />
          <Button size="icon">
            <SendIcon className="h-5 w-5" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
