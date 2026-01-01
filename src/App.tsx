import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "next-themes";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/transitions";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Events from "./pages/Events";
import Jobs from "./pages/Jobs";
import Messages from "./pages/Messages";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const pageVariants = ["fade", "slide", "scale", "morph", "liquid"] as const;

function AnimatedRoutes() {
  const location = useLocation();
  
  // Cycle through different transition types based on route
  const getVariant = () => {
    const routes: Record<string, typeof pageVariants[number]> = {
      "/": "liquid",
      "/auth": "morph",
      "/profile": "scale",
      "/events": "slide",
      "/jobs": "fade",
      "/messages": "liquid",
    };
    return routes[location.pathname] || "liquid";
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageTransition variant={getVariant()}>
            <Index />
          </PageTransition>
        } />
        <Route path="/auth" element={
          <PageTransition variant="morph">
            <Auth />
          </PageTransition>
        } />
        <Route path="/profile" element={
          <PageTransition variant="scale">
            <Profile />
          </PageTransition>
        } />
        <Route path="/events" element={
          <PageTransition variant="slide">
            <Events />
          </PageTransition>
        } />
        <Route path="/jobs" element={
          <PageTransition variant="fade">
            <Jobs />
          </PageTransition>
        } />
        <Route path="/messages" element={
          <PageTransition variant="liquid">
            <Messages />
          </PageTransition>
        } />
        <Route path="*" element={
          <PageTransition variant="morph">
            <NotFound />
          </PageTransition>
        } />
      </Routes>
    </AnimatePresence>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnimatedRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
