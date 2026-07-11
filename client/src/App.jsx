import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AccountPage from './pages/AccountPage.jsx';
import PublicLayout from './layouts/PublicLayout.jsx';
import AboutPage from './pages/AboutPage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import HomePage from './pages/HomePage.jsx';
import InvitationPage from './pages/InvitationPage.jsx';
import OrderPage from './pages/OrderPage.jsx';
import PrivacyPage from './pages/PrivacyPage.jsx';
import TemplateDetailsPage from './pages/TemplateDetailsPage.jsx';
import TemplatesPage from './pages/TemplatesPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/templates/:id" element={<TemplateDetailsPage />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/verify-email" element={<AuthPage />} />
        <Route path="/account" element={<AccountPage />} />
      </Route>
      <Route path="/invite/:slug" element={<InvitationPage />} />
    </Routes>
  );
}
