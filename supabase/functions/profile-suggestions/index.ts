import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProfileData {
  full_name: string | null;
  bio: string | null;
  batch_year: number | null;
  location: string | null;
  job_title: string | null;
  company: string | null;
  industry: string | null;
  linkedin_url: string | null;
  phone: string | null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { profile } = await req.json() as { profile: ProfileData };
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Analyzing profile for suggestions:", profile.full_name);

    const systemPrompt = `You are a professional profile enhancement advisor for an alumni network. 
Analyze the provided profile and give actionable, specific suggestions to improve it.
Focus on:
1. Profile completeness - identify missing fields that would help with networking
2. Bio quality - suggest improvements if bio is generic, too short, or missing
3. Professional presentation - how to better showcase experience
4. Networking potential - suggestions to increase visibility and connections

Be encouraging but specific. Provide 3-5 concrete suggestions.
Format each suggestion with a category emoji and clear actionable advice.`;

    const profileSummary = `
Profile to analyze:
- Name: ${profile.full_name || "Not provided"}
- Bio: ${profile.bio || "Not provided"}
- Batch Year: ${profile.batch_year || "Not provided"}
- Location: ${profile.location || "Not provided"}
- Job Title: ${profile.job_title || "Not provided"}
- Company: ${profile.company || "Not provided"}
- Industry: ${profile.industry || "Not provided"}
- LinkedIn: ${profile.linkedin_url ? "Provided" : "Not provided"}
- Phone: ${profile.phone ? "Provided" : "Not provided"}
`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: profileSummary }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error("Rate limit exceeded");
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        console.error("Payment required");
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const suggestions = data.choices?.[0]?.message?.content || "Unable to generate suggestions at this time.";

    console.log("Generated suggestions successfully");

    return new Response(JSON.stringify({ suggestions }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in profile-suggestions function:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
