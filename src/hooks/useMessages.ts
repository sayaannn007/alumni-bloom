import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  read_at: string | null;
  created_at: string;
  sender?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export interface Conversation {
  profile_id: string;
  full_name: string | null;
  avatar_url: string | null;
  last_message: string;
  last_message_at: string;
  unread_count: number;
}

export function useMessages(selectedProfileId?: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentProfileId, setCurrentProfileId] = useState<string | null>(null);

  // Get current user's profile ID
  useEffect(() => {
    async function getProfileId() {
      if (!user) return;
      
      const { data } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();
      
      if (data) {
        setCurrentProfileId(data.id);
      }
    }
    getProfileId();
  }, [user]);

  // Fetch conversations list
  useEffect(() => {
    async function fetchConversations() {
      if (!currentProfileId) return;

      const { data: messagesData, error } = await supabase
        .from("messages")
        .select(`
          id,
          sender_id,
          recipient_id,
          content,
          read_at,
          created_at
        `)
        .or(`sender_id.eq.${currentProfileId},recipient_id.eq.${currentProfileId}`)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching conversations:", error);
        return;
      }

      // Group messages by conversation partner
      const conversationMap = new Map<string, {
        messages: typeof messagesData;
        unreadCount: number;
      }>();

      messagesData?.forEach((msg) => {
        const partnerId = msg.sender_id === currentProfileId ? msg.recipient_id : msg.sender_id;
        
        if (!conversationMap.has(partnerId)) {
          conversationMap.set(partnerId, { messages: [], unreadCount: 0 });
        }
        
        const conv = conversationMap.get(partnerId)!;
        conv.messages.push(msg);
        
        if (msg.recipient_id === currentProfileId && !msg.read_at) {
          conv.unreadCount++;
        }
      });

      // Fetch profile info for each conversation partner
      const partnerIds = Array.from(conversationMap.keys());
      
      if (partnerIds.length === 0) {
        setConversations([]);
        setLoading(false);
        return;
      }

      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .in("id", partnerIds);

      const conversationList: Conversation[] = partnerIds.map((partnerId) => {
        const conv = conversationMap.get(partnerId)!;
        const profile = profiles?.find((p) => p.id === partnerId);
        const lastMsg = conv.messages[0];

        return {
          profile_id: partnerId,
          full_name: profile?.full_name || "Unknown",
          avatar_url: profile?.avatar_url,
          last_message: lastMsg.content,
          last_message_at: lastMsg.created_at,
          unread_count: conv.unreadCount,
        };
      });

      // Sort by last message time
      conversationList.sort((a, b) => 
        new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
      );

      setConversations(conversationList);
      setLoading(false);
    }

    fetchConversations();
  }, [currentProfileId]);

  // Fetch messages for selected conversation
  useEffect(() => {
    async function fetchMessages() {
      if (!currentProfileId || !selectedProfileId) {
        setMessages([]);
        return;
      }

      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${currentProfileId},recipient_id.eq.${selectedProfileId}),and(sender_id.eq.${selectedProfileId},recipient_id.eq.${currentProfileId})`
        )
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        return;
      }

      setMessages(data || []);

      // Mark messages as read
      await supabase
        .from("messages")
        .update({ read_at: new Date().toISOString() })
        .eq("sender_id", selectedProfileId)
        .eq("recipient_id", currentProfileId)
        .is("read_at", null);
    }

    fetchMessages();
  }, [currentProfileId, selectedProfileId]);

  // Subscribe to realtime messages
  useEffect(() => {
    if (!currentProfileId) return;

    const channel = supabase
      .channel("messages-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const newMessage = payload.new as Message;
          
          // Only process if we're part of this conversation
          if (
            newMessage.sender_id === currentProfileId ||
            newMessage.recipient_id === currentProfileId
          ) {
            // If this is for the currently selected conversation, add to messages
            if (
              selectedProfileId &&
              (newMessage.sender_id === selectedProfileId ||
                newMessage.recipient_id === selectedProfileId)
            ) {
              setMessages((prev) => [...prev, newMessage]);
              
              // Mark as read if we're the recipient
              if (newMessage.recipient_id === currentProfileId) {
                supabase
                  .from("messages")
                  .update({ read_at: new Date().toISOString() })
                  .eq("id", newMessage.id);
              }
            }

            // Update conversations list
            setConversations((prev) => {
              const partnerId =
                newMessage.sender_id === currentProfileId
                  ? newMessage.recipient_id
                  : newMessage.sender_id;

              const existingIndex = prev.findIndex(
                (c) => c.profile_id === partnerId
              );

              if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex] = {
                  ...updated[existingIndex],
                  last_message: newMessage.content,
                  last_message_at: newMessage.created_at,
                  unread_count:
                    newMessage.recipient_id === currentProfileId &&
                    partnerId !== selectedProfileId
                      ? updated[existingIndex].unread_count + 1
                      : updated[existingIndex].unread_count,
                };
                // Move to top
                const [item] = updated.splice(existingIndex, 1);
                updated.unshift(item);
                return updated;
              }

              return prev;
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentProfileId, selectedProfileId]);

  const sendMessage = async (recipientId: string, content: string) => {
    if (!currentProfileId) return;

    const { error } = await supabase.from("messages").insert({
      sender_id: currentProfileId,
      recipient_id: recipientId,
      content,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Make sure you're connected with this user.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  return {
    messages,
    conversations,
    loading,
    currentProfileId,
    sendMessage,
  };
}
