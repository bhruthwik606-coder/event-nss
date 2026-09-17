import React from 'react';
import { 
  X, 
  Download, 
  Printer, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  Sparkles,
  QrCode
} from 'lucide-react';
import { generateRegistrationReceiptPDF } from '../utils/pdfGenerator';

const ReceiptModal = ({ isOpen, onClose, registration }) => {
  if (!isOpen || !registration) return null;

  const handleDownloadPDF = () => {
    generateRegistrationReceiptPDF(registration);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Actions (Hidden in Print) */}
        <div className="no-print bg-slate-100 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Official Registration Pass & Receipt
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
              title="Print Pass"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE RECEIPT CONTENT CONTAINER */}
        <div id="printable-receipt" className="p-6 sm:p-8 bg-white text-slate-900 space-y-6">
          
          {/* Header Banner */}
          <div className="border-b-2 border-blue-900 pb-5 text-center relative">
            <div className="inline-block bg-blue-900 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider mb-2">
              CMR College of Engineering & Technology (NSS Unit)
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-blue-950">
              SAVADAN 2026
            </h2>
            <p className="text-xs text-slate-600 font-semibold mt-0.5">
              Annual Inter-Collegiate Youth & Social Impact Festival • Event Date: September 24, 2026
            </p>
            <div className="mt-2 inline-block bg-rose-600 text-white text-[9px] font-black px-2.5 py-0.5 rounded tracking-widest">
              NOT ME BUT YOU
            </div>
          </div>

          {/* Pass Meta Row */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Registration ID</span>
              <span className="font-extrabold text-blue-950 font-mono">{registration.id}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Issue Date</span>
              <span className="font-bold text-slate-800">{registration.date}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Payment Status</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-block border border-emerald-200">
                {registration.paymentStatus || 'Paid'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Ref / Txn ID</span>
              <span className="font-mono text-slate-700 truncate block" title={registration.transactionId}>
                {registration.transactionId || 'TXN_VERIFIED'}
              </span>
            </div>
          </div>

          {/* Student Information */}
          <div className="border border-slate-200 rounded-xl p-4 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 border-b border-slate-100 pb-1.5">
              Candidate Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div>
                <span className="text-slate-500 font-medium">Full Name:</span>
                <p className="font-bold text-slate-900 text-sm">{registration.fullName}</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Email:</span>
                <p className="font-semibold text-slate-800">{registration.email}</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Mobile:</span>
                <p className="font-semibold text-slate-800">+91 {registration.phone}</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Institution:</span>
                <p className="font-semibold text-slate-800">{registration.college}</p>
              </div>
              {registration.nssId && (
                <div className="sm:col-span-2">
                  <span className="text-slate-500 font-medium">NSS Volunteer ID:</span>
                  <p className="font-semibold text-blue-700">{registration.nssId}</p>
                </div>
              )}
            </div>
          </div>

          {/* Events Schedule Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Event Name</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Venue / Time</th>
                  <th className="p-3 text-right">Fee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(registration.eventsList || []).map((ev, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="p-3 font-bold text-slate-900">{ev.name}</td>
                    <td className="p-3 text-slate-600">{ev.date}, 2024</td>
                    <td className="p-3 text-slate-600">{ev.venue || 'Campus Block'} ({ev.time || '10 AM'})</td>
                    <td className="p-3 text-right font-bold text-slate-900">₹{ev.price}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-blue-50/60 font-bold border-t border-blue-200">
                <tr>
                  <td colSpan={3} className="p-3 text-slate-800 text-right">Total Paid Amount:</td>
                  <td className="p-3 text-right text-blue-900 font-extrabold text-sm">₹{registration.amount || 0}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* QR & Verification Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-1 bg-white border border-slate-300 rounded-lg">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=70x70&data=SAVADAN-PASS-${registration.id}-${registration.fullName}`}
                  alt="Entry QR"
                  className="w-16 h-16"
                />
              </div>
              <div className="text-[11px] text-slate-500">
                <p className="font-bold text-slate-800">Scan at Entry Desk</p>
                <p>Present college ID along with this entry pass.</p>
                <p className="text-emerald-700 font-medium">On-Duty (OD) Certificate Included</p>
              </div>
            </div>

            <div className="text-center sm:text-right text-[11px] text-slate-400 space-y-1">
              <div className="w-32 border-b border-slate-400 mx-auto sm:ml-auto"></div>
              <p className="font-bold text-slate-700 pt-1">Convener, NSS Savadan</p>
              <p>National Service Scheme</p>
            </div>
          </div>

        </div>

        {/* Modal Bottom Actions */}
        <div className="no-print bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl"
          >
            Close Window
          </button>
          <button
            onClick={handleDownloadPDF}
            className="px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>

      </div>
    </div>
  );
};

export default ReceiptModal;
