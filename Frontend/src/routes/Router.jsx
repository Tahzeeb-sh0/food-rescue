import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import HomePage from "../pages/HomePage";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import ImpactPage from "../pages/ImpactPage";
import HowItWorksPage from "../pages/HowItWorksPage";
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
import ProfilePage from "../pages/ProfilePage";
import SettingsPage from "../pages/SettingsPage";
import CompliancePage from "../pages/CompliancePage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import LeaderboardPage from "../pages/LeaderboardPage";
import ProtectedRoute from "../components/auth/ProtectedRoute";

const Router = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/howitworks" element={<HowItWorksPage />} />
          <Route path="/impact" element={<ImpactPage />} />
          <Route path="/donate" element={<DonateLandingPage />} />
          
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/network" element={<NetworkPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/help" element={<HelpCenterPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />

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
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          
          <Route 
            path="/ngo/dashboard" 
            element={
              <ProtectedRoute requiredRole="NGO">
                <NgoDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/donor/dashboard" 
            element={
              <ProtectedRoute requiredRole="DONOR">
                <DonorDashboard />
              </ProtectedRoute>
            } 
          />          
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/compliance" element={<CompliancePage />} />

          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          <Route path="/cookies" element={<CookiePolicyPage />} />
        </Route>
      </Routes>
    </div>
  );
};

export default Router;
