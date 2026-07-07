import React from 'react';
import { useEffect, useState } from 'react';
import api from '../api/axios.js';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';

export default function AdminInvitationsPage() {
  const [orders, setOrders] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [orderId, setOrderId] = useState('');
  const [slug, setSlug] = useState('');

  const load = () => {
    api.get('/orders').then(({ data }) => setOrders(data));
    api.get('/invitations/admin/all').then(({ data }) => setInvitations(data));
  };
  useEffect(() => { load(); }, []);

  const create = async (event) => {
    event.preventDefault();
    await api.post('/invitations', { orderId, slug, isPublished: true });
    setOrderId('');
    setSlug('');
    load();
  };

  const toggle = async (item) => {
    await api.put(`/invitations/${item._id}`, { isPublished: !item.isPublished });
    load();
  };

  const remove = async (id) => {
    if (!confirm('Delete invitation?')) return;
    await api.delete(`/invitations/${id}`);
    load();
  };

  return (
    <section>
      <h1>Manage Invitations</h1>
      <form className="admin-form compact-admin" onSubmit={create}>
        <Input label="Create from order" as="select" value={orderId} onChange={(e) => setOrderId(e.target.value)} required>
          <option value="">Select order</option>
          {orders.map((order) => <option key={order._id} value={order._id}>{order.mainNames} · {order.fullName}</option>)}
        </Input>
        <Input label="Custom slug optional" value={slug} onChange={(e) => setSlug(e.target.value)} />
        <Button>Create public invitation</Button>
      </form>
      <div className="admin-table">
        {invitations.map((item) => (
          <div className="admin-row" key={item._id}>
            <strong>{item.names}</strong><a href={`/invite/${item.slug}`} target="_blank">/{item.slug}</a><span>{item.isPublished ? 'Published' : 'Draft'}</span>
            <button onClick={() => toggle(item)}>{item.isPublished ? 'Unpublish' : 'Publish'}</button>
            <button className="danger" onClick={() => remove(item._id)}>Delete</button>
          </div>
        ))}
      </div>
    </section>
  );
}
