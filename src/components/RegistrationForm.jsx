import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  BadgeCheck, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  AlertCircle,
  CreditCard,
  ShieldAlert,
  HelpCircle,
  Sparkles,
  Calendar,
  Check
} from 'lucide-react';
import { useRegistration } from '../context/RegistrationContext';
import { useAuth } from '../context/AuthContext';
import { events, collegesList } from '../data/eventsData';

const RegistrationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [duplicateError, setDuplicateError] = useState(null);
  const [customCollege, setCustomCollege] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { 
    selectedEvents, 
    toggleEventSelection, 
    calculateTotal, 
    checkDuplicateRegistration,
    formData,
    setFormData,
    setActiveCheckout
  } = useRegistration();

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      fullName: currentUser?.displayName || formData.fullName || '',
      email: currentUser?.email || formData.email || '',
      phone: currentUser?.phone || formData.phone || '',
      nssId: currentUser?.nssId || formData.nssId || '',
      college: currentUser?.college || formData.college || collegesList[0],
      agreedToTerms: formData.agreedToTerms || false
    },
    mode: 'onTouched'
  });

  const watchCollege = watch('college');
  const watchAgreed = watch('agreedToTerms');
  const totalAmount = calculateTotal(selectedEvents);

  // Sync current user info when logged in
  useEffect(() => {
    if (currentUser) {
      if (currentUser.displayName) setValue('fullName', currentUser.displayName);
      if (currentUser.email) setValue('email', currentUser.email);
      if (currentUser.phone) setValue('phone', currentUser.phone);
      if (currentUser.college) setValue('college', currentUser.college);
      if (currentUser.nssId) setValue('nssId', currentUser.nssId);
    }
  }, [currentUser, setValue]);

  // Step 1 Validation Handler
  const handleNextToStep2 = (data) => {
    setDuplicateError(null);
    setFormData((prev) => ({
      ...prev,
      ...data,
      college: data.college === 'Other College / University' ? (customCollege || 'Other College') : data.college
    }));
    setCurrentStep(2);
  };

  // Step 2 Validation Handler (Events Selection)
  const handleNextToStep3 = () => {
    setDuplicateError(null);
    if (selectedEvents.length === 0) {
      setDuplicateError('Please select at least 1 event to continue registration.');
      return;
    }

    // Check duplicates before moving to review
    const email = watch('email') || formData.email;
    const eventIds = selectedEvents.map((e) => e.id);
    const dupCheck = checkDuplicateRegistration(email, eventIds);

    if (dupCheck.isDuplicate) {
      setDuplicateError(dupCheck.message);
      return;
    }

    setCurrentStep(3);
  };

  // Step 3 Final Submission -> Checkout
  const handleFinalSubmit = async (data) => {
    if (!data.agreedToTerms) {
      setDuplicateError('Please accept the event terms & conditions to proceed.');
      return;
    }

    // Final duplicate check
    const email = data.email;
    const eventIds = selectedEvents.map((e) => e.id);
    const dupCheck = checkDuplicateRegistration(email, eventIds);

    if (dupCheck.isDuplicate) {
      setDuplicateError(dupCheck.message);
      return;
    }

    setIsSubmitting(true);
    const resolvedCollege = data.college === 'Other College / University' ? (customCollege || 'Other College') : data.college;
    
    const draftCheckout = {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      nssId: data.nssId,
      college: resolvedCollege,
      eventsList: selectedEvents,
      amount: totalAmount,
      date: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      paymentStatus: totalAmount === 0 ? 'Paid' : 'Pending',
      paymentMethod: totalAmount === 0 ? 'Free Entry Pass' : 'Razorpay / UPI'
    };

    setFormData(draftCheckout);
    setActiveCheckout(draftCheckout);

    // Simulate quick server verification
    await new Promise((r) => setTimeout(r, 600));
    setIsSubmitting(false);

    // Navigate to payment page
    navigate('/payment');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
      
      {/* Multi-Step Indicator Header */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-5">
        <div className="flex items-center justify-between max-w-xl mx-auto">
          
          {/* Step 1 */}
          <div className="flex items-center gap-2">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                currentStep > 1
                  ? 'bg-emerald-600 text-white'
                  : currentStep === 1
                  ? 'bg-blue-700 text-white ring-4 ring-blue-100'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {currentStep > 1 ? <Check className="w-4 h-4" /> : '1'}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-slate-800">Personal Info</p>
              <p className="text-[10px] text-slate-500">Student credentials</p>
            </div>
          </div>

          <div className={`flex-1 h-0.5 mx-3 ${currentStep > 1 ? 'bg-emerald-600' : 'bg-slate-200'}`} />

          {/* Step 2 */}
          <div className="flex items-center gap-2">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                currentStep > 2
                  ? 'bg-emerald-600 text-white'
                  : currentStep === 2
                  ? 'bg-blue-700 text-white ring-4 ring-blue-100'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {currentStep > 2 ? <Check className="w-4 h-4" /> : '2'}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-slate-800">Select Events</p>
              <p className="text-[10px] text-slate-500">1 or more events</p>
            </div>
          </div>

          <div className={`flex-1 h-0.5 mx-3 ${currentStep > 2 ? 'bg-emerald-600' : 'bg-slate-200'}`} />

          {/* Step 3 */}
          <div className="flex items-center gap-2">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                currentStep === 3
                  ? 'bg-blue-700 text-white ring-4 ring-blue-100'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              3
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-slate-800">Review & Pay</p>
              <p className="text-[10px] text-slate-500">Confirm passes</p>
            </div>
          </div>

        </div>
      </div>

      {/* Duplicate / Alert Banner */}
      {duplicateError && (
        <div className="m-6 mb-0 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-shake">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Duplicate Notice / Attention:</span> {duplicateError}
          </div>
        </div>
      )}

      {/* STEP 1: PERSONAL DETAILS */}
      {currentStep === 1 && (
        <form onSubmit={handleSubmit(handleNextToStep2)} className="p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900">Step 1: Student Information</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter your accurate details for certificate generation and college attendance (OD) letter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Full Name <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Aarav Sharma"
                  className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all ${
                    errors.fullName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                  }`}
                  {...register('fullName', {
                    required: 'Full name is required',
                    minLength: { value: 3, message: 'Minimum 3 characters required' }
                  })}
                />
              </div>
              {errors.fullName && (
                <p className="text-rose-600 text-[11px] mt-1 font-medium">{errors.fullName.message}</p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email Address (Receipt & Pass will be sent here) <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="e.g. student@college.edu"
                  className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all ${
                    errors.email ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                  }`}
                  {...register('email', {
                    required: 'Email address is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Please enter a valid email address'
                    }
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-rose-600 text-[11px] mt-1 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Phone Number (10 Digits) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                WhatsApp / Mobile Number (10 Digits) <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                  +91
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="9876543210"
                  className={`w-full pl-12 pr-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all ${
                    errors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                  }`}
                  {...register('phone', {
                    required: 'Mobile number is required',
                    pattern: {
                      value: /^[6-9]\d{9}$/,
                      message: 'Enter a valid 10-digit Indian mobile number'
                    }
                  })}
                />
              </div>
              {errors.phone && (
                <p className="text-rose-600 text-[11px] mt-1 font-medium">{errors.phone.message}</p>
              )}
            </div>

            {/* NSS ID (Optional) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                NSS Volunteer ID / Unit Reg No. <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <BadgeCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. NSS-2023-9912 (Leave blank if non-NSS)"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                  {...register('nssId')}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Non-NSS college students are warmly welcome!</p>
            </div>

            {/* College Dropdown */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                College / Institution Name <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all appearance-none cursor-pointer"
                  {...register('college', { required: 'Please choose your college' })}
                >
                  {collegesList.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                  ▼
                </div>
              </div>

              {watchCollege === 'Other College / University' && (
                <div className="mt-3">
                  <input
                    type="text"
                    required
                    value={customCollege}
                    onChange={(e) => setCustomCollege(e.target.value)}
                    placeholder="Type your college name and city..."
                    className="w-full px-3.5 py-2.5 bg-white border border-blue-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              )}
            </div>

          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2"
            >
              Next: Select Events
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* STEP 2: EVENT SELECTION */}
      {currentStep === 2 && (
        <div className="p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Step 2: Choose Your Events</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Select one or multiple events you wish to compete or participate in.
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-lg text-right">
              <span className="text-[11px] text-blue-700 block font-medium">Selected Events Total:</span>
              <span className="text-base font-black text-blue-900">₹{totalAmount}</span>
            </div>
          </div>

          {/* Events Checklist */}
          <div className="space-y-3">
            {events.map((ev) => {
              const isChecked = selectedEvents.some((e) => e.id === ev.id);
              return (
                <div
                  key={ev.id}
                  onClick={() => toggleEventSelection(ev)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    isChecked
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-6 h-6 rounded-md flex items-center justify-center border transition-all ${
                        isChecked
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{ev.name}</span>
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {ev.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{ev.description}</p>
                      <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                        <span>📅 {ev.date}, 2024</span>
                        <span>•</span>
                        <span>📍 {ev.venue}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`text-sm font-extrabold px-3 py-1 rounded-full ${
                        ev.price === 0
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-900'
                      }`}
                    >
                      {ev.price === 0 ? 'FREE' : `₹${ev.price}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Info
            </button>

            <button
              type="button"
              onClick={handleNextToStep3}
              className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2"
            >
              Next: Review & Confirm
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: REVIEW & PAYMENT */}
      {currentStep === 3 && (
        <form onSubmit={handleSubmit(handleFinalSubmit)} className="p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900">Step 3: Review Registration Details</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Confirm your candidate details and selected events before proceeding to payment.
            </p>
          </div>

          {/* Student Info Card */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Participant Information
              </span>
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="text-xs text-blue-700 font-bold hover:underline"
              >
                Edit
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Name</span>
                <span className="font-bold text-slate-800">{watch('fullName') || formData.fullName}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Email</span>
                <span className="font-bold text-slate-800">{watch('email') || formData.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Mobile</span>
                <span className="font-bold text-slate-800">+91 {watch('phone') || formData.phone}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">College</span>
                <span className="font-bold text-slate-800">
                  {watchCollege === 'Other College / University' ? (customCollege || 'Other College') : watchCollege}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">NSS ID</span>
                <span className="font-bold text-slate-800">
                  {watch('nssId') || formData.nssId || 'General Student'}
                </span>
              </div>
            </div>
          </div>

          {/* Selected Events Breakdown */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700 flex justify-between items-center">
              <span>Selected Events ({selectedEvents.length})</span>
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="text-blue-700 font-bold hover:underline"
              >
                Change Events
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {selectedEvents.map((e) => (
                <div key={e.id} className="p-3.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{e.name}</span>
                    <span className="text-slate-500 ml-2">({e.date}, 2024 • {e.venue})</span>
                  </div>
                  <span className="font-bold text-slate-800">
                    {e.price === 0 ? 'FREE' : `₹${e.price}`}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-blue-50/70 p-4 border-t border-blue-100 flex items-center justify-between">
              <span className="font-bold text-slate-800 text-sm">Total Payable Amount:</span>
              <span className="text-xl font-black text-blue-900">₹{totalAmount}</span>
            </div>
          </div>

          {/* Terms & Conditions Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-0.5 cursor-pointer"
                {...register('agreedToTerms', { required: true })}
              />
              <span className="text-xs text-slate-600">
                I confirm that the details provided are genuine. I agree to abide by the NSS festival code of conduct and event rules. I understand that entry passes will be verified at the desk.
              </span>
            </label>
          </div>

          {/* Form Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !watchAgreed}
              className={`font-bold text-xs sm:text-sm px-7 py-3.5 rounded-xl shadow-sm transition-all flex items-center gap-2 ${
                isSubmitting || !watchAgreed
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-md'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Verifying Details...
                </>
              ) : totalAmount === 0 ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  Confirm Free Pass
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 text-emerald-200" />
                  Proceed to Payment (₹{totalAmount})
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      )}

    </div>
  );
};

export default RegistrationForm;
