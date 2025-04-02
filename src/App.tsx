import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "@/contexts/AuthContext";
import { CompanyProvider } from "@/contexts/CompanyContext";
import { KanbanProvider } from "@/contexts/KanbanContext";
import { AuthGuard } from "@/components/auth/AuthGuard";

import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import PipelinePage from "./pages/PipelinePage";
import CalendarPage from "./pages/CalendarPage";
import LogsPage from "./pages/LogsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ConversationsPage from "./pages/ConversationsPage";
import TeamPage from "./pages/TeamPage";
import SettingsPage from "./pages/SettingsPage";
import CompaniesPage from "./pages/admin/CompaniesPage";
import CompanyManagePage from "./pages/admin/CompanyManagePage";
import CompanyUsersPage from "./pages/admin/CompanyUsersPage";
import NotFound from "./pages/NotFound";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <CompanyProvider>
            <KanbanProvider>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Protected routes - Regular users */}
                <Route path="/dashboard" element={
                  <AuthGuard>
                    <DashboardPage />
                  </AuthGuard>
                } />
                <Route path="/pipeline" element={
                  <AuthGuard>
                    <PipelinePage />
                  </AuthGuard>
                } />
                <Route path="/calendar" element={
                  <AuthGuard>
                    <CalendarPage />
                  </AuthGuard>
                } />
                <Route path="/logs" element={
                  <AuthGuard>
                    <LogsPage />
                  </AuthGuard>
                } />
                <Route path="/analytics" element={
                  <AuthGuard>
                    <AnalyticsPage />
                  </AuthGuard>
                } />
                <Route path="/conversations" element={
                  <AuthGuard>
                    <ConversationsPage />
                  </AuthGuard>
                } />
                <Route path="/team" element={
                  <AuthGuard allowedRoles={["super_admin", "admin"]}>
                    <TeamPage />
                  </AuthGuard>
                } />
                <Route path="/settings" element={
                  <AuthGuard>
                    <SettingsPage />
                  </AuthGuard>
                } />
                
                {/* Admin routes */}
                <Route path="/admin/companies" element={
                  <AuthGuard allowedRoles={["super_admin"]}>
                    <CompaniesPage />
                  </AuthGuard>
                } />
                <Route path="/admin/companies/:companyId" element={
                  <AuthGuard allowedRoles={["super_admin"]}>
                    <CompanyManagePage />
                  </AuthGuard>
                } />
                <Route path="/admin/companies/:companyId/users" element={
                  <AuthGuard allowedRoles={["super_admin"]}>
                    <CompanyUsersPage />
                  </AuthGuard>
                } />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
                
                {/* Existing routes */}
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              </Routes>
            </KanbanProvider>
          </CompanyProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
