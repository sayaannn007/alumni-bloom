import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/hooks/useMessages";

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (profileId: string) => void;
  isUserOnline: (profileId: string) => boolean;
  isUserTyping: (profileId: string) => boolean;
}

export function ConversationList({ 
  conversations, 
  selectedId, 
  onSelect,
  isUserOnline,
  isUserTyping,
}: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <p className="text-muted-foreground">No conversations yet</p>
        <p className="text-sm text-muted-foreground mt-1">
          Connect with alumni to start messaging
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-1 p-2">
        {conversations.map((conversation) => {
          const isOnline = isUserOnline(conversation.profile_id);
          const isTyping = isUserTyping(conversation.profile_id);
          
          return (
            <button
              key={conversation.profile_id}
              onClick={() => onSelect(conversation.profile_id)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left",
                selectedId === conversation.profile_id
                  ? "bg-primary/10"
                  : "hover:bg-muted"
              )}
            >
              <div className="relative">
                <Avatar className="h-12 w-12 shrink-0">
                  <AvatarImage src={conversation.avatar_url || undefined} />
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {conversation.full_name?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
                {/* Online indicator */}
                <span
                  className={cn(
                    "absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-background",
                    isOnline ? "bg-green-500" : "bg-muted-foreground/50"
                  )}
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium truncate">
                    {conversation.full_name}
                  </span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {formatDistanceToNow(new Date(conversation.last_message_at), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                
                <div className="flex items-center justify-between gap-2 mt-0.5">
                  {isTyping ? (
                    <p className="text-sm text-primary italic flex items-center gap-1">
                      <span className="flex gap-0.5">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </span>
                      typing...
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.last_message}
                    </p>
                  )}
                  {conversation.unread_count > 0 && (
                    <Badge variant="default" className="shrink-0 h-5 min-w-5 flex items-center justify-center">
                      {conversation.unread_count}
                    </Badge>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </ScrollArea>
  );
}
