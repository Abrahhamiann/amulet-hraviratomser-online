import React, { useId } from 'react';
export default function Input({ label, error, reserveErrorSpace = false, as = 'input', children, id, ...props }) {
  const Component = as;
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;
  return (
    <label className="field" htmlFor={inputId}>
      <span>{label}</span>
      <Component
        id={inputId}
        className={error ? 'input input-error' : 'input'}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...props}
      >{children}</Component>
      {(error || reserveErrorSpace) && (
        <small id={errorId} className="field-error-message" role={error ? 'alert' : undefined} aria-hidden={!error}>
          {error || '\u00a0'}
        </small>
      )}
    </label>
  );
}
