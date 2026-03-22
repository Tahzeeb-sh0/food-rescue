import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import HomePage from "../pages/HomePage";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import ImpactPage from "../pages/ImpactPage";
import HowItworksPage from "../pages/HowItworksPage";
import PrivacyPolicyPage from "../pages/legal/PrivacyPolicyPage";
import TermsOfServicePage from "../pages/legal/TermsOfServicePage";
import CookiePolicyPage from "../pages/legal/CookiePolicyPage";
import DonorDashboard from "../pages/DonorDashboard";
import NgoDashboard from "../pages/NgoDashboard";

import AboutPage from "../pages/AboutPage";
import ContactPage from "../pages/ContactPage";
import NetworkPage from "../pages/NetworkPage";
import CareersPage from "../pages/CareersPage";
import DonateLandingPage from "../pages/DonateLandingPage";
import HelpCenterPage from "../pages/HelpCenterPage";

// New Final Pages
import DonorLoginPage from "../pages/DonorLoginPage";
import DonorRegisterPage from "../pages/DonorRegisterPage";
import ReportsPage from "../pages/ReportsPage";
import BoardPage from "../pages/BoardPage";
import PressPage from "../pages/PressPage";
import SafetyPage from "../pages/SafetyPage";
import ApiDocsPage from "../pages/ApiDocsPage";

const Router = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/howitworks" element={<HowItworksPage />} />
          <Route path="/impact" element={<ImpactPage />} />
          <Route path="/donate" element={<DonateLandingPage />} />
          
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/network" element={<NetworkPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/help" element={<HelpCenterPage />} />

          {/* New Footer Pages */}
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/board" element={<BoardPage />} />
          <Route path="/press" element={<PressPage />} />
          <Route path="/safety" element={<SafetyPage />} />
          <Route path="/api" element={<ApiDocsPage />} />

          {/* NGO & Donor Auth Routes */}
          <Route path="/ngo/register" element={<RegisterPage />} />
          <Route path="/ngo/login" element={<LoginPage />} />
          <Route path="/donor/login" element={<DonorLoginPage />} />
          <Route path="/donor/register" element={<DonorRegisterPage />} />
          
          <Route path="/ngo/dashboard" element={<NgoDashboard />} />
          <Route path="/donor/dashboard" element={<DonorDashboard />} />          

          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          <Route path="/cookies" element={<CookiePolicyPage />} />
        </Route>
      </Routes>
    </div>
  );
};

export default Router;
