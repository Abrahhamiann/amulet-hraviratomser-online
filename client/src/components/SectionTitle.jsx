import React from 'react';
export default function SectionTitle({ title, text }) {
  return (
    <div className="section-title reveal">
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}
