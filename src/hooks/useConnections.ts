import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";

export interface Connection {
  id: string;
  requester_id: string;
  recipient_id: string;
  status: string | null;
  created_at: string;
  profile?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    job_title: string | null;
    company: string | null;
  };
}

export function useConnections() {
  const { profile } = useProfile();
  const { toast } = useToast();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConnections = useCallback(async () => {
    if (!profile?.id) return;

    setLoading(true);

    // Fetch accepted connections
    const { data: connectionsData, error } = await supabase
      .from("connections")
      .select("*")
      .or(`requester_id.eq.${profile.id},recipient_id.eq.${profile.id}`)
      .eq("status", "accepted");

    if (error) {
      console.error("Error fetching connections:", error);
      setLoading(false);
      return;
    }

    // Get profile IDs to fetch
    const profileIds = connectionsData?.map((c) =>
      c.requester_id === profile.id ? c.recipient_id : c.requester_id
    ) || [];

    if (profileIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, job_title, company")
        .in("id", profileIds);

      const connectionsWithProfiles = connectionsData?.map((c) => ({
        ...c,
        profile: profiles?.find(
          (p) => p.id === (c.requester_id === profile.id ? c.recipient_id : c.requester_id)
        ),
      })) || [];

      setConnections(connectionsWithProfiles);
    } else {
      setConnections([]);
    }

    // Fetch pending requests (where current user is recipient)
    const { data: pendingData } = await supabase
      .from("connections")
      .select("*")
      .eq("recipient_id", profile.id)
      .eq("status", "pending");

    if (pendingData && pendingData.length > 0) {
      const requesterIds = pendingData.map((c) => c.requester_id);
      const { data: requesterProfiles } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, job_title, company")
        .in("id", requesterIds);

      const pendingWithProfiles = pendingData.map((c) => ({
        ...c,
        profile: requesterProfiles?.find((p) => p.id === c.requester_id),
      }));

      setPendingRequests(pendingWithProfiles);
    } else {
      setPendingRequests([]);
    }

    setLoading(false);
  }, [profile?.id]);

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  const sendConnectionRequest = async (recipientId: string) => {
    if (!profile?.id) return { success: false, connectionCount: 0 };

    const { error } = await supabase.from("connections").insert({
      requester_id: profile.id,
      recipient_id: recipientId,
      status: "pending",
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send connection request.",
        variant: "destructive",
      });
      return { success: false, connectionCount: 0 };
    }

    toast({
      title: "Request Sent",
      description: "Connection request has been sent.",
    });

    return { success: true, connectionCount: 0 };
  };

  const acceptConnection = async (connectionId: string) => {
    if (!profile?.id) return { success: false, connectionCount: 0 };

    const { error } = await supabase
      .from("connections")
      .update({ status: "accepted" })
      .eq("id", connectionId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to accept connection.",
        variant: "destructive",
      });
      return { success: false, connectionCount: 0 };
    }

    // Get updated connection count
    const { count } = await supabase
      .from("connections")
      .select("*", { count: "exact", head: true })
      .or(`requester_id.eq.${profile.id},recipient_id.eq.${profile.id}`)
      .eq("status", "accepted");

    toast({
      title: "Connected!",
      description: "You are now connected.",
    });

    await fetchConnections();
    return { success: true, connectionCount: (count || 0) + 1 };
  };

  const rejectConnection = async (connectionId: string) => {
    if (!profile?.id) return false;

    const { error } = await supabase
      .from("connections")
      .update({ status: "rejected" })
      .eq("id", connectionId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to reject connection.",
        variant: "destructive",
      });
      return false;
    }

    await fetchConnections();
    return true;
  };

  return {
    connections,
    pendingRequests,
    loading,
    connectionCount: connections.length,
    sendConnectionRequest,
    acceptConnection,
    rejectConnection,
    refetch: fetchConnections,
  };
}
