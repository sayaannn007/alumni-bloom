import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { 
  ChevronUp, 
  Users, 
  Calendar, 
  Briefcase, 
  MessageCircle,
  Menu,
  X,
  Home,
  Sparkles
} from "lucide-react";
import { NotificationDropdown } from "./NotificationDropdown";

const navItems = [
  { icon: Home, label: "Home", href: "#" },
  { icon: Users, label: "Alumni", href: "#alumni" },
  { icon: Calendar, label: "Events", href: "/events" },
  { icon: Briefcase, label: "Jobs", href: "/jobs" },
  { icon: MessageCircle, label: "Messages", href: "/messages" },
];

export function FloatingNav() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    // Show after scrolling past hero section (approximately 600px)
    setIsVisible(latest > 600);
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavClick = (href: string) => {
    if (href.startsWith("#")) {
      if (href === "#") {
        scrollToTop();
      } else {
        const element = document.querySelector(href);
        element?.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.location.href = href;
    }
    setIsExpanded(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          {/* Navigation Items */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.label}
                    className="flex items-center gap-3 px-4 py-3 rounded-full glass hover:glass-glow transition-all duration-300 group"
                    initial={{ opacity: 0, x: 50, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 50, scale: 0.8 }}
                    transition={{ delay: index * 0.05, type: "spring", stiffness: 400 }}
                    onClick={() => handleNavClick(item.href)}
                    whileHover={{ scale: 1.05, x: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">
                      {item.label}
                    </span>
                    <item.icon className="w-5 h-5 text-primary" />
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main FAB Row */}
          <div className="flex items-center gap-3">
            {/* Notification Dropdown */}
            <NotificationDropdown />

            {/* Scroll to Top */}
            <motion.button
              className="w-12 h-12 rounded-full glass flex items-center justify-center hover:glass-glow transition-all duration-300"
              onClick={scrollToTop}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              animate={{
                boxShadow: [
                  "0 0 20px rgba(0, 242, 254, 0.2)",
                  "0 0 30px rgba(0, 242, 254, 0.4)",
                  "0 0 20px rgba(0, 242, 254, 0.2)",
                ],
              }}
              transition={{
                boxShadow: { duration: 2, repeat: Infinity },
              }}
            >
              <ChevronUp className="w-5 h-5 text-primary" />
            </motion.button>

            {/* Main Toggle Button */}
            <motion.button
              className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg"
              onClick={() => setIsExpanded(!isExpanded)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={{
                rotate: isExpanded ? 180 : 0,
                boxShadow: isExpanded
                  ? "0 0 40px rgba(191, 0, 255, 0.5)"
                  : "0 0 20px rgba(0, 242, 254, 0.3)",
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <AnimatePresence mode="wait">
                {isExpanded ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 180, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6 text-primary-foreground" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -180, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sparkles className="w-6 h-6 text-primary-foreground" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Pulse ring effect */}
          <motion.div
            className="absolute bottom-0 right-0 w-14 h-14 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, transparent 40%, rgba(0, 242, 254, 0.3) 60%, transparent 70%)",
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
