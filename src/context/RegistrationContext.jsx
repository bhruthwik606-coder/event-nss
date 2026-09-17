import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialRegistrations } from '../data/mockRegistrations';
import { events } from '../data/eventsData';

const RegistrationContext = createContext();

export const RegistrationProvider = ({ children }) => {
  // All registrations in the system
  const [registrations, setRegistrations] = useState(() => {
    const saved = localStorage.getItem('savadan_registrations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialRegistrations;
      }
    }
    return initialRegistrations;
  });

  // Events currently selected by user for registration
  const [selectedEvents, setSelectedEvents] = useState([events[0]]); // default selects Quiz

  // Draft form data across multi-step flow
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    nssId: '',
    college: 'National Institute of Technology (NIT)',
    agreedToTerms: false
  });

  // Active registration in checkout/payment stage
  const [activeCheckout, setActiveCheckout] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('savadan_registrations', JSON.stringify(registrations));
  }, [registrations]);

  // Toggle selection of an event
  const toggleEventSelection = (eventItem) => {
    setSelectedEvents((prev) => {
      const exists = prev.some((e) => e.id === eventItem.id);
      if (exists) {
        // Prevent deselecting if it's the only one selected
        if (prev.length === 1) return prev;
        return prev.filter((e) => e.id !== eventItem.id);
      } else {
        return [...prev, eventItem];
      }
    });
  };

  // Set single event selection directly (e.g. from event card CTA)
  const selectSingleEvent = (eventItem) => {
    setSelectedEvents([eventItem]);
  };

  // Calculate total price of selected events
  const calculateTotal = (eventItems = selectedEvents) => {
    return eventItems.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
  };

  // Duplicate Check: Same email + same event ID
  const checkDuplicateRegistration = (email, eventIds) => {
    if (!email) return { isDuplicate: false };
    
    const userRegs = registrations.filter(
      (r) => r.email.trim().toLowerCase() === email.trim().toLowerCase()
    );

    for (const reg of userRegs) {
      const existingEventIds = (reg.eventsList || []).map((e) => e.id);
      const duplicateFound = eventIds.some((id) => existingEventIds.includes(id));
      if (duplicateFound) {
        const dupEvent = events.find((e) => existingEventIds.includes(e.id));
        return {
          isDuplicate: true,
          message: `You are already registered for "${dupEvent ? dupEvent.name : 'an event'}" with email ${email}.`
        };
      }
    }
    return { isDuplicate: false };
  };

  // Create a new registration
  const addRegistration = (registrationData) => {
    const newReg = {
      id: `SAV-2024-${String(registrations.length + 1).padStart(3, '0')}`,
      date: new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }),
      verified: false,
      ...registrationData
    };

    setRegistrations((prev) => [newReg, ...prev]);
    return newReg;
  };

  // Update payment status (e.g., from Razorpay callback)
  const updatePaymentStatus = (registrationId, status, paymentDetails = {}) => {
    setRegistrations((prev) =>
      prev.map((reg) => {
        if (reg.id === registrationId) {
          return {
            ...reg,
            paymentStatus: status,
            paymentMethod: paymentDetails.method || reg.paymentMethod || "Razorpay / UPI",
            transactionId: paymentDetails.transactionId || reg.transactionId || `TXN_${Date.now()}`
          };
        }
        return reg;
      })
    );
  };

  // Admin: Toggle manual verification of a registration
  const toggleVerification = (registrationId) => {
    setRegistrations((prev) =>
      prev.map((reg) => {
        if (reg.id === registrationId) {
          return {
            ...reg,
            verified: !reg.verified
          };
        }
        return reg;
      })
    );
  };

  // Admin: Update registration status directly (Paid / Pending / Failed)
  const updateRegistrationStatus = (registrationId, newStatus) => {
    setRegistrations((prev) =>
      prev.map((reg) => {
        if (reg.id === registrationId) {
          return {
            ...reg,
            paymentStatus: newStatus
          };
        }
        return reg;
      })
    );
  };

  // Compute analytics
  const totalRegistrations = registrations.length;
  const totalRevenue = registrations.reduce((acc, curr) => {
    if (curr.paymentStatus === 'Paid') {
      return acc + (Number(curr.amount) || 0);
    }
    return acc;
  }, 0);

  const verifiedCount = registrations.filter((r) => r.verified).length;
  const pendingCount = registrations.filter((r) => r.paymentStatus !== 'Paid').length;

  // Breakdown by event
  const eventCounts = events.map((event) => {
    let count = 0;
    let revenue = 0;
    registrations.forEach((r) => {
      const match = (r.eventsList || []).some((e) => e.id === event.id);
      if (match) {
        count += 1;
        if (r.paymentStatus === 'Paid') {
          revenue += event.price;
        }
      }
    });
    return {
      name: event.name,
      count,
      revenue,
      capacity: event.capacity,
      occupancyRate: Math.min(100, Math.round((count / event.capacity) * 100))
    };
  });

  return (
    <RegistrationContext.Provider
      value={{
        registrations,
        selectedEvents,
        setSelectedEvents,
        toggleEventSelection,
        selectSingleEvent,
        calculateTotal,
        formData,
        setFormData,
        activeCheckout,
        setActiveCheckout,
        checkDuplicateRegistration,
        addRegistration,
        updatePaymentStatus,
        toggleVerification,
        updateRegistrationStatus,
        stats: {
          totalRegistrations,
          totalRevenue,
          verifiedCount,
          pendingCount,
          eventCounts
        }
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistration = () => useContext(RegistrationContext);
