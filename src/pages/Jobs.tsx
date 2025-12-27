import { useState, useEffect } from "react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Briefcase, MapPin, Building, Clock, Plus, ExternalLink, Loader2, Search, DollarSign } from "lucide-react";
import { Tables, Database } from "@/integrations/supabase/types";

type Job = Tables<"jobs">;
type JobType = Database["public"]["Tables"]["jobs"]["Row"]["job_type"];

const jobTypes: { value: string; label: string }[] = [
  { value: "full-time", label: "Full Time" },
  { value: "part-time", label: "Part Time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "remote", label: "Remote" },
];

export default function Jobs() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { toast } = useToast();
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const [newJob, setNewJob] = useState({
    title: "",
    company: "",
    location: "",
    job_type: "full-time" as JobType,
    description: "",
    requirements: "",
    salary_range: "",
    application_url: "",
    contact_email: "",
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.location?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    
    const matchesType = filterType === "all" || job.job_type === filterType;
    
    return matchesSearch && matchesType;
  });

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setCreating(true);
    try {
      const { error } = await supabase.from("jobs").insert({
        title: newJob.title,
        company: newJob.company,
        location: newJob.location || null,
        job_type: newJob.job_type,
        description: newJob.description || null,
        requirements: newJob.requirements || null,
        salary_range: newJob.salary_range || null,
        application_url: newJob.application_url || null,
        contact_email: newJob.contact_email || null,
        posted_by: profile.id,
      });

      if (error) throw error;

      toast({
        title: "Job posted!",
        description: "Your job listing is now live.",
      });
      setCreateDialogOpen(false);
      setNewJob({
        title: "",
        company: "",
        location: "",
        job_type: "full-time",
        description: "",
        requirements: "",
        salary_range: "",
        application_url: "",
        contact_email: "",
      });
      fetchJobs();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post job.",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const getJobTypeBadgeClass = (type: string | null) => {
    switch (type) {
      case "full-time":
        return "bg-aurora-green/20 text-aurora-green";
      case "part-time":
        return "bg-aurora-cyan/20 text-aurora-cyan";
      case "contract":
        return "bg-aurora-purple/20 text-aurora-purple";
      case "internship":
        return "bg-yellow-500/20 text-yellow-400";
      case "remote":
        return "bg-blue-500/20 text-blue-400";
      default:
        return "bg-white/10 text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navigation />
      
      <main className="pt-32 pb-20 px-4 relative">
        <LiquidBlob color="green" size="xl" className="top-20 -right-40 opacity-30" />
        <LiquidBlob color="purple" size="lg" className="bottom-40 -left-40 opacity-30" delay />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-display font-bold text-foreground mb-2">
                Job <span className="text-aurora">Board</span>
              </h1>
              <p className="text-muted-foreground">
                Discover opportunities shared by fellow alumni
              </p>
            </div>

            {user && (
              <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="aurora">
                    <Plus className="w-4 h-4 mr-2" />
                    Post a Job
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass border-white/10 max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-display">Post a Job</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateJob} className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Job Title *</Label>
                        <Input
                          value={newJob.title}
                          onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                          required
                          placeholder="Software Engineer"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Company *</Label>
                        <Input
                          value={newJob.company}
                          onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                          required
                          placeholder="Acme Corp"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input
                          value={newJob.location}
                          onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                          placeholder="New York, NY"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Job Type</Label>
                        <Select
                          value={newJob.job_type || "full-time"}
                          onValueChange={(value) => setNewJob({ ...newJob, job_type: value as JobType })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {jobTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Salary Range</Label>
                      <Input
                        value={newJob.salary_range}
                        onChange={(e) => setNewJob({ ...newJob, salary_range: e.target.value })}
                        placeholder="$80,000 - $120,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Job Description</Label>
                      <Textarea
                        value={newJob.description}
                        onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                        placeholder="Describe the role and responsibilities..."
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Requirements</Label>
                      <Textarea
                        value={newJob.requirements}
                        onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                        placeholder="Required skills and qualifications..."
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Application URL</Label>
                        <Input
                          value={newJob.application_url}
                          onChange={(e) => setNewJob({ ...newJob, application_url: e.target.value })}
                          placeholder="https://..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Contact Email</Label>
                        <Input
                          type="email"
                          value={newJob.contact_email}
                          onChange={(e) => setNewJob({ ...newJob, contact_email: e.target.value })}
                          placeholder="jobs@company.com"
                        />
                      </div>
                    </div>
                    <Button type="submit" variant="aurora" className="w-full" disabled={creating}>
                      {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Post Job"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                placeholder="Search jobs by title, company, or location..."
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {jobTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-aurora" />
            </div>
          ) : filteredJobs.length === 0 ? (
            <GlassCard className="text-center py-16">
              <Briefcase className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-display font-semibold mb-2">No jobs found</h2>
              <p className="text-muted-foreground mb-6">
                {searchQuery || filterType !== "all"
                  ? "Try adjusting your search or filters"
                  : "Be the first to post a job opportunity!"}
              </p>
              {user && (
                <Button variant="aurora" onClick={() => setCreateDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Post a Job
                </Button>
              )}
            </GlassCard>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <GlassCard key={job.id} hover className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-aurora-cyan/20 to-aurora-purple/20 flex items-center justify-center flex-shrink-0">
                          <Building className="w-6 h-6 text-aurora-cyan" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="text-lg font-display font-semibold text-foreground">
                              {job.title}
                            </h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${getJobTypeBadgeClass(job.job_type)}`}>
                              {jobTypes.find((t) => t.value === job.job_type)?.label || job.job_type}
                            </span>
                          </div>
                          <p className="text-aurora font-medium">{job.company}</p>
                          
                          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                            {job.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {job.location}
                              </span>
                            )}
                            {job.salary_range && (
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                {job.salary_range}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Posted {format(new Date(job.created_at), "MMM d, yyyy")}
                            </span>
                          </div>

                          {job.description && (
                            <p className="text-muted-foreground text-sm mt-3 line-clamp-2">
                              {job.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 md:flex-col md:items-end">
                      {job.application_url && (
                        <Button variant="aurora" size="sm" asChild>
                          <a href={job.application_url} target="_blank" rel="noopener noreferrer">
                            Apply
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        </Button>
                      )}
                      {job.contact_email && !job.application_url && (
                        <Button variant="aurora" size="sm" asChild>
                          <a href={`mailto:${job.contact_email}`}>
                            Contact
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
