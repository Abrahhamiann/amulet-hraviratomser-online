import React from 'react';
import { LayoutDashboard, LogOut, Mail, MessageSquare, ShoppingBag, Sparkles } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminLayout() {
  const { logout } = useAuth();
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <NavLink to="/" className="logo">Amulet</NavLink>
        <NavLink to="/admin"><LayoutDashboard size={18} />Dashboard</NavLink>
        <NavLink to="/admin/templates"><Sparkles size={18} />Templates</NavLink>
        <NavLink to="/admin/orders"><ShoppingBag size={18} />Orders</NavLink>
        <NavLink to="/admin/invitations"><Mail size={18} />Invitations</NavLink>
        <NavLink to="/admin/messages"><MessageSquare size={18} />Messages</NavLink>
        <button onClick={logout}><LogOut size={18} />Logout</button>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
