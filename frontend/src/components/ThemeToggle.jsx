import { motion } from 'framer-motion';
import { FiSun } from 'react-icons/fi';

import { useTheme } from '../contexts/ThemeContext';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      type="button"
      onClick={toggleTheme}
      className="glass-button inline-flex h-11 w-11 items-center justify-center rounded-2xl text-lg"
      aria-label="Light theme"
      title="Light theme"
    >
      <FiSun />
    </motion.button>
  );
}

export default ThemeToggle;
