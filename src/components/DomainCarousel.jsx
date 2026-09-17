import React, { useState } from 'react';
import { socialWelfareEvents } from '../data/socialWelfareEvents';

const DomainCarousel = ({ onOpenRules }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const total = socialWelfareEvents.length;

  const nextDomain = () => {
    setSelectedIndex((prev) => (prev + 1) % total);
  };

  const prevDomain = () => {
    setSelectedIndex((prev) => (prev - 1 + total) % total);
  };

  // Dynamic 3D Coverflow positioning for the 4 events
  const getCardStyle = (index) => {
    let diff = index - selectedIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    if (diff === 0) {
      // Selected Center Card
      return {
        left: '50%',
        transform: 'translateX(-50%) scale(1.05)',
        zIndex: 25,
        opacity: 1,
        filter: 'brightness(1.05)'
      };
    } else if (diff === -1) {
      return {
        left: '26%',
        transform: 'translateX(-50%) scale(0.85)',
        zIndex: 15,
        opacity: 0.85,
        filter: 'brightness(0.8)'
      };
    } else if (diff === 1) {
      return {
        left: '74%',
        transform: 'translateX(-50%) scale(0.85)',
        zIndex: 15,
        opacity: 0.85,
        filter: 'brightness(0.8)'
      };
    } else {
      return {
        left: diff < 0 ? '10%' : '90%',
        transform: 'translateX(-50%) scale(0.65)',
        zIndex: 8,
        opacity: 0.5,
        filter: 'brightness(0.6)'
      };
    }
  };

  const activeEvent = socialWelfareEvents[selectedIndex];

  return (
    <section id="events" className="w-full py-12 select-none">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Section Heading */}
        <div className="text-center mb-6">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-red-500 uppercase">
            Flagship Competitions
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#bdbdbd] uppercase tracking-wider mt-1">
            Featured Events
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2 max-w-lg mx-auto">
            Click on any event card to explore topics, rules, cash prizes, and details.
          </p>
        </div>

        {/* Desktop 3D Coverflow Viewport */}
        <div className="relative hidden md:flex items-center justify-between w-full h-[450px] overflow-hidden my-4">
          
          {/* Previous Arrow Button */}
          <button
            onClick={prevDomain}
            aria-label="Previous Event"
            className="z-30 p-3 text-white bg-black/70 hover:bg-red-600/90 rounded-full transition-all hover:scale-110 focus:outline-none border border-neutral-700 ml-4 shadow-[0_0_15px_rgba(0,0,0,0.8)]"
          >
            <img src="/src/icons8-back-arrow-50.png" alt="Prev" className="w-7 h-7" />
          </button>

          {/* Cards Carousel Track */}
          <div className="relative flex-1 h-full mx-4">
            {socialWelfareEvents.map((event, index) => {
              const style = getCardStyle(index);
              const isCenter = index === selectedIndex;

              return (
                <div
                  key={event.id}
                  onClick={() => {
                    setSelectedIndex(index);
                    if (isCenter && onOpenRules) onOpenRules(event);
                  }}
                  style={style}
                  className={`absolute top-1/2 -translate-y-1/2 transition-all duration-500 ease-out cursor-pointer ${
                    isCenter ? 'drop-shadow-[0_20px_40px_rgba(255,49,49,0.45)]' : ''
                  }`}
                >
                  <div className="w-[300px] lg:w-[330px] rounded-3xl overflow-hidden border-2 border-red-500/40 bg-neutral-900 shadow-2xl flex flex-col group">
                    <div className="relative aspect-square w-full overflow-hidden bg-black">
                      <img
                        src={event.image}
                        alt={event.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 bg-black/70 backdrop-blur px-3 py-1 rounded-full border border-red-500/50 text-[11px] font-bold text-white uppercase">
                        {event.tag}
                      </div>
                    </div>

                    <div className="p-4 text-center bg-neutral-950 flex flex-col justify-between">
                      <h3 className="text-xl font-bold text-white uppercase tracking-wide group-hover:text-red-400 transition-colors">
                        {event.name}
                      </h3>
                      <p className="text-xs text-neutral-400 line-clamp-1 mt-1 font-medium">
                        {event.subtitle}
                      </p>
                      <div className="mt-3 flex items-center justify-between text-xs text-neutral-300 pt-2 border-t border-neutral-800">
                        <span className="text-emerald-400 font-bold">Cost: {event.registrationFee}</span>
                        <span className="text-red-400 font-bold">{event.prizePool.split(' ')[0]}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Next Arrow Button */}
          <button
            onClick={nextDomain}
            aria-label="Next Event"
            className="z-30 p-3 text-white bg-black/70 hover:bg-red-600/90 rounded-full transition-all hover:scale-110 focus:outline-none border border-neutral-700 mr-4 shadow-[0_0_15px_rgba(0,0,0,0.8)]"
          >
            <img src="/src/icons8-forward-button-50.png" alt="Next" className="w-7 h-7" />
          </button>
        </div>

        {/* Mobile Horizontal Card List */}
        <div className="md:hidden flex overflow-x-auto gap-4 py-4 px-2 no-scrollbar snap-x snap-mandatory">
          {socialWelfareEvents.map((event, index) => (
            <div
              key={event.id}
              onClick={() => {
                setSelectedIndex(index);
                if (onOpenRules) onOpenRules(event);
              }}
              className="snap-center flex-shrink-0 w-[270px] cursor-pointer"
            >
              <div
                className={`rounded-2xl overflow-hidden bg-neutral-900 border transition-all ${
                  index === selectedIndex
                    ? 'border-red-500 shadow-[0_0_20px_#FF3131] scale-100'
                    : 'border-neutral-800 opacity-80 scale-95'
                }`}
              >
                <div className="aspect-square w-full bg-black overflow-hidden">
                  <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 text-center">
                  <h4 className="font-bold text-white text-lg">{event.name}</h4>
                  <p className="text-xs text-emerald-400 font-bold mt-1">Cost: {event.registrationFee} • {event.prizePool.split(' ')[0]}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Event Action Badges */}
        <div className="text-center mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={() => onOpenRules && onOpenRules(activeEvent)}
            className="inline-flex items-center gap-2 text-sm sm:text-base font-bold tracking-wide text-white hover:text-red-400 transition-all py-3 px-6 rounded-xl bg-neutral-950/90 border border-neutral-700 shadow-md hover:border-red-500"
          >
            <span>{activeEvent.name} — Full Guidelines</span>
            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>

          <a
            href={activeEvent.registrationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hack-btn-red text-sm sm:text-base font-bold py-3 px-8 uppercase shadow-[0_0_25px_#FF3131] hover:scale-105 transition-all"
          >
            Register for {activeEvent.name} ({activeEvent.registrationFee}) &rarr;
          </a>
        </div>

      </div>
    </section>
  );
};

export default DomainCarousel;
