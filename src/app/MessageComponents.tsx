"use client";

import { socket } from "../socket";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SendIcon, EllipsisVertical, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Contact } from "./ContactComponents";
import { User } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchMessagesUseCase, sendMessageUseCase } from "./actions";

interface Message {
  content: string;
  conversation_id: string;
  created_at: string;
  id: string;
  sender_id: string;
}
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
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessageText] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 640);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setMessages([]);
    const getMessages = async () => {
      setLoading(true);
      const response = await fetchMessagesUseCase(conversationId);
      setMessages(response as Message[]);
      setLoading(false);
    };
    getMessages();
  }, [conversationId]);

  useEffect(() => {
    const joinRoom = (roomId: string) => {
      socket.emit("join_room", roomId);
    };

    joinRoom(conversationId as string);
  }, [conversationId]);

  useEffect(() => {
    const handleResponse = ({
      message,
      senderId,
    }: {
      message: string;
      senderId: string;
    }) => {
      // @ts-ignore
      setMessages((prevMessages: Message[]) => [
        ...prevMessages,
        {
          content: message,
          sender_id: senderId,
          conversation_id: conversationId,
          created_at: new Date().toISOString(),
          id: `${new Date().getTime()}`,
        }, // make sure to provide all necessary fields
      ]);
    };

    socket.on("response", handleResponse);

    return () => {
      socket.off("response", handleResponse);
    };
  }, [userData.id]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    socket.emit("message", { conversationId, message, senderId: userData.id });
    sendMessageUseCase(conversationId, message, userData.id);
    setMessageText("");
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
          {messages &&
            messages.length > 0 &&
            messages.map((message, i) => (
              <MessageItem
                key={i}
                messageText={message.content}
                rightSide={message.sender_id === userData.id}
              />
            ))}
        </div>
      </ScrollArea>
      <div className="border-t border-muted p-4 sm:p-6">
        <div className="flex w-full items-center space-x-2">
          <form
            className="w-full flex items-center space-x-2"
            onSubmit={sendMessage}
          >
            <Input
              id="message"
              placeholder="Type your message..."
              className="flex-1"
              autoComplete="off"
              value={message}
              onChange={(e) => setMessageText(e.target.value)}
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
          <Skeleton className="ml-auto h-8 w-[65%]" />
          <Skeleton className="h-8 w-[65%]" />
          <Skeleton className="ml-auto h-8 w-[65%]" />
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
