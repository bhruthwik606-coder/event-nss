import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  ArrowLeft, 
  Download, 
  Ticket, 
  Printer, 
  Sparkles, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  ExternalLink 
} from 'lucide-react';
import PaymentGateway from '../components/PaymentGateway';
import ReceiptModal from '../components/ReceiptModal';
import { useRegistration } from '../context/RegistrationContext';
import { generateRegistrationReceiptPDF } from '../utils/pdfGenerator';

const Payment = () => {
  const { activeCheckout, selectedEvents, formData } = useRegistration();
  const [completedRegistration, setCompletedRegistration] = useState(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const navigate = useNavigate();

  // Fallback checkout data if user navigated directly
  const checkoutData = activeCheckout || {
    fullName: formData.fullName || 'Student Participant',
    email: formData.email || 'student@college.edu',
    phone: formData.phone || '9876543210',
    nssId: formData.nssId || '',
    college: formData.college || 'College of Engineering & Technology',
    eventsList: selectedEvents,
    amount: selectedEvents.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0),
    date: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
  };

  const handlePaymentSuccess = (newReg) => {
    setCompletedRegistration(newReg);
  };

  const handleDownloadPDF = () => {
    if (completedRegistration) {
      generateRegistrationReceiptPDF(completedRegistration);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* SUCCESS SCREEN STATE */}
      {completedRegistration ? (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
          
          {/* Top Success Banner */}
          <div className="bg-emerald-700 text-white rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-xl">
            <div className="w-16 h-16 rounded-full bg-white text-emerald-700 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-800/80 px-3 py-1 rounded-full border border-emerald-600">
                Payment & Registration Confirmed
              </span>
              <h1 className="text-2xl sm:text-3xl font-black mt-2">
                You're In! See You at Savadan 2026 (Sep 24)
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-lg mx-auto">
                Official entry pass has been allocated for <strong>{completedRegistration.fullName}</strong> at CMR College of Engineering & Technology. Your registration ID is <strong className="font-mono">{completedRegistration.id}</strong>.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleDownloadPDF}
                className="bg-white text-emerald-900 hover:bg-emerald-50 font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md flex items-center gap-2 transition-transform transform active:scale-95"
              >
                <Download className="w-4 h-4 text-emerald-700" />
                Download PDF Receipt & Pass
              </button>

              <button
                onClick={() => setIsReceiptModalOpen(true)}
                className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl border border-emerald-600 flex items-center gap-2"
              >
                <Ticket className="w-4 h-4" />
                View Entry Pass
              </button>
            </div>
          </div>

          {/* Registration Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Registered Events ({completedRegistration.eventsList?.length})
              </span>
              <span className="text-xs font-mono font-bold text-blue-900 bg-blue-50 px-2.5 py-1 rounded">
                Ref: {completedRegistration.transactionId}
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {(completedRegistration.eventsList || []).map((e, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{e.name}</span>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      📅 {e.date}, 2024 • 📍 {e.venue || 'College Campus'}
                    </p>
                  </div>
                  <span className="font-bold text-slate-800">
                    {e.price === 0 ? 'FREE' : `₹${e.price}`}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-600 space-y-1.5 border border-slate-200">
              <p className="font-bold text-slate-800">Next Steps:</p>
              <p>• Save or print your PDF receipt to present at the registration desk.</p>
              <p>• Report to the venue 30 minutes prior to your event schedule.</p>
              <p>• OD Attendance letters will be available at the NSS helpdesk.</p>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <Link
                to="/my-registrations"
                className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1"
              >
                View All My Passes &rarr;
              </Link>

              <Link
                to="/"
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
              >
                Return to Home
              </Link>
            </div>
          </div>

          {/* Receipt Modal */}
          {isReceiptModalOpen && (
            <ReceiptModal
              isOpen={isReceiptModalOpen}
              onClose={() => setIsReceiptModalOpen(false)}
              registration={completedRegistration}
            />
          )}

        </div>
      ) : (
        /* PAYMENT CHECKOUT CONTAINER */
        <div className="space-y-6">
          
          <div className="flex items-center justify-between">
            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Edit Form
            </Link>

            <span className="text-xs font-bold text-slate-400">
              Step 3 of 3: Payment
            </span>
          </div>

          <PaymentGateway
            checkoutData={checkoutData}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentFailure={(err) => alert(err)}
          />

        </div>
      )}

    </div>
  );
};

export default Payment;
