import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense, useState, useEffect, useRef } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { UserWayWidget } from "@/components/UserWayWidget";
import { WaterLoader } from "@/components/WaterLoader";

// Lazy load all pages for optimal performance
const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const AboutMission = lazy(() => import("./pages/AboutMission"));
const AboutAdministration = lazy(() => import("./pages/AboutAdministration"));
const Services = lazy(() => import("./pages/Services"));
const ServicesWater = lazy(() => import("./pages/ServicesWater"));
const ServicesSewerage = lazy(() => import("./pages/ServicesSewerage"));
const ServicesDocuments = lazy(() => import("./pages/ServicesDocuments"));
const EServices = lazy(() => import("./pages/EServices"));
const EServicesPayment = lazy(() => import("./pages/EServicesPayment"));
const EServicesMeterReading = lazy(() => import("./pages/EServicesMeterReading"));
const Announcements = lazy(() => import("./pages/Announcements"));
const Tenders = lazy(() => import("./pages/Tenders"));
const Contact = lazy(() => import("./pages/Contact"));
const ProblemReporting = lazy(() => import("./pages/ProblemReporting"));
const Problems = lazy(() => import("./pages/Problems"));
const BillCalculator = lazy(() => import("./pages/BillCalculator"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Lazy load dashboard components
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
const Settings = lazy(() => import("./pages/dashboard/Settings"));

// Simple loading spinner for lazy-loaded components (not initial page load)
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
  </div>
);

// Initial page loader - shows only on first page load for ~2 seconds
const InitialPageLoader = () => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const startTime = startTimeRef.current;

    // Smooth progress animation over 2 seconds
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progressPercent = Math.min(100, (elapsed / duration) * 100);
      setProgress(progressPercent);

      if (progressPercent >= 100) {
        clearInterval(interval);
        // Fade out and hide
        setTimeout(() => {
          setIsVisible(false);
        }, 300);
      }
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-white transition-opacity duration-300 ${
        progress >= 100 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <WaterLoader progress={progress} />
    </div>
  );
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <InitialPageLoader />
          <UserWayWidget />
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/about/mission" element={<AboutMission />} />
              <Route path="/about/administration" element={<AboutAdministration />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/water" element={<ServicesWater />} />
              <Route path="/services/sewerage" element={<ServicesSewerage />} />
              <Route path="/services/documents" element={<ServicesDocuments />} />
              <Route path="/e-services" element={<EServices />} />
              <Route path="/e-services/payment" element={<EServicesPayment />} />
              <Route path="/e-services/meter-reading" element={<EServicesMeterReading />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/tenders" element={<Tenders />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/for-citizens" element={<Navigate to="/" replace />} />
              <Route path="/problem-reporting" element={<ProblemReporting />} />
              <Route path="/problems" element={<Problems />} />
              <Route path="/bill-calculator" element={<BillCalculator />} />
              <Route path="/verify-email" element={<VerifyEmail />} />

              {/* Dashboard Routes */}
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
                <Route path="subscribers" element={<SubscribersManagement />} />
                <Route path="notifications" element={<NotificationsManagement />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
