import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Trophy, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle,
  X,
  Phone,
  Sparkles,
  Award,
  Zap,
  BookOpen,
  Music,
  Lightbulb,
  Palette,
  MessageSquare
} from 'lucide-react';
import { useRegistration } from '../context/RegistrationContext';

const getEventIcon = (name) => {
  switch (name.toLowerCase()) {
    case 'quiz':
      return <BookOpen className="w-6 h-6 text-blue-700" />;
    case 'dance':
      return <Music className="w-6 h-6 text-purple-700" />;
    case 'accelerator':
      return <Lightbulb className="w-6 h-6 text-amber-600" />;
    case 'poster making':
      return <Palette className="w-6 h-6 text-rose-600" />;
    case 'meeting':
      return <MessageSquare className="w-6 h-6 text-emerald-600" />;
    default:
      return <Sparkles className="w-6 h-6 text-blue-700" />;
  }
};

const getEventGradient = (name) => {
  switch (name.toLowerCase()) {
    case 'quiz':
      return 'from-blue-600 to-indigo-700';
    case 'dance':
      return 'from-purple-600 to-pink-700';
    case 'accelerator':
      return 'from-amber-600 to-orange-700';
    case 'poster making':
      return 'from-rose-600 to-red-700';
    case 'meeting':
      return 'from-emerald-600 to-teal-700';
    default:
      return 'from-blue-600 to-indigo-700';
  }
};

const EventCard = ({ event }) => {
  const [showRulesModal, setShowRulesModal] = useState(false);
  const { selectSingleEvent, selectedEvents, registrations } = useRegistration();
  const navigate = useNavigate();

  // Calculate filled seats dynamically from registrations
  const registeredCount = registrations.filter((r) =>
    (r.eventsList || []).some((e) => e.id === event.id)
  ).length;

  const isSelected = selectedEvents.some((e) => e.id === event.id);
  const seatsLeft = Math.max(0, event.capacity - registeredCount);
  const fillPercentage = Math.min(100, Math.round((registeredCount / event.capacity) * 100));

  const handleRegisterClick = () => {
    selectSingleEvent(event);
    navigate('/register');
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1">
        
        {/* Top Header Card Strip */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-13 h-13 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center p-3 shadow-xs group-hover:scale-105 transition-transform">
                {getEventIcon(event.name)}
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  {event.category || 'NSS Competition'}
                </span>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                  {event.name}
                </h3>
              </div>
            </div>

            {/* Price Badge */}
            <div className="text-right">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-black ${
                event.price === 0 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                  : 'bg-blue-100 text-blue-900 border border-blue-200'
              }`}>
                {event.price === 0 ? 'FREE ENTRY' : `₹${event.price}`}
              </span>
              {event.price > 0 && (
                <p className="text-[10px] text-slate-400 mt-0.5">per entry</p>
              )}
            </div>
          </div>

          <p className="text-slate-600 text-xs leading-relaxed line-clamp-2 mb-4 font-normal">
            {event.description}
          </p>

          {/* Quick Info Grid */}
          <div className="bg-slate-50 rounded-xl p-3.5 space-y-2 border border-slate-100 text-xs text-slate-700">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Calendar className="w-3.5 h-3.5 text-blue-600" /> Date:
              </span>
              <span className="font-bold text-slate-800">{event.date}, 2024</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Clock className="w-3.5 h-3.5 text-purple-600" /> Time:
              </span>
              <span className="font-semibold text-slate-800">{event.time || "10:00 AM onwards"}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                <MapPin className="w-3.5 h-3.5 text-rose-500" /> Venue:
              </span>
              <span className="font-medium text-slate-800 truncate max-w-[170px]" title={event.venue}>
                {event.venue || "College Campus"}
              </span>
            </div>

            {event.prizePool && (
              <div className="flex items-center justify-between pt-1 border-t border-slate-200/80">
                <span className="flex items-center gap-1.5 text-amber-700 font-semibold">
                  <Trophy className="w-3.5 h-3.5 text-amber-500" /> Rewards:
                </span>
                <span className="font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded text-[11px] border border-amber-200">
                  {event.prizePool}
                </span>
              </div>
            )}
          </div>

          {/* Capacity Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-400" /> Capacity:
              </span>
              <span className="font-bold text-slate-700">
                {registeredCount} / {event.capacity} Filled
                {seatsLeft < 10 && seatsLeft > 0 && (
                  <span className="text-rose-600 ml-1.5 font-extrabold text-[11px]">
                    ({seatsLeft} seats left!)
                  </span>
                )}
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  fillPercentage > 85 ? 'bg-rose-500' : fillPercentage > 50 ? 'bg-amber-500' : 'bg-blue-600'
                }`}
                style={{ width: `${Math.max(8, fillPercentage)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center gap-2">
          <button
            onClick={() => setShowRulesModal(true)}
            className="px-3 py-2.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-center gap-1"
            title="Read Rules & Guidelines"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            Rules
          </button>

          <button
            onClick={handleRegisterClick}
            className={`flex-1 py-2.5 px-4 rounded-lg font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 ${
              seatsLeft === 0
                ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
                : 'bg-blue-700 hover:bg-blue-800 text-white hover:shadow-md'
            }`}
            disabled={seatsLeft === 0}
          >
            {seatsLeft === 0 ? (
              'Slots Full'
            ) : (
              <>
                Register Now
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Event Details & Rules Modal */}
      {showRulesModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700">
                  {getEventIcon(event.name)}
                </div>
                <div>
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">
                    {event.category}
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900">{event.name}</h3>
                </div>
              </div>
              <button
                onClick={() => setShowRulesModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-sm text-slate-700">
              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">
                  About the Event
                </h4>
                <p className="text-slate-600 text-xs leading-relaxed">{event.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Team Size</span>
                  <span className="font-bold text-slate-800">{event.teamSize || "Individual"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Registration Fee</span>
                  <span className="font-bold text-blue-700">{event.price === 0 ? 'FREE' : `₹${event.price}`}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Date & Time</span>
                  <span className="font-bold text-slate-800">{event.date} • {event.time}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Venue</span>
                  <span className="font-bold text-slate-800">{event.venue}</span>
                </div>
              </div>

              {event.rules && event.rules.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                    Official Rules & Guidelines
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {event.rules.map((rule, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {event.coordinator && (
                <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-100 text-xs">
                  <span className="text-blue-800 font-bold block mb-1">Student Coordinator Contact:</span>
                  <p className="font-semibold text-slate-800">{event.coordinator.name} ({event.coordinator.role})</p>
                  <p className="text-blue-700 font-mono mt-0.5 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {event.coordinator.phone}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowRulesModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowRulesModal(false);
                  handleRegisterClick();
                }}
                className="px-5 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs"
              >
                Register For ₹{event.price}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default EventCard;
