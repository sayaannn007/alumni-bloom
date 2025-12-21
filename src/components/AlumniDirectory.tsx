import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Filter, 
  MapPin, 
  Briefcase, 
  GraduationCap,
  UserPlus,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const filters = [
  { label: "2020-2024", category: "Year" },
  { label: "2015-2019", category: "Year" },
  { label: "Tech", category: "Industry" },
  { label: "Finance", category: "Industry" },
  { label: "Healthcare", category: "Industry" },
  { label: "Mumbai", category: "Location" },
  { label: "Bangalore", category: "Location" },
  { label: "Delhi", category: "Location" },
];

const alumniData = [
  {
    id: 1,
    name: "Aisha Patel",
    batch: "2018",
    role: "Senior Product Manager",
    company: "Google",
    location: "San Francisco",
    avatar: "AP",
    mutual: 12,
    gradient: "from-aurora-cyan to-aurora-purple",
  },
  {
    id: 2,
    name: "Rahul Sharma",
    batch: "2019",
    role: "Software Engineer",
    company: "Microsoft",
    location: "Seattle",
    avatar: "RS",
    mutual: 8,
    gradient: "from-aurora-purple to-aurora-green",
  },
  {
    id: 3,
    name: "Maya Johnson",
    batch: "2020",
    role: "Data Scientist",
    company: "Netflix",
    location: "Los Angeles",
    avatar: "MJ",
    mutual: 15,
    gradient: "from-aurora-green to-aurora-cyan",
  },
  {
    id: 4,
    name: "Vikram Mehta",
    batch: "2017",
    role: "Founder & CEO",
    company: "TechStart",
    location: "Mumbai",
    avatar: "VM",
    mutual: 23,
    gradient: "from-aurora-gold to-aurora-purple",
  },
  {
    id: 5,
    name: "Sarah Kim",
    batch: "2021",
    role: "UX Designer",
    company: "Apple",
    location: "Cupertino",
    avatar: "SK",
    mutual: 6,
    gradient: "from-aurora-cyan to-aurora-gold",
  },
  {
    id: 6,
    name: "David Chen",
    batch: "2016",
    role: "Investment Banker",
    company: "Goldman Sachs",
    location: "New York",
    avatar: "DC",
    mutual: 19,
    gradient: "from-aurora-purple to-aurora-cyan",
  },
];

export function AlumniDirectory() {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchFocused, setSearchFocused] = useState(false);

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  return (
    <section id="directory" className="py-20 px-4 relative">
      {/* Background Accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-aurora-purple/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        {/* Section Header */}
        <div className="text-center mb-12 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Sparkles className="w-4 h-4 text-aurora-green" />
            <span className="text-sm font-medium text-muted-foreground">Discover your network</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl mb-4">
            Alumni <span className="text-aurora-green">Directory</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find and connect with fellow alumni from around the world
          </p>
        </div>

        {/* Search Bar */}
        <GlassCard 
          className={cn(
            "max-w-3xl mx-auto mb-8 p-3 opacity-0 animate-fade-in-up transition-all duration-300",
            searchFocused && "glass-glow scale-[1.01]"
          )}
          hover={false}
          style={{ animationDelay: "0.2s" }}
        >
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-muted-foreground ml-2" />
            <input
              type="text"
              placeholder="Search by name, batch year, company, or skills..."
              className="flex-1 bg-transparent border-0 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <Button variant="ghost" size="icon">
              <Filter className="w-5 h-5" />
            </Button>
          </div>
        </GlassCard>

        {/* Filter Chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          {filters.map((filter) => (
            <button
              key={filter.label}
              onClick={() => toggleFilter(filter.label)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                activeFilters.includes(filter.label)
                  ? "bg-gradient-to-r from-aurora-cyan to-aurora-purple text-primary-foreground shadow-lg shadow-primary/30"
                  : "glass hover:bg-white/10 text-muted-foreground hover:text-foreground"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Alumni Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {alumniData.map((alumni, index) => (
            <GlassCard
              key={alumni.id}
              className="opacity-0 animate-fade-in-up group cursor-pointer"
              style={{ animationDelay: `${0.4 + index * 0.1}s` }}
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className={cn(
                  "w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-lg font-bold text-primary-foreground shadow-lg transition-transform group-hover:scale-110",
                  alumni.gradient
                )}>
                  {alumni.avatar}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-semibold text-foreground truncate group-hover:text-aurora-cyan transition-colors">
                    {alumni.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <GraduationCap className="w-3 h-3 text-aurora-purple" />
                    <span className="text-xs text-muted-foreground">Batch of {alumni.batch}</span>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="w-4 h-4 text-aurora-cyan" />
                  <span className="text-muted-foreground">{alumni.role}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-foreground font-medium">@ {alumni.company}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-aurora-green" />
                  <span className="text-muted-foreground">{alumni.location}</span>
                </div>
              </div>

              {/* Mutual Connections */}
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  <span className="text-aurora-purple font-medium">{alumni.mutual}</span> mutual connections
                </span>
                <Button variant="aurora" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <UserPlus className="w-4 h-4" />
                  Connect
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* View More */}
        <div className="text-center mt-12 opacity-0 animate-fade-in-up" style={{ animationDelay: "1s" }}>
          <Button variant="glass" size="lg">
            View All Alumni
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
