import { useState } from 'react';
import { FiMail, FiMapPin, FiPhone } from 'react-icons/fi';

import SectionHeading from '../components/shared/SectionHeading';

const initialState = { fullName: '', email: '', subject: '', message: '' };

function ContactPage() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setStatus('Xabaringiz qabul qilindi. Tez orada siz bilan bog‘lanamiz.');
    setForm(initialState);
  };

  return (
    <section className="container-shell py-10">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <div className="glass-panel rounded-[2rem] p-8 sm:p-10">
            <SectionHeading eyebrow="Contact" title="Savol, taklif yoki hamkorlik bo‘yicha bog‘laning" description="Platforma bo‘yicha fikr va takliflaringizni yuboring." />
          </div>
          <div className="glass-panel rounded-[2rem] p-8">
            <div className="space-y-4 text-sm text-[#334155]">
              <p className="flex items-center gap-3"><FiMail className="text-[#2563eb]" /> support@webdasturlashedu.uz</p>
              <p className="flex items-center gap-3"><FiPhone className="text-[#2563eb]" /> +998 90 123 45 67</p>
              <p className="flex items-center gap-3"><FiMapPin className="text-[#2563eb]" /> Tashkent, Uzbekistan</p>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="glass-panel rounded-[2rem] p-8 sm:p-10">
          <div className="grid gap-4 md:grid-cols-2">
            <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Full name" className="input-shell" required />
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="input-shell" required />
          </div>
          <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Subject" className="input-shell mt-4" required />
          <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows="6" placeholder="Message" className="input-shell mt-4" required />
          {status ? <div className="mt-4 rounded-2xl bg-[#ecfdf5] px-4 py-3 text-sm text-[#15803d]">{status}</div> : null}
          <button type="submit" className="brand-primary mt-4 rounded-2xl px-6 py-4 font-semibold">
            Yuborish
          </button>
        </form>
      </div>
    </section>
  );
}

export default ContactPage;
