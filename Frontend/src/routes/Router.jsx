import React from "react";
import { Routes ,Route} from "react-router-dom";
import Layout from "../components/layout/Layout";
import HomePage from "../pages/HomePage";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import ImpactPage from "../pages/ImpactPage";
import HowItworksPage from "../pages/HowItworksPage";
import PrivacyPolicyPage from "../pages/legal/PrivacyPolicyPage";
import TermsOfServicePage from "../pages/legal/TermsOfServicePage";
import CookiePolicyPage from "../pages/legal/CookiePolicyPage";


const Router = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="ngo/register" element={<RegisterPage />} />
          <Route path="ngo/login" element={<LoginPage />} />
          <Route path="/impact" element={<ImpactPage/>}/>
          <Route path="/howitworks" element={<HowItworksPage/>}/>



          <Route path="/privacy" element={<PrivacyPolicyPage/>}/>
          <Route path="/terms" element={<TermsOfServicePage/>}/>
          <Route path="/cookies" element={<CookiePolicyPage/>}/>
      
        </Route>
      </Routes>
    </div>
  );
};

export default Router;
