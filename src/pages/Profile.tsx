import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/GlassCard";
import { LiquidBlob } from "@/components/LiquidBlob";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { User, Briefcase, MapPin, GraduationCap, Shield, Linkedin, Phone, Mail, Loader2, Save, LogOut } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type PrivacyLevel = Database["public"]["Enums"]["privacy_level"];

const privacyOptions: { value: PrivacyLevel; label: string; description: string }[] = [
  { value: "public", label: "Public", description: "Visible to everyone" },
  { value: "alumni_only", label: "Alumni Only", description: "Only visible to logged-in alumni" },
  { value: "connections_only", label: "Connections", description: "Only visible to your connections" },
  { value: "private", label: "Private", description: "Only visible to you" },
];

export default function Profile() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    bio: "",
    batch_year: "",
    location: "",
    job_title: "",
    company: "",
    industry: "",
    linkedin_url: "",
    phone: "",
    profile_privacy: "alumni_only" as PrivacyLevel,
    email_privacy: "connections_only" as PrivacyLevel,
    phone_privacy: "private" as PrivacyLevel,
    location_privacy: "alumni_only" as PrivacyLevel,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        bio: profile.bio || "",
        batch_year: profile.batch_year?.toString() || "",
        location: profile.location || "",
        job_title: profile.job_title || "",
        company: profile.company || "",
        industry: profile.industry || "",
        linkedin_url: profile.linkedin_url || "",
        phone: profile.phone || "",
        profile_privacy: profile.profile_privacy || "alumni_only",
        email_privacy: profile.email_privacy || "connections_only",
        phone_privacy: profile.phone_privacy || "private",
        location_privacy: profile.location_privacy || "alumni_only",
      });
    }
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await updateProfile({
        full_name: formData.full_name || null,
        bio: formData.bio || null,
        batch_year: formData.batch_year ? parseInt(formData.batch_year) : null,
        location: formData.location || null,
        job_title: formData.job_title || null,
        company: formData.company || null,
        industry: formData.industry || null,
        linkedin_url: formData.linkedin_url || null,
        phone: formData.phone || null,
        profile_privacy: formData.profile_privacy,
        email_privacy: formData.email_privacy,
        phone_privacy: formData.phone_privacy,
        location_privacy: formData.location_privacy,
      });

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your changes have been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-aurora" />
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navigation />
      
      <main className="pt-32 pb-20 px-4 relative">
        <LiquidBlob color="cyan" size="xl" className="top-20 -left-40 opacity-30" />
        <LiquidBlob color="purple" size="lg" className="bottom-40 -right-40 opacity-30" delay />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-display font-bold text-foreground mb-2">
                My <span className="text-aurora">Profile</span>
              </h1>
              <p className="text-muted-foreground">
                Manage your alumni profile and privacy settings
              </p>
            </div>
            <Button variant="ghost" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>

          <GlassCard glow className="p-6">
            {/* Profile Header */}
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/10">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-aurora-cyan to-aurora-purple flex items-center justify-center">
                <span className="text-3xl font-display font-bold text-primary-foreground">
                  {formData.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || "A"}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-display font-semibold text-foreground">
                  {formData.full_name || "Alumni Member"}
                </h2>
                <p className="text-muted-foreground">{user?.email}</p>
                {formData.batch_year && (
                  <p className="text-sm text-aurora">Class of {formData.batch_year}</p>
                )}
              </div>
            </div>

            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="personal">
                  <User className="w-4 h-4 mr-2" />
                  Personal
                </TabsTrigger>
                <TabsTrigger value="professional">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Professional
                </TabsTrigger>
                <TabsTrigger value="privacy">
                  <Shield className="w-4 h-4 mr-2" />
                  Privacy
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        className="pl-10"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="batch_year">Batch Year</Label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="batch_year"
                        type="number"
                        value={formData.batch_year}
                        onChange={(e) => setFormData({ ...formData, batch_year: e.target.value })}
                        className="pl-10"
                        placeholder="2018"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="pl-10"
                        placeholder="New York, USA"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="pl-10"
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                </div>
              </TabsContent>

              <TabsContent value="professional" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="job_title">Job Title</Label>
                    <Input
                      id="job_title"
                      value={formData.job_title}
                      onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                      placeholder="Software Engineer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Acme Corp"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      placeholder="Technology"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin_url">LinkedIn Profile</Label>
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="linkedin_url"
                        value={formData.linkedin_url}
                        onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                        className="pl-10"
                        placeholder="https://linkedin.com/in/johndoe"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="privacy" className="space-y-6">
                <p className="text-muted-foreground text-sm mb-6">
                  Control who can see your information. These settings help protect your privacy.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-aurora-cyan" />
                      <div>
                        <p className="font-medium">Profile Visibility</p>
                        <p className="text-sm text-muted-foreground">Who can view your profile</p>
                      </div>
                    </div>
                    <Select
                      value={formData.profile_privacy}
                      onValueChange={(value: PrivacyLevel) => setFormData({ ...formData, profile_privacy: value })}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {privacyOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-aurora-purple" />
                      <div>
                        <p className="font-medium">Email Address</p>
                        <p className="text-sm text-muted-foreground">Who can see your email</p>
                      </div>
                    </div>
                    <Select
                      value={formData.email_privacy}
                      onValueChange={(value: PrivacyLevel) => setFormData({ ...formData, email_privacy: value })}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {privacyOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-aurora-green" />
                      <div>
                        <p className="font-medium">Phone Number</p>
                        <p className="text-sm text-muted-foreground">Who can see your phone</p>
                      </div>
                    </div>
                    <Select
                      value={formData.phone_privacy}
                      onValueChange={(value: PrivacyLevel) => setFormData({ ...formData, phone_privacy: value })}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {privacyOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-aurora-cyan" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-sm text-muted-foreground">Who can see your location</p>
                      </div>
                    </div>
                    <Select
                      value={formData.location_privacy}
                      onValueChange={(value: PrivacyLevel) => setFormData({ ...formData, location_privacy: value })}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {privacyOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
              <Button variant="aurora" onClick={handleSave} disabled={saving}>
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </GlassCard>
        </div>
      </main>

      <Footer />
    </div>
  );
}
