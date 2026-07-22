import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import Header from '../components/Header.jsx';

export default function PublicLayout() {
  const { pathname } = useLocation();
  const hideFooter = pathname === '/account';

  return (
    <div className="public-layout">
      <Header />
      <main>
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}
