import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { FiLogOut, FiMenu, FiSearch, FiUser, FiX } from 'react-icons/fi';
import { Link, NavLink, useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const navItems = [
  { to: '/', label: 'Bosh sahifa' },
  { to: '/lectures', label: 'Ma’ruzalar' },
  { to: '/practicals', label: 'Amaliyot' },
  { to: '/tests', label: 'Testlar' },
  { to: '/books', label: 'Kitoblar' },
  { to: '/about', label: 'Biz haqimizda' },
  { to: '/contact', label: 'Bog‘lanish' },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault();
    navigate(`/search?q=${encodeURIComponent(searchText)}`);
    setOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="container-shell pt-4">
        <div className="glass flex items-center justify-between rounded-3xl px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 font-bold text-white">
              WE
            </div>
            <div>
              <p className="font-semibold">WebDasturlashEdu</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Education Platform</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-2xl px-4 py-2 text-sm transition ${
                    isActive ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'text-slate-600 hover:bg-white/60 dark:text-slate-300 dark:hover:bg-white/10'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <form onSubmit={handleSearch} className="glass flex items-center gap-2 rounded-2xl px-3 py-2">
              <FiSearch className="text-slate-500" />
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Qidirish..."
                className="w-48 bg-transparent text-sm outline-none"
              />
            </form>
            <ThemeToggle />
            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/dashboard" className="glass rounded-2xl px-4 py-2 text-sm font-medium">
                  Dashboard
                </Link>
                <button type="button" onClick={logout} className="glass rounded-2xl p-3 text-slate-700 dark:text-slate-100">
                  <FiLogOut />
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="rounded-2xl px-4 py-2 text-sm font-medium text-slate-700 dark:text-white">
                  Login
                </Link>
                <Link to="/register" className="rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white">
                  Ro‘yxatdan o‘tish
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button type="button" onClick={() => setOpen((prev) => !prev)} className="glass rounded-2xl p-3 text-lg">
              {open ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="container-shell mt-3 lg:hidden"
          >
            <div className="glass space-y-4 rounded-3xl p-4">
              <form onSubmit={handleSearch} className="glass flex items-center gap-2 rounded-2xl px-3 py-2">
                <FiSearch className="text-slate-500" />
                <input
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Qidirish..."
                  className="w-full bg-transparent text-sm outline-none"
                />
              </form>
              <div className="grid gap-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="rounded-2xl px-4 py-3 text-sm text-slate-700 transition hover:bg-white/60 dark:text-slate-200 dark:hover:bg-white/10"
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
              {user ? (
                <div className="grid gap-2">
                  <Link to="/dashboard" onClick={() => setOpen(false)} className="glass rounded-2xl px-4 py-3 text-sm font-semibold">
                    <span className="inline-flex items-center gap-2"><FiUser /> Dashboard</span>
                  </Link>
                  <button type="button" onClick={logout} className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white dark:bg-white dark:text-slate-900">
                    Chiqish
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/login" onClick={() => setOpen(false)} className="glass rounded-2xl px-4 py-3 text-center text-sm font-semibold">
                    Login
                  </Link>
                  <Link to="/register" onClick={() => setOpen(false)} className="rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 px-4 py-3 text-center text-sm font-semibold text-white">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
