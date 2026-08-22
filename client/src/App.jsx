import React, { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout.jsx';
import Loading from './components/Loading.jsx';

const AccountPage = lazy(() => import('./pages/AccountPage.jsx'));
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'));
const AuthPage = lazy(() => import('./pages/AuthPage.jsx'));
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage.jsx'));
const GuestResponsesPage = lazy(() => import('./pages/GuestResponsesPage.jsx'));
const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const InvitationPage = lazy(() => import('./pages/InvitationPage.jsx'));
const OrderPage = lazy(() => import('./pages/OrderPage.jsx'));
const PaymentSuccessPage = lazy(() => import('./pages/PaymentSuccessPage.jsx'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage.jsx'));
const TemplateDetailsPage = lazy(() => import('./pages/TemplateDetailsPage.jsx'));
const TemplateLivePreviewPage = lazy(() => import('./pages/TemplateLivePreviewPage.jsx'));
const TemplatesPage = lazy(() => import('./pages/TemplatesPage.jsx'));

export default function App() {
  return (
    <Suspense fallback={<Loading text="Loading..." />}>
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
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-email" element={<AuthPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/account/invitations/:invitationId/responses" element={<GuestResponsesPage />} />
          <Route path="/payment/success" element={<PaymentSuccessPage />} />
        </Route>
        <Route path="/templates/:id/live" element={<TemplateLivePreviewPage />} />
        <Route path="/preview/:previewToken" element={<TemplateLivePreviewPage />} />
        <Route path="/invite/:slug" element={<InvitationPage />} />
      </Routes>
    </Suspense>
  );
}
