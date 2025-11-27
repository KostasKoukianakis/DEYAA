import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import AboutMission from "./pages/AboutMission";
import AboutAdministration from "./pages/AboutAdministration";
import Services from "./pages/Services";
import ServicesWater from "./pages/ServicesWater";
import ServicesSewerage from "./pages/ServicesSewerage";
import ServicesDocuments from "./pages/ServicesDocuments";
import EServices from "./pages/EServices";
import EServicesPayment from "./pages/EServicesPayment";
import EServicesMeterReading from "./pages/EServicesMeterReading";
import Announcements from "./pages/Announcements";
import Tenders from "./pages/Tenders";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
