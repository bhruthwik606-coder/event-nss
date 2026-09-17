import React, { useState, useEffect, useRef } from 'react';

const slides = [
  {
    id: 1,
    src: '/images/banners/fest-banner-1.jpg',
    title: 'Social Welfare & NSS - VAJRA 2026',
    subtitle: 'CMR College of Engineering & Technology (CMRCET)',
    tag: 'VAJRA 2026',
    eventId: 'essay-writing',
    btnText: 'Explore All Events'
  },
  {
    id: 2,
    src: '/images/events/essay-writing.jpg',
    title: 'Essay Writing Competition',
    subtitle: 'The Power of Words & Social Change • Cash Prize: ₹3,000/-',
    tag: 'Literary Event',
    eventId: 'essay-writing',
    btnText: 'View Essay Guidelines',
    formUrl: 'https://forms.gle/XbMmPnX6L5JyxsME7',
    fee: '₹49/-'
  },
  {
    id: 3,
    src: '/images/events/dance-competition.jpg',
    title: 'Dance Competition',
    subtitle: 'Rhythm of Unity, Culture & Expression • Cash Prize: ₹7,500/-',
    tag: 'Performing Arts',
    eventId: 'dance-competition',
    btnText: 'View Dance Rules',
    formUrl: 'https://forms.gle/s778FXU8BgRdmwyE9',
    fee: '₹499/-'
  },
  {
    id: 4,
    src: '/images/events/poster-making.jpg',
    title: 'Poster Making Competition',
    subtitle: 'Canvas for a Cause — Chitrakala • Cash Prize: ₹3,500/-',
    tag: 'Fine Arts',
    eventId: 'poster-making',
    btnText: 'View Poster Themes',
    formUrl: 'https://forms.gle/vmG239Nyq6DqhuhZ7',
    fee: '₹99/-'
  },
  {
    id: 5,
    src: '/images/events/quiz-competition.jpg',
    title: 'Quiz Competition',
    subtitle: 'National Brainwave Challenge • Cash Prize: ₹5,000/-',
    tag: 'Knowledge Showdown',
    eventId: 'quiz-competition',
    btnText: 'View Quiz Details',
    formUrl: 'https://forms.gle/eEQcRik3QtLsZqge7',
    fee: '₹99/-'
  }
];

const BannerSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const total = slides.length;
  const timeoutRef = useRef(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    if (!isPaused) {
      timeoutRef.current = setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % total);
      }, 3800);
    }
    return () => resetTimeout();
  }, [currentSlide, isPaused, total]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + total) % total);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div
      className="relative mx-auto w-full max-w-5xl px-4 py-2 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Outer Banner Frame with Red Neon Glow */}
      <div className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-black shadow-[0_0_35px_rgba(255,49,49,0.4)] group">
        
        {/* Slides Track */}
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="w-full flex-shrink-0 relative overflow-hidden bg-neutral-950 flex items-center justify-center min-h-[260px] sm:min-h-[380px] md:min-h-[460px]"
            >
              {/* Blurred Ambient Backdrop for non-16:9 images */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-30 blur-2xl scale-110"
                style={{ backgroundImage: `url('${slide.src}')` }}
              />

              {/* Main Crisp Image */}
              <img
                src={slide.src}
                alt={slide.title}
                className="relative z-10 w-full h-auto max-h-[460px] object-contain object-center drop-shadow-2xl"
              />

              {/* Gradient Bottom Overlay for Text Legibility */}
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/80 to-transparent z-20 pointer-events-none" />

              {/* Slide Caption and Call to Action */}
              <div className="absolute bottom-5 left-5 right-5 sm:bottom-7 sm:left-8 sm:right-8 z-30 flex flex-col sm:flex-row sm:items-end justify-between gap-3 pointer-events-auto">
                <div className="max-w-xl">
                  <span className="inline-block bg-red-600/90 text-white text-[11px] sm:text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-[0_0_10px_#FF3131] mb-1.5">
                    {slide.tag}
                  </span>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white uppercase tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                    {slide.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-300 font-medium line-clamp-1 drop-shadow">
                    {slide.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  {slide.formUrl ? (
                    <>
                      <a
                        href={slide.formUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hack-btn-red text-xs sm:text-sm font-bold py-2 sm:py-2.5 px-4 sm:px-6 uppercase tracking-wider whitespace-nowrap shadow-[0_0_15px_#FF3131]"
                      >
                        Register Now ({slide.fee}) &rarr;
                      </a>
                      <a
                        href="#events"
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="hidden sm:inline-flex px-3.5 py-2 sm:py-2.5 rounded-lg bg-black/80 hover:bg-neutral-800 border border-neutral-700 text-white font-bold text-xs uppercase transition-all"
                      >
                        Rules &darr;
                      </a>
                    </>
                  ) : (
                    <a
                      href="#events"
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="hack-btn-red text-xs sm:text-sm font-bold py-2 sm:py-2.5 px-4 sm:px-6 uppercase tracking-wider whitespace-nowrap shadow-[0_0_15px_#FF3131]"
                    >
                      {slide.btnText} &darr;
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Previous Navigation Arrow */}
        <button
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-40 bg-black/70 hover:bg-red-600 text-white p-2.5 sm:p-3 rounded-full backdrop-blur transition-all duration-200 opacity-75 hover:opacity-100 hover:scale-110 shadow-lg border border-white/10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Next Navigation Arrow */}
        <button
          onClick={nextSlide}
          aria-label="Next Slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-40 bg-black/70 hover:bg-red-600 text-white p-2.5 sm:p-3 rounded-full backdrop-blur transition-all duration-200 opacity-75 hover:opacity-100 hover:scale-110 shadow-lg border border-white/10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Slide Indicator Dots / Bullets */}
        <div className="absolute top-4 right-4 z-40 flex gap-1.5 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-neutral-800">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? 'w-6 bg-[#FF3131] shadow-[0_0_10px_#FF3131]'
                  : 'w-2 bg-neutral-600 hover:bg-neutral-400'
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default BannerSlider;
