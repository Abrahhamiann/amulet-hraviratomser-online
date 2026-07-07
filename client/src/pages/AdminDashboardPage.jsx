import React from 'react';
import { Mail, MessageSquare, ShoppingBag, Sparkles, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../api/axios.js';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    api.get('/stats').then(({ data }) => setStats(data)).catch(() => setStats({}));
  }, []);
  const cards = [
    ['Total templates', stats?.templates, Sparkles],
    ['Total orders', stats?.orders, ShoppingBag],
    ['Invitations', stats?.invitations, Mail],
    ['Total RSVPs', stats?.rsvps, Users],
    ['Contact messages', stats?.contacts, MessageSquare]
  ];
  return (
    <section>
      <h1>Dashboard</h1>
      <div className="admin-stats">
        {cards.map(([label, value, Icon]) => <div className="stat-card" key={label}><Icon size={22} /><span>{label}</span><strong>{value ?? '-'}</strong></div>)}
      </div>
    </section>
  );
}
