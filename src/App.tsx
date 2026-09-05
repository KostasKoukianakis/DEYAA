import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider, useI18n } from "@/i18n";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PublicSiteWidgets } from "@/components/PublicSiteWidgets";
import { HomeInitialLoader } from "@/components/HomeInitialLoader";
import { HomeHeroGateProvider, useHomeHeroGate, useOptionalHomeHeroGate } from "@/contexts/HomeHeroGateContext";
import Index from "./pages/Index";

const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const EServices = lazy(() => import("./pages/EServices"));
const EServicesPayment = lazy(() => import("./pages/EServicesPayment"));
const EServicesMeterReading = lazy(() => import("./pages/EServicesMeterReading"));
const Announcements = lazy(() => import("./pages/Announcements"));
const AnnouncementDetail = lazy(() => import("./pages/AnnouncementDetail"));
const Contact = lazy(() => import("./pages/Contact"));
const Privacy = lazy(() => import("./pages/Privacy"));
const ProblemReporting = lazy(() => import("./pages/ProblemReporting"));
const BillCalculator = lazy(() => import("./pages/BillCalculator"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const NotFound = lazy(() => import("./pages/NotFound"));

const Login = lazy(() => import("./pages/dashboard/Login"));
const DashboardLayout = lazy(() => import("./pages/dashboard/DashboardLayout"));
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const PostsManagement = lazy(() => import("./pages/dashboard/PostsManagement"));
const TendersManagement = lazy(() => import("./pages/dashboard/TendersManagement"));
const DocumentsManagement = lazy(() => import("./pages/dashboard/DocumentsManagement"));
const Analytics = lazy(() => import("./pages/dashboard/Analytics"));
const EmailNotifications = lazy(() => import("./pages/dashboard/EmailNotifications"));
const ProblemsManagement = lazy(() => import("./pages/dashboard/ProblemsManagement"));
const SubscribersManagement = lazy(() => import("./pages/dashboard/SubscribersManagement"));
const NotificationsManagement = lazy(() => import("./pages/dashboard/NotificationsManagement"));
const ContactMessagesManagement = lazy(() => import("./pages/dashboard/ContactMessagesManagement"));

function HomeDropLoader() {
  const { pathname } = useLocation();
  const { showLoader, loaderDismissing, loaderStartedAt, sceneReady } = useHomeHeroGate();

  if (pathname !== "/") return null;

  return (
    <HomeInitialLoader
      visible={showLoader}
      dismissing={loaderDismissing}
      startedAt={loaderStartedAt}
      sceneReady={sceneReady}
    />
  );
}

function AppRouteFallback() {
  const { pathname } = useLocation();
  const gate = useOptionalHomeHeroGate();

  if (pathname === "/" && gate?.showLoader) {
    return null;
  }

  const { t } = useI18n();
  return <div className="min-h-[100dvh] bg-white" role="status" aria-label={t("common.loading")} />;
}

const queryClient = new QueryClient();

function AppRoutes() {
  return (
    <HomeHeroGateProvider>
      <PublicSiteWidgets />
      <HomeDropLoader />
      <Suspense fallback={<AppRouteFallback />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/test/shader-gradient" element={<Navigate to="/" replace />} />
          <Route path="/about" element={<About />} />
          <Route path="/about/mission" element={<Navigate to="/about#about-vision" replace />} />
          <Route path="/about/structure" element={<Navigate to="/about#about-structure" replace />} />
          <Route path="/about/administration" element={<Navigate to="/about#about-hero" replace />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/water" element={<Navigate to="/services#item-water" replace />} />
          <Route path="/services/sewerage" element={<Navigate to="/services#item-sewerage" replace />} />
          <Route path="/services/documents" element={<Navigate to="/services#item-documents" replace />} />
          <Route path="/e-services" element={<EServices />} />
          <Route path="/e-services/payment" element={<EServicesPayment />} />
          <Route path="/e-services/meter-reading" element={<EServicesMeterReading />} />
          <Route path="/e-services/bill-calculator" element={<BillCalculator />} />
          <Route path="/e-services/problem-reporting" element={<ProblemReporting />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/announcements/:id" element={<AnnouncementDetail />} />
          <Route path="/tenders" element={<Navigate to="/" replace />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/for-citizens" element={<Navigate to="/" replace />} />
          <Route path="/problem-reporting" element={<Navigate to="/e-services/problem-reporting" replace />} />
          <Route path="/problems" element={<Navigate to="/e-services/problem-reporting" replace />} />
          <Route path="/bill-calculator" element={<Navigate to="/e-services/bill-calculator" replace />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          <Route path="/dashboard/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="posts" element={<PostsManagement />} />
            <Route path="tenders" element={<TendersManagement />} />
            <Route path="documents" element={<DocumentsManagement />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="email-notifications" element={<EmailNotifications />} />
            <Route path="problems" element={<ProblemsManagement />} />
            <Route path="contact-messages" element={<ContactMessagesManagement />} />
            <Route path="subscribers" element={<SubscribersManagement />} />
            <Route path="notifications" element={<NotificationsManagement />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </HomeHeroGateProvider>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <LanguageProvider>
            <AppRoutes />
          </LanguageProvider>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
