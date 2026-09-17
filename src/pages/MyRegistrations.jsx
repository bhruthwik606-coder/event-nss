import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Ticket, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  FileText, 
  User, 
  Lock,
  PlusCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRegistration } from '../context/RegistrationContext';
import { generateRegistrationReceiptPDF } from '../utils/pdfGenerator';
import ReceiptModal from '../components/ReceiptModal';
import LoginModal from '../components/LoginModal';
import { events } from '../data/eventsData';

const MyRegistrations = () => {
  const { currentUser } = useAuth();
  const { registrations } = useRegistration();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [eventFilter, setEventFilter] = useState('ALL');
  const [selectedPass, setSelectedPass] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Filter registrations for current student user or show matching records
  const userRegistrations = useMemo(() => {
    if (!currentUser) return [];
    const userEmail = currentUser.email.toLowerCase().trim();

    return registrations.filter((r) => {
      const emailMatch = r.email?.toLowerCase().trim() === userEmail;
      
      const searchMatch =
        searchTerm === '' ||
        r.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.eventsList || []).some((e) => e.name.toLowerCase().includes(searchTerm.toLowerCase()));

      const eventMatch =
        eventFilter === 'ALL' ||
        (r.eventsList || []).some((e) => e.name.toLowerCase() === eventFilter.toLowerCase());

      return emailMatch && searchMatch && eventMatch;
    });
  }, [currentUser, registrations, searchTerm, eventFilter]);

  const handleDownloadReceipt = (reg) => {
    generateRegistrationReceiptPDF(reg);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              Student Passes Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1.5">
            My Registered Events & Passes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Access your official Savadan 2024 entry credentials, payment receipts, and event schedules.
          </p>
        </div>

        <Link
          to="/register"
          className="self-start sm:self-auto bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Register Another Event
        </Link>
      </div>

      {/* If Not Logged In */}
      {!currentUser ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-sm space-y-4">
          <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Sign In to View Your Passes</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Please log in with the email address used during registration to access and download your official receipts.
          </p>
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-xs transition-all inline-flex items-center gap-2"
          >
            <User className="w-4 h-4" />
            Sign In with Email
          </button>
        </div>
      ) : (
        /* LOGGED IN USER CONTENT */
        <div className="space-y-6">
          
          {/* User Profile Banner */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-5 sm:p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-lg font-bold">
                {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg">{currentUser.displayName || currentUser.email}</h3>
                <p className="text-xs text-blue-200">{currentUser.college || 'Registered Student Participant'}</p>
                <p className="text-[11px] text-blue-300 font-mono mt-0.5">{currentUser.email}</p>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl px-4 py-2 text-right self-start sm:self-auto border border-white/10">
              <span className="text-[10px] uppercase font-bold text-blue-200 block">Total Passes</span>
              <span className="text-xl font-black text-white">{userRegistrations.length}</span>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by event name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Event:
              </span>
              <select
                value={eventFilter}
                onChange={(e) => setEventFilter(e.target.value)}
                className="bg-slate-50 border border-slate-300 text-xs rounded-xl px-3 py-2 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="ALL">All Events</option>
                {events.map((e) => (
                  <option key={e.id} value={e.name}>{e.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Registrations List / Cards */}
          {userRegistrations.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <Ticket className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="text-base font-bold text-slate-800">No Registrations Found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You haven't registered for any events with {currentUser.email} yet, or no records match your filter.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs mt-2"
              >
                Explore Events & Register &rarr;
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {userRegistrations.map((reg) => (
                <div
                  key={reg.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-extrabold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                        {reg.id}
                      </span>
                      <span className="text-xs text-slate-500">
                        Registered on {reg.date}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          reg.paymentStatus === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        ● {reg.paymentStatus || 'Paid'}
                      </span>
                    </div>

                    {/* Events Tags */}
                    <div>
                      <h4 className="text-base font-extrabold text-slate-900">
                        {(reg.eventsList || []).map(e => e.name).join(', ')}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Institution: {reg.college}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-4 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-slate-400 block font-medium">Payment Mode:</span>
                        <span className="font-bold text-slate-800">{reg.paymentMethod || 'Razorpay / UPI'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Txn / UTR ID:</span>
                        <span className="font-mono font-bold text-slate-800">{reg.transactionId}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Total Paid:</span>
                        <span className="font-extrabold text-blue-700">₹{reg.amount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 shrink-0">
                    <button
                      onClick={() => setSelectedPass(reg)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 w-full md:w-auto justify-center"
                    >
                      <Ticket className="w-3.5 h-3.5 text-blue-600" />
                      View Pass
                    </button>

                    <button
                      onClick={() => handleDownloadReceipt(reg)}
                      className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs w-full md:w-auto justify-center"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download PDF
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* Selected Pass Modal */}
      {selectedPass && (
        <ReceiptModal
          isOpen={!!selectedPass}
          onClose={() => setSelectedPass(null)}
          registration={selectedPass}
        />
      )}

      {/* Login Modal */}
      {isLoginModalOpen && (
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
        />
      )}

    </div>
  );
};

export default MyRegistrations;
