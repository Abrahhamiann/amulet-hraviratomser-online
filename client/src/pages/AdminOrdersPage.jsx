import React from 'react';
import { useEffect, useState } from 'react';
import api from '../api/axios.js';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const load = () => api.get('/orders').then(({ data }) => setOrders(data));
  useEffect(() => { load(); }, []);
  const update = async (id, status) => {
    await api.patch(`/orders/${id}/status`, { status });
    load();
  };
  return (
    <section>
      <h1>Manage Orders</h1>
      <div className="admin-table">
        
        {orders.map((order) => (
          <div className="admin-row tall" key={order._id}>
            <div><strong>{order.fullName}</strong><small>{order.email} · {order.phone}</small></div>
            <div><span>{order.mainNames}</span><small>{order.eventLocation}</small></div>
            <select value={order.status} onChange={(e) => update(order._id, e.target.value)}>
              {['new', 'in_progress', 'completed', 'cancelled'].map((x) => <option key={x} value={x}>{x}</option>)}
            </select>
          </div>
        ))}
      </div>
    </section>
  );
}
