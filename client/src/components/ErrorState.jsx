import React from 'react';
export default function ErrorState({ text = 'Something went wrong' }) {
  return <div className="state-box error-state">{text}</div>;
}
