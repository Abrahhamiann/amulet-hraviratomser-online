import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import PublicLayout from './layouts/PublicLayout.jsx';
import AboutPage from './pages/AboutPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import AdminInvitationsPage from './pages/AdminInvitationsPage.jsx';
import AdminLoginPage from './pages/AdminLoginPage.jsx';
import AdminMessagesPage from './pages/AdminMessagesPage.jsx';
import AdminOrdersPage from './pages/AdminOrdersPage.jsx';
import AdminTemplatesPage from './pages/AdminTemplatesPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import HomePage from './pages/HomePage.jsx';
import InvitationPage from './pages/InvitationPage.jsx';
import OrderPage from './pages/OrderPage.jsx';
import TemplateDetailsPage from './pages/TemplateDetailsPage.jsx';
import TemplatesPage from './pages/TemplatesPage.jsx';

function ProtectedRoute({ children }) {
  const { isAdmin } = useAuth();
  return isAdmin ? children : <Navigate to="/admin/login" replace />;
}

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
      </Route>
      <Route path="/invite/:slug" element={<InvitationPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="templates" element={<AdminTemplatesPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="invitations" element={<AdminInvitationsPage />} />
        <Route path="messages" element={<AdminMessagesPage />} />
      </Route>
    </Routes>
  );
}
