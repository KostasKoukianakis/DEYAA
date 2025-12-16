import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

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
const BillCalculator = lazy(() => import("./pages/BillCalculator"));
const ForCitizens = lazy(() => import("./pages/ForCitizens"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Lazy load dashboard components
const DashboardLayout = lazy(() => import("./pages/dashboard/DashboardLayout"));
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const PostsManagement = lazy(() => import("./pages/dashboard/PostsManagement"));
const ProblemsManagement = lazy(() => import("./pages/dashboard/ProblemsManagement"));
const SubscribersManagement = lazy(() => import("./pages/dashboard/SubscribersManagement"));
const NotificationsManagement = lazy(() => import("./pages/dashboard/NotificationsManagement"));
const Settings = lazy(() => import("./pages/dashboard/Settings"));

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
            <Route path="/for-citizens" element={<ForCitizens />} />
            <Route path="/problem-reporting" element={<ProblemReporting />} />
            <Route path="/bill-calculator" element={<BillCalculator />} />

            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="posts" element={<PostsManagement />} />
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
  </QueryClientProvider>
);

export default App;
