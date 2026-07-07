import React from 'react';
import { useEffect, useState } from 'react';
import api from '../api/axios.js';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';

const empty = { title: '', category: 'wedding', price: '', description: '', features: '', mainImage: '', gallery: '', isFeatured: false };

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const load = () => api.get('/templates').then(({ data }) => setTemplates(data));
  useEffect(() => { load(); }, []);

  const save = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      features: String(form.features).split(',').map((x) => x.trim()).filter(Boolean),
      gallery: String(form.gallery).split(',').map((x) => x.trim()).filter(Boolean)
    };
    if (editing) await api.put(`/templates/${editing}`, payload);
    else await api.post('/templates', payload);
    setEditing(null);
    setForm(empty);
    load();
  };

  const edit = (item) => {
    setEditing(item._id);
    setForm({ ...item, features: item.features?.join(', '), gallery: item.gallery?.join(', ') });
  };

  const remove = async (id) => {
    if (!confirm('Delete this template?')) return;
    await api.delete(`/templates/${id}`);
    load();
  };

  return (
    <section>
      <h1>Manage Templates</h1>
      <form className="admin-form" onSubmit={save}>
        <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <Input label="Category" as="select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          {['wedding', 'baptism', 'birth', 'corporate', 'engagement'].map((x) => <option key={x} value={x}>{x}</option>)}
        </Input>
        <Input label="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
        <Input label="Main image URL or data URL" value={form.mainImage} onChange={(e) => setForm({ ...form, mainImage: e.target.value })} />
        <Input label="Description" as="textarea" rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        <Input label="Features comma separated" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} />
        <Input label="Gallery comma separated" value={form.gallery} onChange={(e) => setForm({ ...form, gallery: e.target.value })} />
        <label className="check-row"><input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} /> Featured</label>
        <Button>{editing ? 'Update template' : 'Create template'}</Button>
      </form>
      <div className="admin-table">
        {templates.map((item) => (
          <div className="admin-row" key={item._id}>
            <strong>{item.title}</strong><span>{item.category}</span><span>{Number(item.price).toLocaleString()} AMD</span>
            <button onClick={() => edit(item)}>Edit</button><button className="danger" onClick={() => remove(item._id)}>Delete</button>
          </div>
        ))}
      </div>
    </section>
  );
}
