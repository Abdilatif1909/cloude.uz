import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';

function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await login(form);
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch {
      setError('Login muvaffaqiyatsiz. Ma’lumotlarni tekshiring.');
    }
  };

  return (
    <section className="container-shell py-10">
      <div className="mx-auto max-w-xl glass-panel rounded-[2rem] p-8 sm:p-10">
        <h1 className="text-3xl font-black text-[#0f172a]">Tizimga kirish</h1>
        <p className="mt-3 text-[#334155]">JWT asosidagi xavfsiz autentifikatsiya va protected route flow.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Username" className="input-shell" required />
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" className="input-shell" required />
          {error ? <div className="rounded-2xl bg-[#fff1f1] px-4 py-3 text-sm text-[#d64545]">{error}</div> : null}
          <button type="submit" className="brand-primary w-full rounded-2xl px-6 py-4 font-semibold">
            Login
          </button>
        </form>
        <p className="mt-5 text-sm text-[#64748b]">
          Akkount yo‘qmi? <Link to="/register" className="font-semibold text-[#2563eb]">Ro‘yxatdan o‘ting</Link>
        </p>
      </div>
    </section>
  );
}

export default LoginPage;
