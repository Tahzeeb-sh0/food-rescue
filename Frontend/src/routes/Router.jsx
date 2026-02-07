import React from "react";
import { Routes ,Route} from "react-router-dom";
import Layout from "../components/layout/Layout";
import HomePage from "../pages/HomePage";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";


const Router = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="ngo/register" element={<RegisterPage />} />
          <Route path="ngo/login" element={<LoginPage />} />
      
        </Route>
      </Routes>
    </div>
  );
};

export default Router;
