import { Link } from 'react-router-dom';

function CtaSection() {
  return (
    <section className="container-shell py-20">
      <div className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500 p-8 text-white shadow-2xl shadow-violet-500/20 sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/80">Call to action</p>
        <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">Bugun platformaga qo‘shiling va web dasturlashni tizimli o‘rganing.</h2>
            <p className="mt-4 max-w-2xl text-white/80">
              Test natijalari, PDF kutubxonasi, teacher analytics va admin boshqaruvi bitta joyda.
            </p>
          </div>
          <Link to="/register" className="rounded-2xl bg-white px-6 py-4 text-center font-semibold text-slate-900">
            Bepul ro‘yxatdan o‘tish
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CtaSection;
