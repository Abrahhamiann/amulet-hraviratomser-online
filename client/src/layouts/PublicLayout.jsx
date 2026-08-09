import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import FloatingContact from '../components/FloatingContact.jsx';
import Header from '../components/Header.jsx';

export default function PublicLayout() {
  return (
    <div className="public-layout">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <FloatingContact />
    </div>
  );
}
