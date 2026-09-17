import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Download, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Eye, 
  FileText, 
  Check, 
  ShieldCheck,
  Building,
  Mail,
  Phone
} from 'lucide-react';
import { events } from '../data/eventsData';
import { exportRegistrationsToCSV } from '../utils/exportCsv';
import ReceiptModal from './ReceiptModal';

const RegistrationTable = ({ registrations, onToggleVerify, onUpdateStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [eventFilter, setEventFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'
  
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [viewingReceipt, setViewingReceipt] = useState(null);

  // Filter & Sort logic
  const filteredData = useMemo(() => {
    return registrations.filter((r) => {
      // Search match
      const query = searchTerm.toLowerCase();
      const matchesSearch =
        r.fullName?.toLowerCase().includes(query) ||
        r.email?.toLowerCase().includes(query) ||
        r.phone?.includes(query) ||
        r.id?.toLowerCase().includes(query) ||
        r.college?.toLowerCase().includes(query);

      // Event match
      const matchesEvent =
        eventFilter === 'ALL' ||
        (r.eventsList || []).some((e) => e.name.toLowerCase() === eventFilter.toLowerCase());

      // Status match
      const matchesStatus =
        statusFilter === 'ALL' ||
        r.paymentStatus?.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesEvent && matchesStatus;
    }).sort((a, b) => {
      let valA = a[sortField] || '';
      let valB = b[sortField] || '';

      if (sortField === 'amount') {
        valA = Number(valA) || 0;
        valB = Number(valB) || 0;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [registrations, searchTerm, eventFilter, statusFilter, sortField, sortOrder]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleExportCSV = () => {
    exportRegistrationsToCSV(filteredData);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      
      {/* Top Filter & Search Controls */}
      <div className="p-5 border-b border-slate-200 bg-slate-50/50 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search candidate name, email, college, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-2xs"
            />
          </div>

          {/* Action buttons (CSV export & count badge) */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
              Showing <strong>{filteredData.length}</strong> of {registrations.length}
            </span>

            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export to CSV
            </button>
          </div>
        </div>

        {/* Filter Badges Row */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          {/* Event Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" /> Event:
            </span>
            <select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className="bg-white border border-slate-300 text-slate-800 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="ALL">All Events (5)</option>
              {events.map((e) => (
                <option key={e.id} value={e.name}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-300 text-slate-800 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="ALL">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          {(searchTerm || eventFilter !== 'ALL' || statusFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setEventFilter('ALL');
                setStatusFilter('ALL');
              }}
              className="text-xs text-rose-600 font-bold hover:underline ml-auto"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Registrations Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-100/90 text-slate-800 uppercase tracking-wider font-bold border-b border-slate-200">
            <tr>
              <th className="py-3.5 px-4 cursor-pointer hover:bg-slate-200/60" onClick={() => handleSort('id')}>
                <div className="flex items-center gap-1">
                  Reg ID
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:bg-slate-200/60" onClick={() => handleSort('fullName')}>
                <div className="flex items-center gap-1">
                  Participant & College
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3.5 px-4">
                Events Registered
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:bg-slate-200/60" onClick={() => handleSort('amount')}>
                <div className="flex items-center gap-1">
                  Amount
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3.5 px-4">
                Payment Status
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:bg-slate-200/60" onClick={() => handleSort('date')}>
                <div className="flex items-center gap-1">
                  Date
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3.5 px-4 text-center">
                Verify
              </th>
              <th className="py-3.5 px-4 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-600 text-sm">No registration records found</p>
                    <p className="text-xs text-slate-400">Try adjusting your search or filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredData.map((reg) => {
                const isPaid = reg.paymentStatus === 'Paid';
                const isPending = reg.paymentStatus === 'Pending';

                return (
                  <tr key={reg.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Reg ID */}
                    <td className="py-3 px-4 font-mono font-bold text-blue-900">
                      {reg.id}
                    </td>

                    {/* Participant Details */}
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-bold text-slate-900 block">{reg.fullName}</span>
                        <span className="text-[11px] text-slate-500 truncate max-w-[200px] block">
                          {reg.college}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {reg.email} • {reg.phone}
                        </span>
                      </div>
                    </td>

                    {/* Events List */}
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[220px]">
                        {(reg.eventsList || []).map((e, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded"
                          >
                            {e.name}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-4 font-extrabold text-slate-900">
                      {reg.amount === 0 ? (
                        <span className="text-emerald-600">FREE</span>
                      ) : (
                        `₹${reg.amount}`
                      )}
                    </td>

                    {/* Payment Status Badge */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          isPaid
                            ? 'bg-emerald-100 text-emerald-800'
                            : isPending
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {isPaid ? (
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Clock className="w-3 h-3 text-amber-600" />
                        )}
                        {reg.paymentStatus || 'Paid'}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3 px-4 text-[11px] text-slate-500 whitespace-nowrap">
                      {reg.date}
                    </td>

                    {/* Verify Toggle */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onToggleVerify(reg.id)}
                        className={`p-1.5 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 ${
                          reg.verified
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-500 border border-slate-300 hover:bg-slate-200'
                        }`}
                        title={reg.verified ? "Verified by NSS Admin" : "Click to mark as verified"}
                      >
                        <ShieldCheck className={`w-4 h-4 ${reg.verified ? 'text-emerald-600' : 'text-slate-400'}`} />
                        <span className="hidden lg:inline">{reg.verified ? 'Verified' : 'Verify'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedRegistration(reg)}
                          className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Full Student Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setViewingReceipt(reg)}
                          className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="View & Download Official PDF Receipt"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Student Details Drawer / Modal */}
      {selectedRegistration && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wide">
                  Registration Details
                </span>
                <h3 className="text-lg font-bold text-slate-900">{selectedRegistration.fullName}</h3>
              </div>
              <button
                onClick={() => setSelectedRegistration(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block font-medium">Registration ID</span>
                  <span className="font-mono font-bold text-slate-900">{selectedRegistration.id}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Phone</span>
                  <span className="font-bold text-slate-900">+91 {selectedRegistration.phone}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block font-medium">Email</span>
                  <span className="font-bold text-slate-900">{selectedRegistration.email}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block font-medium">College</span>
                  <span className="font-bold text-slate-900">{selectedRegistration.college}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">NSS ID</span>
                  <span className="font-bold text-blue-700">{selectedRegistration.nssId || 'None'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Date</span>
                  <span className="font-semibold text-slate-800">{selectedRegistration.date}</span>
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-200">
                <span className="text-xs font-bold text-blue-900 block mb-1">Payment & Transaction Meta</span>
                <p><strong>Amount Paid:</strong> ₹{selectedRegistration.amount}</p>
                <p><strong>Payment Method:</strong> {selectedRegistration.paymentMethod}</p>
                <p><strong>Txn / UTR ID:</strong> <span className="font-mono">{selectedRegistration.transactionId}</span></p>
                <p><strong>Status:</strong> {selectedRegistration.paymentStatus}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  onToggleVerify(selectedRegistration.id);
                  setSelectedRegistration((prev) => ({ ...prev, verified: !prev.verified }));
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold ${
                  selectedRegistration.verified
                    ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {selectedRegistration.verified ? 'Unverify Registration' : 'Mark as Verified'}
              </button>

              <button
                onClick={() => {
                  const reg = selectedRegistration;
                  setSelectedRegistration(null);
                  setViewingReceipt(reg);
                }}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold"
              >
                View Pass & Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable / Downloadable Receipt Modal */}
      {viewingReceipt && (
        <ReceiptModal
          isOpen={!!viewingReceipt}
          onClose={() => setViewingReceipt(null)}
          registration={viewingReceipt}
        />
      )}

    </div>
  );
};

export default RegistrationTable;
