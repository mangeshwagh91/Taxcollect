import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import LoginPage from "@/pages/LoginPage";
import AdminLayout from "@/pages/AdminLayout";
import CitizenLayout from "@/pages/CitizenLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import PropertiesPage from "@/pages/admin/PropertiesPage";
import GISMapPage from "@/pages/admin/GISMapPage";
import DefaultersPage from "@/pages/admin/DefaultersPage";
import ChatbotPage from "@/pages/admin/ChatbotPage";
import AnalyticsPage from "@/pages/admin/AnalyticsPage";
import NotificationsPage from "@/pages/admin/NotificationsPage";
import CitizenDashboard from "@/pages/citizen/CitizenDashboard";
import CitizenProperties from "@/pages/citizen/CitizenProperties";
import PaymentHistoryPage from "@/pages/citizen/PaymentHistoryPage";
import AutoPayPage from "@/pages/citizen/AutoPayPage";
import CitizenSettingsPage from "@/pages/citizen/CitizenSettingsPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen bg-background" />;
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="*" element={<LoginPage />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to={user?.role === "admin" ? "/admin" : "/citizen"} replace />} />

      {/* Admin Routes */}
      <Route path="/admin" element={user?.role === "admin" ? <AdminLayout /> : <Navigate to="/citizen" replace />}>
        <Route index element={<AdminDashboard />} />
        <Route path="properties" element={<PropertiesPage />} />
        <Route path="map" element={<GISMapPage />} />
        <Route path="defaulters" element={<DefaultersPage />} />
        <Route path="chatbot" element={<ChatbotPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
      </Route>

      {/* Citizen Routes */}
      <Route path="/citizen" element={user?.role === "citizen" ? <CitizenLayout /> : <Navigate to="/admin" replace />}>
        <Route index element={<CitizenDashboard />} />
        <Route path="properties" element={<CitizenProperties />} />
        <Route path="history" element={<PaymentHistoryPage />} />
        <Route path="autopay" element={<AutoPayPage />} />
        <Route path="settings" element={<CitizenSettingsPage />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
