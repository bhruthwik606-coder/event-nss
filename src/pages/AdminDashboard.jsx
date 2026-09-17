import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Users, 
  IndianRupee, 
  ShieldCheck, 
  Clock, 
  TrendingUp, 
  Download, 
  LogOut, 
  BarChart3, 
  PieChart, 
  Layers, 
  Sparkles, 
  AlertCircle,
  FileText,
  Search,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRegistration } from '../context/RegistrationContext';
import RegistrationTable from '../components/RegistrationTable';
import { events } from '../data/eventsData';

const AdminDashboard = () => {
  const { adminUser, logoutAdmin } = useAuth();
  const { 
    registrations, 
    stats, 
    toggleVerification, 
    updateRegistrationStatus 
  } = useRegistration();
  const navigate = useNavigate();

  // If not logged in as admin, show login prompt
  if (!adminUser) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-md w-full text-center space-y-4 shadow-card">
          <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Admin Access Restricted</h3>
          <p className="text-xs text-slate-500">
            Please log in with verified NSS coordinator credentials to view the analytics dashboard.
          </p>
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs"
          >
            Go to Admin Login &rarr;
          </Link>
        </div>
      </div>
    );
  }

  const handleAdminLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Top Header Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-900 text-amber-300 flex items-center justify-center font-black text-sm shadow-xs">
            NSS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                CMRCET NSS Admin Portal
              </span>
              <span className="text-xs text-slate-400">• Savadan 2026 (Sep 24, 2026)</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              CMR College of Engineering & Technology
            </h1>
            <p className="text-xs text-slate-500">
              Coordinator: <strong className="text-slate-800">{adminUser.displayName || adminUser.email}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            target="_blank"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            Live Site ↗
          </Link>
          <button
            onClick={handleAdminLogout}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Registrations */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Registrations</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{stats.totalRegistrations}</h3>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Real-time active
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Collected</p>
            <h3 className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1">₹{stats.totalRevenue}</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Direct UPI & Razorpay</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <IndianRupee className="w-6 h-6" />
          </div>
        </div>

        {/* Verified Count */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Verified Passes</p>
            <h3 className="text-2xl sm:text-3xl font-black text-blue-900 mt-1">{stats.verifiedCount}</h3>
            <p className="text-[11px] text-blue-600 font-semibold mt-0.5">
              {Math.round((stats.verifiedCount / Math.max(1, stats.totalRegistrations)) * 100)}% Verified
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Payments */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Review</p>
            <h3 className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">{stats.pendingCount}</h3>
            <p className="text-[11px] text-amber-700 font-semibold mt-0.5">Awaiting verification</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* EVENT BREAKDOWN VISUAL CHART / GAUGES */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-blue-700" />
            <h3 className="text-base font-bold text-slate-900">Event Registrations & Capacity Occupancy</h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">5 Active Competitions</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {stats.eventCounts.map((ev, idx) => (
            <div
              key={idx}
              className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{ev.name}</span>
                  <span className="text-xs font-extrabold text-blue-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    ₹{ev.revenue}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  <strong>{ev.count}</strong> / {ev.capacity} Seats Filled
                </p>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      ev.occupancyRate > 80
                        ? 'bg-rose-500'
                        : ev.occupancyRate > 40
                        ? 'bg-amber-500'
                        : 'bg-blue-600'
                    }`}
                    style={{ width: `${Math.max(6, ev.occupancyRate)}%` }}
                  ></div>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold block mt-1 text-right">
                  {ev.occupancyRate}% Full
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FULL REGISTRATIONS TABLE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">Registered Participants Table</h3>
            <p className="text-xs text-slate-500">
              Search, filter, mark verification, and export student records to CSV.
            </p>
          </div>
        </div>

        <RegistrationTable
          registrations={registrations}
          onToggleVerify={toggleVerification}
          onUpdateStatus={updateRegistrationStatus}
        />
      </div>

    </div>
  );
};

export default AdminDashboard;
