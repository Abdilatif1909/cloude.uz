export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#7c3aed',
        secondary: '#06b6d4',
        accent: '#f59e0b',
      },
      boxShadow: {
        glass: '0 10px 35px rgba(15, 23, 42, 0.25)',
      },
      backgroundImage: {
        glow: 'radial-gradient(circle at top, rgba(124,58,237,0.35), transparent 45%), radial-gradient(circle at right, rgba(6,182,212,0.25), transparent 35%)',
      },
    },
  },
  plugins: [],
};
