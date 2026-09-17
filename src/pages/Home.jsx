import React, { useState } from 'react';
import BannerSlider from '../components/BannerSlider';
import DomainCarousel from '../components/DomainCarousel';
import { socialWelfareEvents } from '../data/socialWelfareEvents';

const Home = () => {
  const [activeModalEvent, setActiveModalEvent] = useState(null);

  const scrollToEvents = (e) => {
    e?.preventDefault();
    const el = document.getElementById('events');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative z-10 pt-20 sm:pt-24 pb-12 flex flex-col items-center overflow-x-hidden">
      
      {/* 1. Hero Festival Banner Slider */}
      <div className="w-full my-3 sm:my-5">
        <BannerSlider />
      </div>

      {/* 2. Hero Centerpiece Headline & Description */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center mt-4 mb-12">
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-5">
          <div className="h-14 sm:h-16 rounded-2xl overflow-hidden border border-white/20 bg-[#0b1933] px-3 py-1.5 flex items-center shadow-[0_0_25px_rgba(0,0,0,0.8)] hover:scale-105 transition-transform">
            <img
              src="/images/college-logo.png"
              alt="CMR College of Engineering & Technology"
              className="h-full w-auto object-contain"
            />
          </div>

          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-1 bg-white/10 border-2 border-red-500/60 shadow-[0_0_25px_rgba(255,49,49,0.5)] flex items-center justify-center backdrop-blur-sm hover:scale-105 transition-transform">
            <img
              src="/images/logo.png"
              alt="Student Council Board of Social Welfare CMRCET"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
        </div>

        <div className="inline-block px-4 py-1.5 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 text-xs sm:text-sm font-bold uppercase tracking-widest mb-4">
          CMRCET Social Welfare & NSS Committee Presents
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#e53935] tracking-tight uppercase drop-shadow-[0_0_25px_rgba(229,57,53,0.45)] mb-3">
          VAJRA 2026
        </h1>
        <p className="text-sm sm:text-lg font-bold uppercase tracking-widest text-neutral-300 mb-6">
          Express • Empower • Elevate
        </p>

        <p className="text-base sm:text-lg text-neutral-200 font-medium leading-relaxed max-w-3xl mx-auto mb-8">
          Welcome to the flagship <strong>Social Welfare & NSS - VAJRA 2026</strong> at CMR College of Engineering & Technology. A premier inter-college stage designed to awaken civic conscience, creative excellence, and vibrant leadership across 4 marquee competitions: <strong>Essay Writing</strong>, <strong>Dance Competition</strong>, <strong>Poster Making</strong>, and <strong>Quiz Competition</strong>.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="#events"
            onClick={scrollToEvents}
            className="hack-btn-red text-base sm:text-lg uppercase tracking-wider py-3.5 px-8 font-bold cursor-pointer"
          >
            EXPLORE ALL 4 COMPETITIONS &darr;
          </a>
        </div>
      </section>

      {/* 3. 4 Featured Event Cards Showcase */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {socialWelfareEvents.map((evt) => (
            <div
              key={evt.id}
              onClick={() => setActiveModalEvent(evt)}
              className="rounded-2xl border border-white/10 hack-card overflow-hidden flex flex-col justify-between hover:border-red-500/60 transition-all hover:scale-[1.02] shadow-[0_0_15px_rgba(0,0,0,0.5)] group cursor-pointer"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-black">
                <img
                  src={evt.image}
                  alt={evt.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <span className="absolute top-2.5 left-2.5 bg-black/80 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-red-400 border border-red-500/50">
                  {evt.tag}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-wide group-hover:text-red-400 transition-colors">
                    {evt.name}
                  </h3>
                  <p className="text-xs text-neutral-300 mt-1 font-medium line-clamp-2">
                    {evt.subtitle}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between text-xs gap-2">
                  <div>
                    <span className="text-emerald-400 font-bold block">Cost: {evt.registrationFee}</span>
                    <span className="text-red-400 text-[10px] font-medium">{evt.prizePool.split(' ')[0]} Prize</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white group-hover:text-red-400 font-semibold underline text-[11px]">
                      Rules
                    </span>
                    <a
                      href={evt.registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="hack-btn-red text-[11px] font-bold py-1.5 px-3 uppercase rounded shadow-[0_0_10px_#FF3131]"
                    >
                      Register &rarr;
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. 3D Event Coverflow Carousel */}
      <DomainCarousel onOpenRules={(evt) => setActiveModalEvent(evt)} />

      {/* 5. Interactive Event Details Modal */}
      {activeModalEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setActiveModalEvent(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-neutral-950 border border-red-500/50 rounded-3xl shadow-[0_0_50px_rgba(255,49,49,0.4)] p-6 sm:p-8 text-neutral-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveModalEvent(null)}
              aria-label="Close modal"
              className="absolute top-4 right-4 text-neutral-400 hover:text-white bg-neutral-900 hover:bg-red-600 rounded-full w-9 h-9 flex items-center justify-center transition-all border border-neutral-700"
            >
              &times;
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-4 mb-4">
              <img
                src={activeModalEvent.image}
                alt={activeModalEvent.name}
                className="w-20 h-20 rounded-2xl object-cover border border-red-500/40 shadow-lg"
              />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-red-400 bg-red-950/60 px-2.5 py-0.5 rounded-full border border-red-800">
                  {activeModalEvent.tag}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase text-white mt-1">
                  {activeModalEvent.name}
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400 font-medium">
                  {activeModalEvent.subtitle}
                </p>
              </div>
            </div>

            {/* Event Key Details Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 my-5 text-xs text-center">
              <div className="bg-neutral-900/90 p-2.5 rounded-xl border border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                <span className="text-neutral-400 block text-[10px] uppercase">Entry Cost</span>
                <span className="text-emerald-400 font-black text-sm">{activeModalEvent.registrationFee}</span>
              </div>
              <div className="bg-neutral-900/90 p-2.5 rounded-xl border border-neutral-800">
                <span className="text-neutral-400 block text-[10px] uppercase">Cash Prize</span>
                <span className="text-red-400 font-bold">{activeModalEvent.prizePool}</span>
              </div>
              <div className="bg-neutral-900/90 p-2.5 rounded-xl border border-neutral-800">
                <span className="text-neutral-400 block text-[10px] uppercase">Team Size</span>
                <span className="text-white font-bold">{activeModalEvent.teamSize}</span>
              </div>
              <div className="bg-neutral-900/90 p-2.5 rounded-xl border border-neutral-800">
                <span className="text-neutral-400 block text-[10px] uppercase">Timing</span>
                <span className="text-white font-bold">{activeModalEvent.timing}</span>
              </div>
              <div className="bg-neutral-900/90 p-2.5 rounded-xl border border-neutral-800">
                <span className="text-neutral-400 block text-[10px] uppercase">Venue</span>
                <span className="text-white font-bold">{activeModalEvent.venue}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-5">
              {activeModalEvent.description}
            </p>

            {/* Themes or Topics */}
            {activeModalEvent.topics && (
              <div className="mb-5 bg-neutral-900/60 p-4 rounded-2xl border border-neutral-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 mb-2">
                  Official Topics / Themes
                </h4>
                <ul className="list-disc list-inside text-xs text-neutral-300 space-y-1.5">
                  {activeModalEvent.topics.map((topic, i) => (
                    <li key={i}>{topic}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Rules & Guidelines */}
            <div className="mb-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 mb-2">
                Rules & Guidelines
              </h4>
              <ul className="list-disc list-inside text-xs text-neutral-300 space-y-1.5">
                {activeModalEvent.rules.map((rule, idx) => (
                  <li key={idx}>{rule}</li>
                ))}
              </ul>
            </div>

            {/* Judging Criteria */}
            <div className="mb-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 mb-2">
                Judging Criteria
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeModalEvent.criteria.map((crit, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-neutral-900 px-3 py-1 rounded-lg border border-neutral-800 text-neutral-300"
                  >
                    {crit}
                  </span>
                ))}
              </div>
            </div>

            {/* Event Coordinators */}
            <div className="pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-neutral-400 block">
                  Questions? Call Student Coordinators:
                </span>
                <div className="flex flex-wrap gap-3 mt-1 text-xs font-semibold text-neutral-200">
                  <a href="tel:6309145746" className="text-red-400 hover:underline">
                    CH. Arjun (6309145746)
                  </a>
                  <span>•</span>
                  <a href="tel:9110544685" className="text-red-400 hover:underline">
                    B.H.Kharthikeya (9110544685)
                  </a>
                  <span>•</span>
                  <a href="tel:9704239127" className="text-red-400 hover:underline">
                    Heamanth (9704239127)
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setActiveModalEvent(null)}
                  className="px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs font-bold uppercase transition-all"
                >
                  Close
                </button>
                <a
                  href={activeModalEvent.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hack-btn-red text-xs sm:text-sm font-bold uppercase py-2 px-5 rounded-lg shadow-[0_0_20px_#FF3131]"
                >
                  Register on Google Form ({activeModalEvent.registrationFee}) &rarr;
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Home;
