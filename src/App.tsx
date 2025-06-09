import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Import the original React components
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Import the new Bizzleap React components
import WelcomePage from "./components/WelcomePage";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import SocialCampaign from "./pages/SocialCampaign";
import Chat from "./pages/Chat";
import Feedback from "./pages/Feedback";
import ProductManagement from "./pages/ProductManagement";

// Mobile platform styles are now handled by TailwindCSS

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Original route */}
          <Route path="/original" element={<Index />} />

          {/* New Bizzleap Mobile App Routes */}
          <Route path="/" element={<WelcomePage />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />

          {/* Redirect common routes */}
          <Route path="/home" element={<Navigate to="/dashboard" replace />} />
          <Route path="/app" element={<Navigate to="/dashboard" replace />} />

          {/* Import missing pages */}
          <Route path="/social-campaigns" element={<SocialCampaign />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/add-product" element={<ProductManagement />} />
          <Route path="/products" element={<ProductManagement />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
