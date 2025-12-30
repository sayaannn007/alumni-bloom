import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X, Users, Calendar, Briefcase, User, Search, MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { MagneticWrapper, GradientRipple } from "@/components/transitions";

const navItems = [
  { label: "Directory", icon: Users, href: "/#directory" },
  { label: "Events", icon: Calendar, href: "/events" },
  { label: "Jobs", icon: Briefcase, href: "/jobs" },
  { label: "Messages", icon: MessageSquare, href: "/messages" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 px-4 py-4"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="glass glass-glow rounded-2xl px-6 py-3 flex items-center justify-between"
          whileHover={{ boxShadow: "0 0 40px hsl(var(--primary) / 0.3)" }}
          transition={{ duration: 0.3 }}
        >
          {/* Logo */}
          <MagneticWrapper strength={0.15}>
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div 
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-aurora-cyan to-aurora-purple flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-shadow"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <span className="text-primary-foreground font-display font-bold text-lg">A</span>
              </motion.div>
              <span className="font-display font-bold text-xl text-foreground hidden sm:block">
                Alumni<span className="text-aurora">Connect</span>
              </span>
            </Link>
          </MagneticWrapper>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 relative">
            {navItems.map((item) => (
              <GradientRipple
                key={item.label}
                className="rounded-xl"
                onClick={() => {
                  if (item.href.startsWith("/#")) {
                    window.location.href = item.href;
                  } else {
                    navigate(item.href);
                  }
                }}
              >
                <motion.div
                  className="px-4 py-2 rounded-xl text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-2 text-sm font-medium cursor-pointer"
                  onHoverStart={() => setHoveredItem(item.label)}
                  onHoverEnd={() => setHoveredItem(null)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    animate={{ 
                      rotate: hoveredItem === item.label ? [0, -10, 10, 0] : 0,
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    <item.icon className="w-4 h-4" />
                  </motion.div>
                  {item.label}
                  
                  {/* Hover glow effect */}
                  <AnimatePresence>
                    {hoveredItem === item.label && (
                      <motion.div
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 via-accent/10 to-transparent -z-10"
                        layoutId="navHover"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </AnimatePresence>
                </motion.div>
              </GradientRipple>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <MagneticWrapper strength={0.2}>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="icon" className="hidden sm:flex">
                  <Search className="w-5 h-5" />
                </Button>
              </motion.div>
            </MagneticWrapper>
            
            {user ? (
              <MagneticWrapper strength={0.15}>
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="aurora" size="sm" className="hidden sm:flex" asChild>
                    <Link to="/profile">
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>
                  </Button>
                </motion.div>
              </MagneticWrapper>
            ) : (
              <MagneticWrapper strength={0.15}>
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="aurora" size="sm" className="hidden sm:flex" asChild>
                    <Link to="/auth">Sign In</Link>
                  </Button>
                </motion.div>
              </MagneticWrapper>
            )}

            {/* Mobile Menu Button */}
            <motion.div whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsOpen(!isOpen)}
              >
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="md:hidden mt-2 glass rounded-2xl overflow-hidden"
              initial={{ height: 0, opacity: 0, y: -20 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="p-4 space-y-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <GradientRipple
                      className="rounded-xl w-full"
                      onClick={() => {
                        setIsOpen(false);
                        if (item.href.startsWith("/#")) {
                          window.location.href = item.href;
                        } else {
                          navigate(item.href);
                        }
                      }}
                    >
                      <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all cursor-pointer">
                        <item.icon className="w-5 h-5" />
                        {item.label}
                      </div>
                    </GradientRipple>
                  </motion.div>
                ))}
                <motion.div 
                  className="pt-2 border-t border-white/10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: navItems.length * 0.05 + 0.1 }}
                >
                  {user ? (
                    <Button variant="aurora" className="w-full" asChild>
                      <Link to="/profile" onClick={() => setIsOpen(false)}>
                        <User className="w-4 h-4" />
                        My Profile
                      </Link>
                    </Button>
                  ) : (
                    <Button variant="aurora" className="w-full" asChild>
                      <Link to="/auth" onClick={() => setIsOpen(false)}>Sign In</Link>
                    </Button>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
