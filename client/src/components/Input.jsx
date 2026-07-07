import React from 'react';
export default function Input({ label, error, as = 'input', children, ...props }) {
  const Component = as;
  return (
    <label className="field">
      <span>{label}</span>
      <Component className={error ? 'input input-error' : 'input'} {...props}>{children}</Component>
      {error && <small role="alert">{error}</small>}
    </label>
  );
}
