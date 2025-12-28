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
}

export function ConversationList({ conversations, selectedId, onSelect }: ConversationListProps) {
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
        {conversations.map((conversation) => (
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
            <Avatar className="h-12 w-12 shrink-0">
              <AvatarImage src={conversation.avatar_url || undefined} />
              <AvatarFallback className="bg-primary/20 text-primary">
                {conversation.full_name?.charAt(0) || "?"}
              </AvatarFallback>
            </Avatar>
            
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
                <p className="text-sm text-muted-foreground truncate">
                  {conversation.last_message}
                </p>
                {conversation.unread_count > 0 && (
                  <Badge variant="default" className="shrink-0 h-5 min-w-5 flex items-center justify-center">
                    {conversation.unread_count}
                  </Badge>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}
