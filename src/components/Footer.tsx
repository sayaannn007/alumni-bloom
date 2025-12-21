import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { 
  Mail, 
  Linkedin, 
  Twitter, 
  Instagram,
  ArrowRight,
  Heart
} from "lucide-react";

const footerLinks = {
  Platform: ["Directory", "Events", "Careers", "Mentorship"],
  Resources: ["Help Center", "Privacy Policy", "Terms of Service", "Contact Us"],
  Community: ["Blog", "Newsletter", "Alumni Stories", "Partner With Us"],
};

const socialLinks = [
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
];

export function Footer() {
  return (
    <footer className="relative py-20 px-4">
      {/* Newsletter Section */}
      <div className="max-w-4xl mx-auto mb-20">
        <GlassCard className="text-center p-8 md:p-12 glass-glow">
          <h3 className="font-display font-bold text-2xl md:text-3xl mb-4">
            Stay <span className="text-aurora">Connected</span>
          </h3>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Get the latest updates on events, opportunities, and alumni news delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="flex-1 relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
              />
            </div>
            <Button variant="aurora" size="lg">
              Subscribe
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </GlassCard>
      </div>

      {/* Footer Content */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-aurora-cyan to-aurora-purple flex items-center justify-center shadow-lg shadow-primary/30">
                <span className="text-primary-foreground font-display font-bold text-lg">A</span>
              </div>
              <span className="font-display font-bold text-xl text-foreground">
                Alumni<span className="text-aurora">Connect</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Reconnecting alumni, building futures, and fostering lifelong connections.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:bg-white/10 transition-colors group"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-muted-foreground group-hover:text-aurora-cyan transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-display font-semibold text-foreground mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-aurora-cyan transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            © 2024 AlumniConnect. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-aurora-purple fill-aurora-purple" /> for alumni worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}
