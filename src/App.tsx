import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ModernSidebar } from './components/ModernSidebar';
import { Hero } from './components/Hero';
import { SafetyExcellence } from './components/SafetyExcellence';
import { HomeAdvantages } from './components/HomeAdvantages';
import { StatsAchievements } from './components/StatsAchievements';
import { OurMission } from './components/OurMission';
import { WhyNow } from './components/WhyNow';
import { PaymentSolutions } from './components/PaymentSolutions';
import { Reviews } from './components/Reviews';
import { PatientJourney } from './components/PatientJourney';
import { AboutClinic } from './components/AboutClinic';
import { OurServices } from './components/OurServices';
import { OurPrices } from './components/OurPrices';
import { PatientReviews } from './components/PatientReviews';
import { PromotionsPage } from './components/PromotionsPage';
import { ContactPage } from './components/ContactPage';
import { Footer } from './components/Footer';
import { Loader } from './components/Loader';
import { Doctors } from './components/Doctors';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { PrivacyTerms } from './components/PrivacyTerms';
import { License } from './components/License';
import { Portfolio } from './components/Portfolio';
import { Press } from './components/Press';
import { Blog } from './components/Blog';
import { BlogPostDetail } from './components/BlogPostDetail';
import { SubscriptionsPage } from './pages/SubscriptionsPage';
import { TeamStories } from './components/TeamStories';
import DentalMarketplace from './components/DentalMarketplace';
import { CallButton } from './components/CallButton';
import { UrgentCallButton } from './components/UrgentCallButton';
import { IOSStyleMenu } from './components/IOSStyleMenu';
import { WelcomeDialog } from './components/WelcomeDialog';
import { LoyaltyForm } from './components/LoyaltyForm';
import { SubscriptionShowcase } from './components/SubscriptionShowcase';
import { CookieBanner } from './components/CookieBanner';
import { ChatBot } from './components/ChatBot';
import { LoyaltyProgram } from './components/LoyaltyProgram';
import { MobileApp } from './components/MobileApp';
import { EmailMarketing } from './components/EmailMarketing';
import { VirtualTour } from './components/VirtualTour';
import { AdminPage } from './components/Admin/AdminPage';
import { FAQSection } from './components/FAQSection';
import { InstallPrompt } from './components/InstallPrompt';
import { TrainingPortal } from './components/TrainingPortal';
import { LearningPlatform } from './pages/LearningPlatform';
import { FinTablo } from './pages/FinTablo';
import { TabletShowcase } from './pages/TabletShowcase';
import { FloatingAppointmentButton } from './components/FloatingAppointmentButton';
import { logVisit } from './utils/analytics';

const ScrollToTop: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
};

const AppContent: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isLoyaltyFormOpen, setIsLoyaltyFormOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const logoImage = new Image();
    logoImage.src = "/ЗУБНАЯ СТАНЦИЯ (6) copy.png";

    const minLoadTime = 800;
    const startTime = Date.now();

    Promise.all([
      new Promise(resolve => logoImage.onload = resolve),
      new Promise(resolve => {
        const timeLeft = minLoadTime - (Date.now() - startTime);
        setTimeout(resolve, Math.max(0, timeLeft));
      })
    ]).then(() => {
      setLoading(false);
    });

    // Check if accessed via QR code and log visit with parameters
    const urlParams = new URLSearchParams(window.location.search);
    const qrParams: Record<string, string> = {};
    urlParams.forEach((value, key) => {
      qrParams[key] = value;
    });

    // Only log QR code visit if there are parameters
    if (Object.keys(qrParams).length > 0) {
      logVisit(qrParams);
    }

    if (urlParams.get('qr') === 'bonus') {
      setIsLoyaltyFormOpen(true);
    }

    return () => {
      logoImage.onload = null;
    };
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col mobile-safe-bottom">
      <ScrollToTop />
      <ModernSidebar />
      <main className="flex-grow lg:ml-20">
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <SafetyExcellence />
              <HomeAdvantages />
              <StatsAchievements />
              <OurMission />
              <WhyNow />
              <SubscriptionShowcase />
              <PaymentSolutions />
              <Reviews />
              <PatientJourney />
            </>
          } />
          <Route path="/about" element={<AboutClinic />} />
          <Route path="/services" element={<OurServices />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/prices" element={<OurPrices />} />
          <Route path="/reviews" element={<PatientReviews />} />
          <Route path="/promotions" element={<PromotionsPage />} />
          <Route path="/contacts" element={<ContactPage />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/press" element={<Press />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPostDetail />} />
          <Route path="/subscriptions" element={<SubscriptionsPage />} />
          <Route path="/team" element={<TeamStories />} />
          <Route path="/marketplace" element={<DentalMarketplace />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/privacy-terms" element={<PrivacyTerms />} />
          <Route path="/loyalty" element={<LoyaltyProgram />} />
          <Route path="/mobile-app" element={<MobileApp />} />
          <Route path="/newsletter" element={<EmailMarketing />} />
          <Route path="/virtual-tour" element={<VirtualTour />} />
          <Route path="/faq" element={<FAQSection />} />
          <Route path="/training" element={<TrainingPortal />} />
          <Route path="/learning" element={<LearningPlatform />} />
          <Route path="/fintablo" element={<FinTablo />} />
          <Route path="/tablet" element={<TabletShowcase />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
      <Footer />
      <FloatingAppointmentButton />
      <CallButton />
      <UrgentCallButton />
      <IOSStyleMenu />
      <WelcomeDialog />
      <ChatBot />
      <InstallPrompt />
      <LoyaltyForm isOpen={isLoyaltyFormOpen} onClose={() => setIsLoyaltyFormOpen(false)} />
      <CookieBanner />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;