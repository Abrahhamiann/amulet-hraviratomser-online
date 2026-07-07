import React from 'react';
import { Link } from 'react-router-dom';

export default function Button({ children, to, variant = 'primary', className = '', ...props }) {
  const classes = `btn btn-${variant} ${className}`;
  if (to?.startsWith('http')) return <a className={classes} href={to} target="_blank" rel="noreferrer">{children}</a>;
  if (to) return <Link className={classes} to={to}>{children}</Link>;
  return <button className={classes} {...props}>{children}</button>;
}
