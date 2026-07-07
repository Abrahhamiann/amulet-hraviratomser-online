import React from 'react';
import { useEffect, useState } from 'react';
import api from '../api/axios.js';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [rsvps, setRsvps] = useState([]);
  useEffect(() => {
    api.get('/contact').then(({ data }) => setMessages(data));
    api.get('/rsvp/admin/all').then(({ data }) => setRsvps(data));
  }, []);
  return (
    <section>
      <h1>Messages & RSVPs</h1>
      <h2>Contact messages</h2>
      <div className="admin-table">
        {messages.map((item) => <div className="admin-row tall" key={item._id}><strong>{item.name}</strong><span>{item.email}</span><span>{item.phone}</span><p>{item.message}</p></div>)}
      </div>
      <h2>RSVP responses</h2>
      <div className="admin-table">
        {rsvps.map((item) => <div className="admin-row tall" key={item._id}><strong>{item.guestName}</strong><span>{item.status}</span><span>{item.guestCount} guests</span><p>{item.message}</p></div>)}
      </div>
    </section>
  );
}
