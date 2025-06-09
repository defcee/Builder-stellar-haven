import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Import the original React components
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Import the new Bizzleap React components
import WelcomePageReact from "./components/WelcomePageReact";
import AuthReact from "./pages/AuthReact";
import DashboardReact from "./pages/DashboardReact";
import ProfileReact from "./pages/ProfileReact";
import SocialCampaign from "./pages/SocialCampaign";
import Chat from "./pages/Chat";
import Feedback from "./pages/Feedback";
import ProductManagement from "./pages/ProductManagement";

// Import mobile platform styles
import "./styles/mobile-platform.css";

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
          <Route path="/" element={<WelcomePageReact />} />
          <Route path="/welcome" element={<WelcomePageReact />} />
          <Route path="/auth" element={<AuthReact />} />
          <Route path="/login" element={<AuthReact />} />
          <Route path="/register" element={<AuthReact />} />
          <Route path="/dashboard" element={<DashboardReact />} />
          <Route path="/profile" element={<ProfileReact />} />

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
