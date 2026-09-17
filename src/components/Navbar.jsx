import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-black/95 backdrop-blur-md border-b border-white/10 py-3 shadow-[0_4px_25px_rgba(0,0,0,0.9)]'
          : 'bg-black/80 backdrop-blur-sm border-b border-white/10 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
        
        {/* Brand Logo & Name Container (with College Logo & Welfare Emblem) */}
        <Link to="/" className="flex items-center gap-2.5 sm:gap-3.5 group">
          {/* Official CMRCET College Logo */}
          <div className="h-10 sm:h-12 rounded-xl overflow-hidden bg-[#0b1933] border border-white/15 px-2 py-1 flex items-center shadow-md flex-shrink-0 transition-transform group-hover:scale-105">
            <img
              src="/images/college-logo.png"
              alt="CMR College of Engineering & Technology"
              className="h-full w-auto object-contain"
            />
          </div>

          {/* Student Council / Board of Social Welfare Emblem */}
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden bg-white/10 border-2 border-red-500/50 p-0.5 shadow-[0_0_15px_rgba(255,49,49,0.5)] flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105">
            <img
              src="/images/logo.png"
              alt="Board of Social Welfare CMRCET Logo"
              className="w-full h-full object-contain rounded-full"
            />
          </div>

          <div className="flex flex-col">
            <span className="text-sm sm:text-base md:text-lg lg:text-xl font-extrabold tracking-wider text-white uppercase font-heading group-hover:text-red-400 transition-colors leading-tight">
              SOCIAL WELFARE & NSS - VAJRA 2026
            </span>
            <span className="text-[10px] sm:text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              CMR College of Engineering & Technology (CMRCET)
            </span>
          </div>
        </Link>

        {/* Streamlined Right: Event Date Badge */}
        <div className="hidden md:flex items-center gap-2 text-xs font-bold text-neutral-300 bg-neutral-900/80 px-3.5 py-2 rounded-full border border-neutral-800">
          <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#FF3131]"></span>
          <span>4 Flagship Events • September 24, 2026</span>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
