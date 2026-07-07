import React from 'react';
export default function Loading({ text = 'Loading...' }) {
  return <div className="state-box">{text}</div>;
}
