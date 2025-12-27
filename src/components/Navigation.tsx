import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X, Users, Calendar, Briefcase, User, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { label: "Directory", icon: Users, href: "/#directory" },
  { label: "Events", icon: Calendar, href: "/events" },
  { label: "Jobs", icon: Briefcase, href: "/jobs" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="glass glass-glow rounded-2xl px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-aurora-cyan to-aurora-purple flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-shadow">
              <span className="text-primary-foreground font-display font-bold text-lg">A</span>
            </div>
            <span className="font-display font-bold text-xl text-foreground hidden sm:block">
              Alumni<span className="text-aurora">Connect</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-4 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-200 flex items-center gap-2 text-sm font-medium"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </a>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Search className="w-5 h-5" />
            </Button>
            {user ? (
              <Button variant="aurora" size="sm" className="hidden sm:flex" asChild>
                <Link to="/profile">
                  <User className="w-4 h-4" />
                  My Profile
                </Link>
              </Button>
            ) : (
              <Button variant="aurora" size="sm" className="hidden sm:flex" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "md:hidden mt-2 glass rounded-2xl overflow-hidden transition-all duration-300",
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="p-4 space-y-2">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </a>
            ))}
            <div className="pt-2 border-t border-white/10">
              {user ? (
                <Button variant="aurora" className="w-full" asChild>
                  <Link to="/profile">
                    <User className="w-4 h-4" />
                    My Profile
                  </Link>
                </Button>
              ) : (
                <Button variant="aurora" className="w-full" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
