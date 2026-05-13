import { Outlet } from 'react-router-dom';

import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

function MainLayout() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="ambient-bg" />
      <Navbar />
      <main className="relative z-10 pb-16 pt-28 sm:pt-32">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
