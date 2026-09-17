import { jsPDF } from "jspdf";

export const generateRegistrationReceiptPDF = (registration) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Background and borders
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 0, 210, 297, "F");

  // Main Card Area
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(15, 15, 180, 267, 4, 4, "F");
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(15, 15, 180, 267, 4, 4, "D");

  // Top Header Banner
  doc.setFillColor(30, 58, 138); // NSS Navy
  doc.rect(15, 15, 180, 30, "F");

  // Brand Titles
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text("CMR COLLEGE OF ENGINEERING & TECHNOLOGY", 105, 25, { align: "center" });

  doc.setFontSize(11);
  doc.setTextColor(254, 240, 138); // Yellow accent
  doc.text("SAVADAN 2026 - NSS ANNUAL FESTIVAL", 105, 33, { align: "center" });

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(255, 255, 255);
  doc.text("UGC Autonomous • NAAC A+ • NBA | Event Date: September 24, 2026", 105, 40, { align: "center" });

  // Badge / Motto
  doc.setFillColor(220, 38, 38);
  doc.roundedRect(75, 49, 60, 7, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("NOT ME BUT YOU", 105, 54, { align: "center" });

  // Receipt Header Info
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("OFFICIAL REGISTRATION RECEIPT & ENTRY PASS", 105, 65, { align: "center" });

  // Pass Meta Box
  doc.setFillColor(241, 245, 249);
  doc.rect(25, 72, 160, 18, "F");
  doc.setDrawColor(203, 213, 225);
  doc.rect(25, 72, 160, 18, "D");

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(71, 85, 105);
  doc.text("REGISTRATION ID:", 30, 79);
  doc.text("DATE & TIME:", 110, 79);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(15, 23, 42);
  doc.text(registration.id || "SAV-2024-REG", 30, 85);
  doc.text(registration.date || new Date().toLocaleDateString(), 110, 85);

  // Student Information Section
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(30, 58, 138);
  doc.text("PARTICIPANT DETAILS", 25, 100);
  doc.line(25, 102, 185, 102);

  doc.setFontSize(9);
  const leftColX = 25;
  const rightColX = 105;
  let y = 110;

  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 116, 139);
  doc.text("Full Name:", leftColX, y);
  doc.text("Email Address:", rightColX, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(15, 23, 42);
  doc.text(registration.fullName || "Participant", leftColX + 25, y);
  doc.text(registration.email || "N/A", rightColX + 30, y);

  y += 8;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 116, 139);
  doc.text("Phone:", leftColX, y);
  doc.text("College:", rightColX, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(15, 23, 42);
  doc.text(registration.phone || "N/A", leftColX + 25, y);
  doc.text(registration.college || "N/A", rightColX + 30, y);

  y += 8;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 116, 139);
  doc.text("NSS Volunteer ID:", leftColX, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(15, 23, 42);
  doc.text(registration.nssId ? registration.nssId : "General Participant", leftColX + 35, y);

  // Registered Events Table
  y += 15;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(30, 58, 138);
  doc.text("REGISTERED EVENTS & SCHEDULE", 25, y);
  doc.line(25, y + 2, 185, y + 2);

  y += 8;
  // Table Header
  doc.setFillColor(226, 232, 240);
  doc.rect(25, y, 160, 7, "F");
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text("EVENT NAME", 30, y + 5);
  doc.text("DATE", 90, y + 5);
  doc.text("VENUE / TIME", 120, y + 5);
  doc.text("FEE", 175, y + 5, { align: "right" });

  y += 7;
  const eventsList = registration.eventsList || [];
  eventsList.forEach((ev, idx) => {
    if (idx % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(25, y, 160, 8, "F");
    }
    doc.setFont("helvetica", "bold");
    doc.text(ev.name, 30, y + 5);
    doc.setFont("helvetica", "normal");
    doc.text(ev.date || "Nov 2024", 90, y + 5);
    doc.text((ev.time || "College Campus").substring(0, 25), 120, y + 5);
    doc.text(`INR ${ev.price}`, 175, y + 5, { align: "right" });
    y += 8;
  });

  // Total Summary
  y += 4;
  doc.setDrawColor(203, 213, 225);
  doc.line(25, y, 185, y);
  y += 6;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text("Total Paid:", 120, y);
  doc.setTextColor(37, 99, 235);
  doc.text(`INR ${registration.amount || 0}`, 175, y, { align: "right" });

  // Payment Status Box
  y += 12;
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(25, y, 160, 20, 2, 2, "FD");

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(22, 101, 52);
  doc.text(`PAYMENT STATUS: ${registration.paymentStatus?.toUpperCase() || 'PAID'}`, 30, y + 6);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85);
  doc.text(`Transaction / Ref ID: ${registration.transactionId || 'TXN-MOCK-SUCCESS'}`, 30, y + 12);
  doc.text(`Payment Gateway: ${registration.paymentMethod || 'Razorpay / UPI'}`, 30, y + 17);

  // Instructions & Guidelines
  y += 28;
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(71, 85, 105);
  doc.text("IMPORTANT INSTRUCTIONS FOR CANDIDATES:", 25, y);
  doc.setFont("helvetica", "normal");
  doc.text("1. Please carry a printed copy or digital PDF of this receipt along with your College ID card.", 25, y + 5);
  doc.text("2. Report to the registration desk 30 minutes before the scheduled event time for badge collection.", 25, y + 9);
  doc.text("3. On-duty (OD) / Attendance requisition letters will be issued at the NSS Helpdesk.", 25, y + 13);
  doc.text("4. For any queries, contact Savadan Helpdesk: +91 98765 43210 / savadan.nss@college.edu", 25, y + 17);

  // Stamp & Signatures
  y += 26;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Verified by NSS Convener", 35, y);
  doc.text("NSS Programme Officer", 145, y);

  doc.setDrawColor(148, 163, 184);
  doc.line(30, y - 2, 80, y - 2);
  doc.line(140, y - 2, 180, y - 2);

  // Save PDF
  const cleanName = (registration.fullName || "Student").replace(/[^a-zA-Z0-9]/g, "_");
  doc.save(`Savadan_NSS_Receipt_${cleanName}.pdf`);
};
