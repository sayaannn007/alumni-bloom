import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useAchievements, Achievement } from "@/hooks/useAchievements";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/GlassCard";
import { LiquidBlob } from "@/components/LiquidBlob";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Calendar, MapPin, Users, Clock, Plus, Video, Loader2 } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { AchievementToast } from "@/components/AchievementToast";

type Event = Tables<"events">;
type EventRegistration = Tables<"event_registrations">;

export default function Events() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { toast } = useToast();
  const { checkAndAwardAchievement } = useAchievements();
  
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [unlockedAchievement, setUnlockedAchievement] = useState<Achievement | null>(null);

  // New event form state
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    event_date: "",
    location: "",
    venue: "",
    is_virtual: false,
    meeting_link: "",
    max_attendees: "",
  });

  useEffect(() => {
    fetchEvents();
  }, [profile]);

  async function fetchEvents() {
    try {
      const { data: eventsData, error: eventsError } = await supabase
        .from("events")
        .select("*")
        .gte("event_date", new Date().toISOString())
        .order("event_date", { ascending: true });

      if (eventsError) throw eventsError;
      setEvents(eventsData || []);

      if (profile) {
        const { data: regsData } = await supabase
          .from("event_registrations")
          .select("*")
          .eq("profile_id", profile.id);
        
        setRegistrations(regsData || []);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  }

  const isRegistered = (eventId: string) => {
    return registrations.some(r => r.event_id === eventId && r.status === "registered");
  };

  const handleRegister = useCallback(async (eventId: string) => {
    if (!profile) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to register for events.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("event_registrations")
        .insert({ event_id: eventId, profile_id: profile.id });

      if (error) throw error;

      // Get total registration count for achievements
      const { count } = await supabase
        .from("event_registrations")
        .select("*", { count: "exact", head: true })
        .eq("profile_id", profile.id);

      // Check for event registration achievements
      const newAchievement = await checkAndAwardAchievement("events_attended", (count || 0) + 1);
      if (newAchievement) {
        setUnlockedAchievement(newAchievement);
      }

      toast({
        title: "Registered!",
        description: "You have successfully registered for this event.",
      });
      fetchEvents();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to register for event.",
        variant: "destructive",
      });
    }
  }, [profile, toast, checkAndAwardAchievement]);

  const handleCancelRegistration = async (eventId: string) => {
    if (!profile) return;

    try {
      const { error } = await supabase
        .from("event_registrations")
        .delete()
        .eq("event_id", eventId)
        .eq("profile_id", profile.id);

      if (error) throw error;

      toast({
        title: "Cancelled",
        description: "Your registration has been cancelled.",
      });
      fetchEvents();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel registration.",
        variant: "destructive",
      });
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setCreating(true);
    try {
      const { error } = await supabase.from("events").insert({
        title: newEvent.title,
        description: newEvent.description,
        event_date: new Date(newEvent.event_date).toISOString(),
        location: newEvent.location || null,
        venue: newEvent.venue || null,
        is_virtual: newEvent.is_virtual,
        meeting_link: newEvent.meeting_link || null,
        max_attendees: newEvent.max_attendees ? parseInt(newEvent.max_attendees) : null,
        organizer_id: profile.id,
      });

      if (error) throw error;

      toast({
        title: "Event created!",
        description: "Your event has been published.",
      });
      setCreateDialogOpen(false);
      setNewEvent({
        title: "",
        description: "",
        event_date: "",
        location: "",
        venue: "",
        is_virtual: false,
        meeting_link: "",
        max_attendees: "",
      });
      fetchEvents();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create event.",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navigation />
      
      <main className="pt-32 pb-20 px-4 relative">
        <LiquidBlob color="purple" size="xl" className="top-20 -right-40 opacity-30" />
        <LiquidBlob color="cyan" size="lg" className="bottom-40 -left-40 opacity-30" delay />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
            <div>
              <h1 className="text-4xl font-display font-bold text-foreground mb-2">
                Upcoming <span className="text-aurora">Events</span>
              </h1>
              <p className="text-muted-foreground">
                Connect with fellow alumni at our community events
              </p>
            </div>

            {user && (
              <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="aurora">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass border-white/10 max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-display">Create New Event</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateEvent} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>Event Title</Label>
                      <Input
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                        required
                        placeholder="Annual Alumni Reunion"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                        placeholder="Tell attendees what to expect..."
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Date & Time</Label>
                      <Input
                        type="datetime-local"
                        value={newEvent.event_date}
                        onChange={(e) => setNewEvent({ ...newEvent, event_date: e.target.value })}
                        required
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="is_virtual"
                        checked={newEvent.is_virtual}
                        onChange={(e) => setNewEvent({ ...newEvent, is_virtual: e.target.checked })}
                        className="rounded"
                      />
                      <Label htmlFor="is_virtual">This is a virtual event</Label>
                    </div>
                    {newEvent.is_virtual ? (
                      <div className="space-y-2">
                        <Label>Meeting Link</Label>
                        <Input
                          value={newEvent.meeting_link}
                          onChange={(e) => setNewEvent({ ...newEvent, meeting_link: e.target.value })}
                          placeholder="https://zoom.us/j/..."
                        />
                      </div>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label>Location</Label>
                          <Input
                            value={newEvent.location}
                            onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                            placeholder="City, Country"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Venue</Label>
                          <Input
                            value={newEvent.venue}
                            onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                            placeholder="Conference Hall A"
                          />
                        </div>
                      </>
                    )}
                    <div className="space-y-2">
                      <Label>Max Attendees (optional)</Label>
                      <Input
                        type="number"
                        value={newEvent.max_attendees}
                        onChange={(e) => setNewEvent({ ...newEvent, max_attendees: e.target.value })}
                        placeholder="Leave empty for unlimited"
                      />
                    </div>
                    <Button type="submit" variant="aurora" className="w-full" disabled={creating}>
                      {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Event"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-aurora" />
            </div>
          ) : events.length === 0 ? (
            <GlassCard className="text-center py-16">
              <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-display font-semibold mb-2">No upcoming events</h2>
              <p className="text-muted-foreground mb-6">Be the first to organize an alumni gathering!</p>
              {user && (
                <Button variant="aurora" onClick={() => setCreateDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Event
                </Button>
              )}
            </GlassCard>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {events.map((event) => (
                <GlassCard key={event.id} glow className="flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-display font-semibold text-foreground mb-1">
                        {event.title}
                      </h3>
                      {event.is_virtual && (
                        <span className="inline-flex items-center gap-1 text-xs bg-aurora-purple/20 text-aurora-purple px-2 py-1 rounded-full">
                          <Video className="w-3 h-3" />
                          Virtual Event
                        </span>
                      )}
                    </div>
                  </div>

                  {event.description && (
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {event.description}
                    </p>
                  )}

                  <div className="space-y-2 text-sm mb-6">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4 text-aurora-cyan" />
                      {format(new Date(event.event_date), "PPP 'at' p")}
                    </div>
                    {!event.is_virtual && event.location && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4 text-aurora-purple" />
                        {event.venue ? `${event.venue}, ${event.location}` : event.location}
                      </div>
                    )}
                    {event.max_attendees && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="w-4 h-4 text-aurora-green" />
                        Max {event.max_attendees} attendees
                      </div>
                    )}
                  </div>

                  <div className="mt-auto">
                    {isRegistered(event.id) ? (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleCancelRegistration(event.id)}
                      >
                        Cancel Registration
                      </Button>
                    ) : (
                      <Button
                        variant="aurora"
                        className="w-full"
                        onClick={() => handleRegister(event.id)}
                      >
                        Register Now
                      </Button>
                    )}
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
      
      <AchievementToast
        achievement={unlockedAchievement}
        onClose={() => setUnlockedAchievement(null)}
      />
    </div>
  );
}
