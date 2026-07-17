import React from 'react';
import { CheckCircle2, ImagePlus, X } from 'lucide-react';
import { useState } from 'react';
import GoldenDemoInvitation, { goldenDemoInitialData } from '../invitationTemplates/GoldenDemoInvitation.jsx';

export default function DemoInvitationPage() {
  const [data, setData] = useState(goldenDemoInitialData);
  const [editing, setEditing] = useState(false);
  const [buyStatus, setBuyStatus] = useState('');

  const updateField = (event) => {
    const { name, value } = event.target;
    setData((current) => ({ ...current, [name]: value }));
  };

  const updateImages = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setData((current) => ({
      ...current,
      images: files.map((file) => URL.createObjectURL(file))
    }));
  };

  const submitDemo = (event) => {
    event.preventDefault();
    setEditing(false);
    setBuyStatus('');
  };

  const buyDemo = () => {
    setBuyStatus('Սա demo գնելու կոճակ է․ server կամ database հարցում չի կատարվել։');
  };

  return (
    <main className="demo-invite-page">
      <section className="demo-invite-shell">
        <div className="demo-invite-heading">
          <span>Կենդանի դիտում</span>
          <h1>Golden Amulet</h1>
          <p>Փոխիր demo տվյալները և տես, թե հրավերը ինչպես կերևա գնելուց հետո։</p>
        </div>

        <GoldenDemoInvitation data={data} onEdit={() => setEditing(true)} onBuy={buyDemo} />

        {buyStatus && (
          <div className="demo-buy-status" role="status">
            <CheckCircle2 size={18} />
            <span>{buyStatus}</span>
          </div>
        )}
      </section>

      {editing && (
        <section className="demo-editor-panel" aria-label="Edit invitation demo">
          <form className="demo-editor-form" onSubmit={submitDemo}>
            <div className="demo-editor-title">
              <span>Խմբագրել հրավերը</span>
              <button type="button" onClick={() => setEditing(false)} aria-label="Close editor"><X size={20} /></button>
            </div>

            <label>
              Անուն ազգանուն
              <input name="fullName" value={data.fullName} onChange={updateField} required />
            </label>
            <label>
              Առիթի օրը
              <input name="eventDate" type="date" value={data.eventDate} onChange={updateField} required />
            </label>
            <label>
              Ժամը
              <input name="eventTime" type="time" value={data.eventTime} onChange={updateField} required />
            </label>
            <label>
              Վայրը
              <input name="eventLocation" value={data.eventLocation} onChange={updateField} required />
            </label>
            <label className="demo-editor-wide">
              Հրավերի տեքստ
              <textarea name="message" rows="4" value={data.message} onChange={updateField} required />
            </label>
            <label className="demo-upload-field">
              <ImagePlus size={20} />
              <span>Ավելացնել նկարներ</span>
              <input type="file" accept="image/*" multiple onChange={updateImages} />
            </label>

            <button className="demo-save-btn" type="submit">Ցուցադրել թարմացված demo-ն</button>
          </form>
        </section>
      )}
    </main>
  );
}
