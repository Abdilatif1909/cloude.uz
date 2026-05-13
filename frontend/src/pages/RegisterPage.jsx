import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';

const initialState = {
  username: '',
  email: '',
  full_name: '',
  role: 'student',
  password: '',
  password_confirm: '',
};

function RegisterPage() {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await register(form);
      navigate('/dashboard');
    } catch {
      setError('Ro‘yxatdan o‘tishda xatolik yuz berdi.');
    }
  };

  return (
    <section className="container-shell py-10">
      <div className="mx-auto max-w-2xl glass-panel rounded-[2rem] p-8 sm:p-10">
        <h1 className="text-3xl font-black text-[#0f172a]">Ro‘yxatdan o‘tish</h1>
        <p className="mt-3 text-[#334155]">Student yoki Teacher sifatida profil yarating. Admin akkauntlar boshqaruv orqali yaratiladi.</p>
        <form onSubmit={handleSubmit} className="mt-8 grid gap-4 md:grid-cols-2">
          <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Full name" className="input-shell md:col-span-2" required />
          <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Username" className="input-shell" required />
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="input-shell" required />
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="input-shell">
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
          <div className="rounded-2xl border border-dashed border-[#dbe7f3] bg-[#f8fbff] px-4 py-3 text-sm text-[#64748b]">
            Role-based authentication backend orqali boshqariladi.
          </div>
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" className="input-shell" required />
          <input type="password" value={form.password_confirm} onChange={(e) => setForm({ ...form, password_confirm: e.target.value })} placeholder="Password tasdiqlash" className="input-shell" required />
          {error ? <div className="md:col-span-2 rounded-2xl bg-[#fff1f1] px-4 py-3 text-sm text-[#d64545]">{error}</div> : null}
          <button type="submit" className="brand-primary md:col-span-2 rounded-2xl px-6 py-4 font-semibold">
            Profil yaratish
          </button>
        </form>
        <p className="mt-5 text-sm text-[#64748b]">
          Akkount bormi? <Link to="/login" className="font-semibold text-[#2563eb]">Login qiling</Link>
        </p>
      </div>
    </section>
  );
}

export default RegisterPage;
