import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Loader2, RefreshCw, X } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;

interface ProfileSuggestionsProps {
  profile: Profile | null;
}

export function ProfileSuggestions({ profile }: ProfileSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const fetchSuggestions = async () => {
    if (!profile) return;
    
    setLoading(true);
    setSuggestions(null);
    
    try {
      const { data, error } = await supabase.functions.invoke("profile-suggestions", {
        body: { profile }
      });

      if (error) throw error;
      
      if (data?.error) {
        throw new Error(data.error);
      }

      setSuggestions(data.suggestions);
      setIsOpen(true);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get suggestions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen && !loading) {
    return (
      <Button
        variant="outline"
        onClick={fetchSuggestions}
        className="gap-2 border-aurora-purple/30 hover:border-aurora-purple hover:bg-aurora-purple/10"
      >
        <Sparkles className="w-4 h-4 text-aurora-purple" />
        AI Profile Tips
      </Button>
    );
  }

  return (
    <div className="relative rounded-xl border border-aurora-purple/30 bg-gradient-to-br from-aurora-purple/5 to-aurora-cyan/5 p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-aurora-purple/20">
            <Sparkles className="w-5 h-5 text-aurora-purple" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">AI Profile Tips</h3>
            <p className="text-xs text-muted-foreground">Personalized suggestions to enhance your profile</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchSuggestions}
            disabled={loading}
            className="h-8 w-8"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setIsOpen(false);
              setSuggestions(null);
            }}
            className="h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-8 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-aurora-purple" />
          <p className="text-sm text-muted-foreground">Analyzing your profile...</p>
        </div>
      ) : suggestions ? (
        <div className="prose prose-sm prose-invert max-w-none">
          <div className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
            {suggestions}
          </div>
        </div>
      ) : null}
    </div>
  );
}
