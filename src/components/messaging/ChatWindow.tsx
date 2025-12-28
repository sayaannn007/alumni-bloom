import { useState, useRef, useEffect, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import type { Message } from "@/hooks/useMessages";

interface ChatWindowProps {
  messages: Message[];
  currentProfileId: string | null;
  recipientId: string | null;
  recipientName: string | null;
  recipientAvatar: string | null;
  isOnline: boolean;
  isTyping: boolean;
  onSendMessage: (content: string) => Promise<boolean>;
  onTyping: (recipientId: string, isTyping: boolean) => void;
}

export function ChatWindow({
  messages,
  currentProfileId,
  recipientId,
  recipientName,
  recipientAvatar,
  isOnline,
  isTyping,
  onSendMessage,
  onTyping,
}: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Scroll to bottom on new messages
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle typing indicator
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewMessage(e.target.value);

      if (recipientId && e.target.value.length > 0) {
        // Send typing indicator
        onTyping(recipientId, true);

        // Clear existing timeout
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        // Stop typing after 2 seconds of inactivity
        typingTimeoutRef.current = setTimeout(() => {
          onTyping(recipientId, false);
        }, 2000);
      } else if (recipientId) {
        // Stopped typing (empty message)
        onTyping(recipientId, false);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      }
    },
    [recipientId, onTyping]
  );

  const handleSend = async () => {
    if (!newMessage.trim() || sending) return;

    // Stop typing indicator when sending
    if (recipientId) {
      onTyping(recipientId, false);
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    setSending(true);
    const success = await onSendMessage(newMessage.trim());
    if (success) {
      setNewMessage("");
    }
    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  if (!recipientName) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <MessageSquare className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <p className="text-lg font-medium">Select a conversation</p>
        <p className="text-sm text-muted-foreground mt-1">
          Choose a conversation from the list to start messaging
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarImage src={recipientAvatar || undefined} />
            <AvatarFallback className="bg-primary/20 text-primary">
              {recipientName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          {/* Online indicator */}
          <span
            className={cn(
              "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
              isOnline ? "bg-green-500" : "bg-muted-foreground/50"
            )}
          />
        </div>
        <div>
          <h3 className="font-semibold">{recipientName}</h3>
          <p className="text-xs text-muted-foreground">
            {isTyping ? (
              <span className="text-primary">typing...</span>
            ) : isOnline ? (
              <span className="text-green-500">Online</span>
            ) : (
              "Offline"
            )}
          </p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => {
            const isSent = message.sender_id === currentProfileId;
            
            return (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  isSent ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[70%] rounded-2xl px-4 py-2",
                    isSent
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted rounded-bl-md"
                  )}
                >
                  <p className="break-words">{message.content}</p>
                  <p
                    className={cn(
                      "text-xs mt-1",
                      isSent ? "text-primary-foreground/70" : "text-muted-foreground"
                    )}
                  >
                    {formatDistanceToNow(new Date(message.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            );
          })}
          
          {/* Typing indicator in chat */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1"
            disabled={sending}
          />
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim() || sending}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
