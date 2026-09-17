export const exportRegistrationsToCSV = (registrations) => {
  if (!registrations || registrations.length === 0) {
    alert("No registration records available to export.");
    return;
  }

  const headers = [
    "Registration ID",
    "Full Name",
    "Email",
    "Phone",
    "NSS ID",
    "College",
    "Events Registered",
    "Total Amount (INR)",
    "Payment Status",
    "Payment Method",
    "Transaction ID",
    "Registration Date",
    "Admin Verified"
  ];

  const rows = registrations.map((r) => [
    `"${r.id || ''}"`,
    `"${(r.fullName || '').replace(/"/g, '""')}"`,
    `"${r.email || ''}"`,
    `"${r.phone || ''}"`,
    `"${r.nssId || 'N/A'}"`,
    `"${(r.college || '').replace(/"/g, '""')}"`,
    `"${(r.eventsList ? r.eventsList.map(e => e.name).join('; ') : (r.event || '')).replace(/"/g, '""')}"`,
    r.amount || 0,
    `"${r.paymentStatus || 'Pending'}"`,
    `"${r.paymentMethod || 'Razorpay/UPI'}"`,
    `"${r.transactionId || ''}"`,
    `"${r.date || ''}"`,
    r.verified ? "Yes" : "No"
  ]);

  const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `Savadan_Registrations_Export_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
