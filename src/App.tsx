import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import ProfessionalProfile from "./pages/ProfessionalProfile";
import GlobalFooter from "./components/Footer";
import ClientProfile from "./pages/ClientProfile";
import ProfessionalDashboard from "./pages/ProfessionalDashboard";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignIn/SignUp";
import ConfirmAuth from "./pages/SignIn/ConfirmAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/professional/:profileSlug"
            element={<ProfessionalProfile />}
          />
          <Route
            path="/professional/dashboard/*"
            element={<ProfessionalDashboard />}
          />
          <Route path={"/client/:clientId"} element={<ClientProfile />} />
          <Route path={"/client/profile"} element={<ClientProfile />} />
          <Route path={"/sign-in"} element={<SignIn />} />
          <Route path={"/sign-up"} element={<SignUp />} />
          <Route path={"/auth/confirm"} element={<ConfirmAuth />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
