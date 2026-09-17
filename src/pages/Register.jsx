import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { socialWelfareEvents, festivalMeta } from '../data/socialWelfareEvents';

const Register = () => {
  const location = useLocation();
  const [submitted, setSubmitted] = useState(false);
  const [registrationReceipt, setRegistrationReceipt] = useState(null);

  // Read event param from URL if present (e.g. ?event=dance-competition)
  const queryParams = new URLSearchParams(location.search);
  const preselectedEvent = queryParams.get('event');

  const [selectedEvents, setSelectedEvents] = useState(
    preselectedEvent ? [preselectedEvent] : ['essay-writing', 'quiz-competition']
  );

  const [danceType, setDanceType] = useState('Solo'); // 'Solo' or 'Group'
  const [teamSize, setTeamSize] = useState(1);

  const [formData, setFormData] = useState({
    fullName: '',
    rollNo: '',
    collegeName: 'CMR College of Engineering & Technology',
    branch: 'CSE',
    year: '3rd Year',
    email: '',
    phone: '',
    partnerName: '', // For Quiz or Dance
    partnerPhone: '',
    agreeRules: false
  });

  const toggleEvent = (eventId) => {
    if (selectedEvents.includes(eventId)) {
      if (selectedEvents.length === 1) return; // Keep at least one
      setSelectedEvents(selectedEvents.filter((id) => id !== eventId));
    } else {
      setSelectedEvents([...selectedEvents, eventId]);
    }
  };

  // Calculate registration fee
  const calculateTotalFee = () => {
    let total = 0;
    if (selectedEvents.includes('essay-writing')) total += 50;
    if (selectedEvents.includes('poster-making')) total += 80;
    if (selectedEvents.includes('quiz-competition')) total += 100;
    if (selectedEvents.includes('dance-competition')) {
      total += danceType === 'Solo' ? 150 : 300;
    }
    return total;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const passCode = 'NSS-' + Math.floor(100000 + Math.random() * 900000);
    const selectedEventNames = selectedEvents.map(
      (id) => socialWelfareEvents.find((ev) => ev.id === id)?.name || id
    );

    setRegistrationReceipt({
      code: passCode,
      ...formData,
      events: selectedEventNames,
      totalFee: calculateTotalFee(),
      danceType,
      date: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    });
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative z-10 pt-24 pb-16 px-4 sm:px-6 max-w-3xl mx-auto">
      
      {/* Title */}
      <div className="text-center mb-8">
        <span className="text-xs sm:text-sm font-bold tracking-widest text-red-500 uppercase">
          CMR College of Engineering & Technology
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-[#f44336] uppercase tracking-wider mt-1 mb-3 drop-shadow-[0_0_15px_rgba(244,67,54,0.4)]">
          EVENT REGISTRATION
        </h1>
        <p className="text-neutral-300 text-xs sm:text-sm max-w-lg mx-auto">
          Select one or multiple competitions: <strong>Essay Writing</strong>, <strong>Dance Competition</strong>, <strong>Poster Making</strong>, and <strong>Quiz Competition</strong>.
        </p>
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 hack-card p-6 sm:p-8 shadow-[0_0_25px_rgba(250,2,2,0.2)] space-y-6">
          
          {/* Step 1: Select Competitions */}
          <div>
            <label className="block text-xs font-bold text-red-400 uppercase tracking-wider mb-3">
              1. Choose Competitions to Enter (Select All That Apply) *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {socialWelfareEvents.map((evt) => {
                const isSelected = selectedEvents.includes(evt.id);
                return (
                  <div
                    key={evt.id}
                    onClick={() => toggleEvent(evt.id)}
                    className={`cursor-pointer p-3.5 rounded-xl border transition-all flex items-start justify-between ${
                      isSelected
                        ? 'border-red-500 bg-red-950/40 shadow-[0_0_12px_rgba(255,49,49,0.3)]'
                        : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`w-4 h-4 rounded flex items-center justify-center text-xs font-bold ${
                          isSelected ? 'bg-red-500 text-white' : 'border border-neutral-600'
                        }`}>
                          {isSelected ? '✓' : ''}
                        </span>
                        <h4 className="text-sm font-bold text-white">{evt.name}</h4>
                      </div>
                      <p className="text-xs text-neutral-400 mt-1">{evt.time}</p>
                    </div>
                    <span className="text-xs font-bold text-red-400">
                      {evt.registrationFee.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Dance Solo / Group option if Dance is selected */}
            {selectedEvents.includes('dance-competition') && (
              <div className="mt-3 p-3 rounded-lg bg-neutral-900/70 border border-neutral-800 flex items-center justify-between text-xs">
                <span className="text-neutral-300 font-semibold">Dance Participation Type:</span>
                <div className="flex gap-2">
                  {['Solo', 'Group'].map((type) => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setDanceType(type)}
                      className={`px-3 py-1 rounded-md font-bold transition-all ${
                        danceType === type
                          ? 'bg-red-600 text-white'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {type} ({type === 'Solo' ? '₹150' : '₹300'})
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Participant Details */}
          <div className="space-y-4 pt-2">
            <label className="block text-xs font-bold text-red-400 uppercase tracking-wider border-b border-neutral-800 pb-2">
              2. Participant Information
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your Full Name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white text-sm focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">
                  Roll No / Student ID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 23H51A05XX"
                  value={formData.rollNo}
                  onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white text-sm focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white text-sm focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">
                  WhatsApp / Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="10-digit mobile"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white text-sm focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">
                  College / Institution Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="College Name"
                  value={formData.collegeName}
                  onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white text-sm focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">
                  Year of Study *
                </label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white text-sm focus:border-red-500 focus:outline-none"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Postgraduate">Postgraduate</option>
                </select>
              </div>
            </div>

            {/* Team Partner Fields if Quiz or Group Dance selected */}
            {(selectedEvents.includes('quiz-competition') || (selectedEvents.includes('dance-competition') && danceType === 'Group')) && (
              <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wide">
                  Teammate / Partner Details (For Quiz / Group Dance)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Teammate Name"
                    value={formData.partnerName}
                    onChange={(e) => setFormData({ ...formData, partnerName: e.target.value })}
                    className="px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-white text-xs focus:border-red-500 focus:outline-none"
                  />
                  <input
                    type="tel"
                    placeholder="Teammate Phone"
                    value={formData.partnerPhone}
                    onChange={(e) => setFormData({ ...formData, partnerPhone: e.target.value })}
                    className="px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-white text-xs focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Fee Breakdown & Agreement */}
          <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-neutral-400 uppercase font-semibold">Total Entry Amount:</span>
              <div className="text-xl sm:text-2xl font-black text-red-400">
                ₹{calculateTotalFee()}
              </div>
            </div>
            <div className="text-right text-xs text-neutral-400">
              Payable at event registration desk or UPI on spot
            </div>
          </div>

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="rules"
              required
              checked={formData.agreeRules}
              onChange={(e) => setFormData({ ...formData, agreeRules: e.target.checked })}
              className="mt-1 rounded text-red-600 focus:ring-red-500 w-4 h-4 bg-neutral-900 border-neutral-700"
            />
            <label htmlFor="rules" className="text-xs text-neutral-300 leading-normal">
              I agree to abide by all the competition guidelines established by the Social Welfare & NSS Committee at CMRCET and confirm that I will carry my original college ID card.
            </label>
          </div>

          {/* Submit Button */}
          <div className="text-center pt-2">
            <button
              type="submit"
              className="hack-btn-red text-base sm:text-lg font-bold py-3 px-10 uppercase tracking-wider w-full sm:w-auto"
            >
              Generate Official Entry Pass
            </button>
          </div>

        </form>
      ) : (
        /* Printable Registration Pass */
        <div className="rounded-2xl border border-white/10 hack-card p-6 sm:p-10 shadow-[0_0_30px_rgba(250,2,2,0.3)] text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 mx-auto flex items-center justify-center text-emerald-400 text-3xl font-bold">
            ✓
          </div>

          <div>
            <span className="text-xs font-bold text-red-400 uppercase tracking-widest">
              CMR College of Engineering & Technology
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Social Welfare & NSS Entry Pass
            </h2>
          </div>

          {/* Pass Details Card */}
          <div className="max-w-md mx-auto p-6 rounded-2xl bg-neutral-900/90 border border-neutral-700 text-left space-y-3 font-mono">
            <div className="flex justify-between border-b border-neutral-800 pb-2">
              <span className="text-neutral-400 text-xs">PASS CODE:</span>
              <span className="text-red-400 font-bold text-base">{registrationReceipt.code}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400 text-xs">NAME:</span>
              <span className="text-white text-xs sm:text-sm font-semibold">{registrationReceipt.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400 text-xs">ROLL NO:</span>
              <span className="text-white text-xs sm:text-sm">{registrationReceipt.rollNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400 text-xs">COLLEGE:</span>
              <span className="text-white text-xs sm:text-sm line-clamp-1">{registrationReceipt.collegeName}</span>
            </div>
            <div className="flex justify-between border-t border-neutral-800 pt-2">
              <span className="text-neutral-400 text-xs">EVENTS:</span>
              <span className="text-red-400 text-xs sm:text-sm font-bold text-right">
                {registrationReceipt.events.join(', ')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400 text-xs">ENTRY FEE:</span>
              <span className="text-emerald-400 font-bold text-sm">₹{registrationReceipt.totalFee}</span>
            </div>
            <div className="flex justify-between text-[11px] text-neutral-400 pt-1">
              <span>DATE: 24th Sep 2026</span>
              <span>VENUE: CMRCET</span>
            </div>
          </div>

          <p className="text-xs text-neutral-400 max-w-md mx-auto">
            Please show this digital or printed pass along with your College ID card at the CMRCET campus registration desk on <strong>September 24, 2026</strong>.
          </p>

          <div className="flex justify-center gap-4 pt-2">
            <button
              onClick={() => window.print()}
              className="px-6 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-sm transition-all"
            >
              Print Entry Pass
            </button>
            <Link
              to="/"
              className="hack-btn-red text-sm font-bold py-2.5 px-6"
            >
              Back to Home
            </Link>
          </div>
        </div>
      )}

    </div>
  );
};

export default Register;
