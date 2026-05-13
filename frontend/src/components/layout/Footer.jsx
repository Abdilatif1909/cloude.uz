import { FiGithub, FiInstagram, FiMail } from 'react-icons/fi';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="border-t border-slate-200/70 py-10 dark:border-white/10">
      <div className="container-shell grid gap-8 lg:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <h3 className="text-xl font-semibold">WebDasturlashEdu</h3>
          <p className="mt-3 max-w-md text-sm text-slate-600 dark:text-slate-400">
            Zamonaviy web dasturlashni o‘rganish uchun ma’ruzalar, amaliy mashg‘ulotlar, testlar va analitik panel.
          </p>
        </div>
        <div>
          <p className="font-semibold">Tezkor havolalar</p>
          <div className="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Link to="/lectures">Ma’ruzalar</Link>
            <Link to="/practicals">Amaliyot</Link>
            <Link to="/tests">Testlar</Link>
            <Link to="/dashboard">Dashboard</Link>
          </div>
        </div>
        <div>
          <p className="font-semibold">Bog‘lanish</p>
          <div className="mt-3 flex items-center gap-3 text-xl text-slate-600 dark:text-slate-300">
            <FiMail />
            <FiGithub />
            <FiInstagram />
          </div>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">© 2026 WebDasturlashEdu. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
