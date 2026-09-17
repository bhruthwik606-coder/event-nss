import React, { useState, useEffect } from 'react';

const Footer = () => {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      setShowTopBtn(window.scrollY > 300);
    };
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="footer" className="relative z-10 w-full mt-16 border-t border-white/10 bg-neutral-950/80 backdrop-blur-md text-white py-12 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        
        {/* Left: Contact Card */}
        <div className="rounded-2xl border border-white/10 bg-black/50 p-6 sm:p-8 backdrop-blur shadow-[0_0_20px_rgba(255,49,49,0.15)] flex flex-col gap-5">
          <h3 className="text-2xl font-bold tracking-wider text-center text-red-500 uppercase">
            EVENT COORDINATORS
          </h3>

          <p className="text-xs sm:text-sm text-neutral-400 text-center -mt-2">
            For registrations, queries, and event assistance, please contact:
          </p>

          <hr className="border-neutral-800 my-1" />

          {/* Coordinators List */}
          <div className="space-y-3.5">
            {[
              { name: 'CH. Arjun', phone: '6309145746' },
              { name: 'B.H.Kharthikeya', phone: '9110544685' },
              { name: 'Heamanth', phone: '9704239127' }
            ].map((coordinator) => (
              <div
                key={coordinator.name}
                className="flex items-center justify-between text-sm sm:text-base bg-neutral-900/60 p-3 rounded-xl border border-neutral-800 hover:border-red-500/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-600/20 border border-red-500/50 flex items-center justify-center text-red-400 font-bold text-xs">
                    {coordinator.name.charAt(0)}
                  </div>
                  <span className="text-neutral-200 font-semibold">{coordinator.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <img src="/src/footerlogos/phone.png" alt="Phone" className="w-4 h-4 opacity-75" />
                  <a
                    href={`tel:+91${coordinator.phone}`}
                    className="text-red-400 hover:text-red-300 hover:underline font-mono font-bold"
                  >
                    {coordinator.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2.5 pt-2">
            <img
              src="/images/logo.png"
              alt="Board of Social Welfare"
              className="w-6 h-6 rounded-full object-contain"
            />
            <span className="text-xs text-neutral-400">
              Social Welfare & NSS Committee • CMRCET
            </span>
          </div>
        </div>

        {/* Right: Location & Embedded Google Map */}
        <div className="rounded-2xl border border-white/10 bg-black/50 p-6 sm:p-8 backdrop-blur shadow-[0_0_20px_rgba(255,49,49,0.15)] flex flex-col items-center gap-6">
          <div className="w-full overflow-hidden rounded-2xl border border-neutral-800 shadow-lg">
            <iframe
              title="CMR College of Engineering & Technology Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3802.9592002759996!2d78.48394557389247!3d17.60467219651173!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb850bb545e95b%3A0x4367e509f5ff38e5!2sCMR%20College%20of%20Engineering%20%26%20Technology%2C%20Hyderabad%20(CMRCET%2FCMRK)!5e0!3m2!1sen!2sin!4v1704028620055!5m2!1sen!2sin"
              width="100%"
              height="280"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full rounded-xl"
            />
          </div>

          <div className="text-center space-y-2 flex flex-col items-center">
            <div className="rounded-xl overflow-hidden border border-white/15 bg-[#0b1933] px-3 py-1.5 shadow-md">
              <img
                src="/images/college-logo.png"
                alt="CMR College of Engineering & Technology"
                className="h-10 w-auto object-contain"
              />
            </div>
            <span className="text-lg sm:text-xl font-bold tracking-wide text-red-500 uppercase block">
              CMR COLLEGE OF ENGINEERING & TECHNOLOGY
            </span>
            <p className="text-sm sm:text-base text-neutral-300 font-medium">
              KANDLAKOYA, MEDCHAL ROAD,
            </p>
            <p className="text-sm sm:text-base text-neutral-400 font-medium">
              HYDERABAD - 501401, TELANGANA
            </p>
          </div>
        </div>

      </div>

      {/* Floating Back To Top Button */}
      {showTopBtn && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed right-6 bottom-6 z-50 w-11 h-11 rounded-xl bg-black/80 text-white border-2 border-red-500 shadow-[0_0_15px_#FF3131] flex items-center justify-center font-bold text-xl hover:bg-red-600 hover:scale-110 transition-all duration-200"
        >
          ↑
        </button>
      )}
    </footer>
  );
};

export default Footer;
