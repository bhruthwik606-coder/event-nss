import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ParticlesBg from './components/ParticlesBg';
import Home from './pages/Home';

// Scroll to top or handle anchor hash navigation on route change
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [pathname, hash]);

  return null;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      {/* Interactive Particle Constellation Canvas */}
      <ParticlesBg />

      {/* Ambient Cyber Aurora Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-red-600/15 rounded-full blur-[130px] animate-pulse-glow" />
        <div className="absolute top-1/2 -right-32 w-[30rem] h-[30rem] bg-indigo-900/20 rounded-full blur-[150px] animate-float-slow" />
        <div className="absolute -bottom-32 left-1/3 w-[26rem] h-[26rem] bg-red-700/15 rounded-full blur-[140px] animate-pulse-glow" />
      </div>

      {/* Main Streamlined Dashboard */}
      <div className="relative min-h-screen flex flex-col bg-transparent text-white selection:bg-red-600 selection:text-white font-sans">
        <Navbar />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Fallback & Catch-all route to the streamlined dashboard */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
