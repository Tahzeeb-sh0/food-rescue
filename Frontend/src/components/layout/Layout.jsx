import React from 'react';
import Header from './Header';
import Footer from './Footer';
import ConnectionBanner from '../ConnectionBanner';
import { Outlet, useLocation } from 'react-router-dom';

const Layout = () => {
  const location = useLocation();
  const path = location.pathname;

  const noHeaderFooterRoutes = [
    '/ngo/register',
    '/ngo/login',
    '/donor/register',
    '/donor/login',
    '/privacy',
    '/terms',
    '/cookies',
  ];
  const hideHeaderFooter = noHeaderFooterRoutes.includes(path);

  if (hideHeaderFooter) {
    return (
      <div className="min-h-dvh min-w-0 w-full overflow-x-clip flex flex-col">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-dvh min-w-0 w-full overflow-x-clip">
      <Header />
      <ConnectionBanner />
      <main className="flex-1 min-w-0 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
