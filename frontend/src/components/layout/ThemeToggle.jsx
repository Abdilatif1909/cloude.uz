import { FiMoon, FiSun } from 'react-icons/fi';

import { useTheme } from '../../context/ThemeContext';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="glass inline-flex h-11 w-11 items-center justify-center rounded-2xl text-lg text-slate-700 transition hover:-translate-y-0.5 dark:text-slate-100"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <FiSun /> : <FiMoon />}
    </button>
  );
}

export default ThemeToggle;
