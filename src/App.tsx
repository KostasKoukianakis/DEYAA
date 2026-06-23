import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PublicSiteWidgets } from "@/components/PublicSiteWidgets";
// import { WaterLoader } from "@/components/WaterLoader";

// Lazy load all pages for optimal performance
const Index = lazy(() => import("./pages/Index"));
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
const ContactMessagesManagement = lazy(() => import("./pages/dashboard/ContactMessagesManagement"));

// Simple loading spinner for lazy-loaded components (not initial page load)
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
  </div>
);

// Initial page loader — disabled (shows WaterLoader on every refresh)
/*
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
*/

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {/* <InitialPageLoader /> */}
          <PublicSiteWidgets />
          <Suspense fallback={<LoadingSpinner />}>
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
                <Route path="contact-messages" element={<ContactMessagesManagement />} />
                <Route path="subscribers" element={<SubscribersManagement />} />
                <Route path="notifications" element={<NotificationsManagement />} />
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
