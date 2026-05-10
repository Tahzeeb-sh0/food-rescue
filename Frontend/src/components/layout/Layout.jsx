import React from 'react'
import Header from './Header'
import Footer from './Footer'
import { Outlet, useLocation } from "react-router-dom";


const Layout = () => {
  const location = useLocation();
  const path = location.pathname

  const noHeaderFooterRoutes = ['/ngo/register', '/ngo/login', '/donor/register', '/donor/login','/privacy','/terms','/cookies'];
  const hideHeaderFooter = noHeaderFooterRoutes.includes(path);

  if (hideHeaderFooter) {
    return (
      <div>
        <Outlet />
      </div>
    );
  }
    
  return (
    <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
            <Outlet/>
        </main>
        <Footer />
    </div>
  )
}

export default Layout
