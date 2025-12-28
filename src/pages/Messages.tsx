import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useMessages } from "@/hooks/useMessages";
import { ConversationList } from "@/components/messaging/ConversationList";
import { ChatWindow } from "@/components/messaging/ChatWindow";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Loader2, MessageSquare } from "lucide-react";

export default function Messages() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedProfileId = searchParams.get("chat");
  
  const { messages, conversations, loading, currentProfileId, sendMessage } = useMessages(selectedProfileId || undefined);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const handleSelectConversation = (profileId: string) => {
    setSearchParams({ chat: profileId });
  };

  const selectedConversation = conversations.find(
    (c) => c.profile_id === selectedProfileId
  );

  const handleSendMessage = async (content: string) => {
    if (!selectedProfileId) return false;
    return await sendMessage(selectedProfileId, content);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <MessageSquare className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Messages</h1>
        </div>

        <Card className="h-[calc(100vh-280px)] min-h-[500px] overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 h-full">
            {/* Conversations List */}
            <div className="border-r border-border md:col-span-1 h-full">
              <div className="p-4 border-b border-border">
                <h2 className="font-semibold">Conversations</h2>
              </div>
              <div className="h-[calc(100%-57px)]">
                <ConversationList
                  conversations={conversations}
                  selectedId={selectedProfileId}
                  onSelect={handleSelectConversation}
                />
              </div>
            </div>

            {/* Chat Window */}
            <div className="md:col-span-2 h-full hidden md:block">
              <ChatWindow
                messages={messages}
                currentProfileId={currentProfileId}
                recipientName={selectedConversation?.full_name || null}
                recipientAvatar={selectedConversation?.avatar_url || null}
                onSendMessage={handleSendMessage}
              />
            </div>

            {/* Mobile Chat View */}
            {selectedProfileId && (
              <div className="md:hidden fixed inset-0 bg-background z-50">
                <ChatWindow
                  messages={messages}
                  currentProfileId={currentProfileId}
                  recipientName={selectedConversation?.full_name || null}
                  recipientAvatar={selectedConversation?.avatar_url || null}
                  onSendMessage={handleSendMessage}
                />
              </div>
            )}
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
