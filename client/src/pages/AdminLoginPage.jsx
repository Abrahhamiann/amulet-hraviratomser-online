import React from 'react';
import { Navigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useState } from 'react';

export default function AdminLoginPage() {
  const { login, isAdmin } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAdmin) return <Navigate to="/admin" replace />;

  const submit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);
    setError('');
    try {
      await login(form.get('email'), form.get('password'));
    } catch {
      setError('Invalid login details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <form className="panel-form login-panel" onSubmit={submit}>
        <h1>Admin Login</h1>
        <Input label="Email" name="email" type="email" defaultValue="admin@einvite.local" />
        <Input label="Password" name="password" type="password" defaultValue="Admin123!" />
        <Button disabled={loading}>{loading ? 'Loading...' : 'Login'}</Button>
        {error && <p className="form-error">{error}</p>}
      </form>
    </main>
  );
}
