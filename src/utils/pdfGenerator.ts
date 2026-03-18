import { jsPDF } from 'jspdf';
import { Booking, User } from '../types';

export const generateProfessionalPDF = (booking: Booking, user: User | null) => {
  // Try to get user name
  let passengerName = 'JOHN DOE';
  if (user) {
    passengerName = (user.fullName || user.name || 'JOHN DOE').toUpperCase();
  }

  // Boarding pass dimensions (approx 8x3.25 inches -> 203x82mm)
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [210, 85]
  });

  const width = 210;
  const height = 85;
  const primaryColor = [0, 174, 239]; // Bright Blue from image
  const textColor = [30, 30, 30];
  const labelColor = [120, 120, 120];

  // --- Background / Card Shape ---
  doc.setDrawColor(220, 220, 220);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(5, 5, width - 10, height - 10, 6, 6, 'FD');

  // --- Header Area (The Blue Curve) ---
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  
  // Create a more precise rounded header like in the image
  doc.roundedRect(width / 2 - 45, 5, 90, 30, 12, 12, 'F');
  
  // Airline Text & Icon
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('GoTravel', width / 2 + 5, 18, { align: 'center' });
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('ECONOMY', width / 2, 28, { align: 'center' });

  // Airplane Icon (simple paths)
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.8);
  const iconX = width / 2 - 22;
  const iconY = 17;
  doc.line(iconX, iconY, iconX + 10, iconY); // body
  doc.line(iconX + 4, iconY - 4, iconX + 7, iconY); // wing top
  doc.line(iconX + 4, iconY + 4, iconX + 7, iconY); // wing bottom
  doc.line(iconX, iconY - 2, iconX + 1.5, iconY); // tail top
  doc.line(iconX, iconY + 2, iconX + 1.5, iconY); // tail bottom

  // --- Labels "BOARDING PASS" ---
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('BOARDING PASS', 15, 16);
  doc.text('BOARDING PASS', width - 15, 16, { align: 'right' });

  // --- Main Section (Left) ---
  const labelX = 35;
  const valueX = 65;
  
  doc.setTextColor(labelColor[0], labelColor[1], labelColor[2]);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  
  doc.text('PASSENGER NAME', labelX, 38);
  doc.text('FROM', labelX, 52);
  doc.text('TO', labelX, 66);
  doc.text('GATE', labelX, 80);
  
  doc.text('FLIGHT', 105, 52);
  doc.text('DATE', 105, 66);
  
  doc.text('BOARDING TIME', 75, 80);
  doc.text('SEAT', 105, 80);

  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(11);
  doc.text(passengerName, valueX, 38);
  doc.text(booking.from_city?.toUpperCase() || 'ARGENTINA', valueX, 52);
  doc.text(booking.to_city?.toUpperCase() || 'NEW YORK', valueX, 66);
  
  doc.text(booking.flight_id || 'BA302', 105, 57);
  doc.text(booking.date ? new Date(booking.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' }).toUpperCase() : '10 JUNE', 105, 71);

  doc.setFontSize(16);
  doc.text('A2', labelX, 88);
  doc.text(booking.departure_time ? new Date(booking.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '22:30', 75, 88);
  doc.text(booking.seat || '17', 105, 88);

  // --- Vertical Barcode (Left) ---
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  for (let i = 0; i < 40; i++) {
    const barWidth = Math.random() > 0.4 ? 0.8 : 0.3;
    doc.setLineWidth(barWidth);
    doc.line(12, 35 + i * 1.2, 12, 35 + i * 1.2 + 0.9);
  }
  doc.setFontSize(6);
  doc.text('0 0 0 0 0 0 0 0 0 0 0 0 0', 10, 85, { angle: 90 });

  // --- Perforation Line ---
  doc.setDrawColor(200, 200, 200);
  doc.setLineDashPattern([1.5, 1.5], 0);
  doc.line(width - 65, 5, width - 65, height - 5);
  doc.setLineDashPattern([], 0);

  // --- Stub Section (Right) ---
  const stubX = width - 60;
  doc.setTextColor(labelColor[0], labelColor[1], labelColor[2]);
  doc.setFontSize(7);
  
  doc.text('NAME', stubX, 38);
  doc.text('FROM', stubX, 48);
  doc.text('TO', stubX, 58);
  doc.text('FLIGHT', stubX, 68);
  doc.text('DATE', stubX, 78);
  doc.text('GATE', stubX, 90);
  doc.text('BOARDING TIME', stubX + 15, 90);
  doc.text('SEAT', stubX + 40, 90);

  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(9);
  doc.text(passengerName, stubX + 15, 38);
  doc.text(booking.from_city?.toUpperCase() || 'ARGENTINA', stubX + 15, 48);
  doc.text(booking.to_city?.toUpperCase() || 'NEW YORK', stubX + 15, 58);
  doc.text(booking.flight_id || 'BA302', stubX + 15, 68);
  doc.text(booking.date ? new Date(booking.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }).toUpperCase() : '10 JUNE', stubX + 15, 78);
  
  doc.setFontSize(10);
  doc.text('A2', stubX, 95);
  doc.text(booking.departure_time ? new Date(booking.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '22:30', stubX + 15, 95);
  doc.text(booking.seat || '17', stubX + 40, 95);

  // --- Bottom Barcode (Stub) ---
  doc.setDrawColor(0, 0, 0);
  for (let i = 0; i < 50; i++) {
    const barWidth = Math.random() > 0.5 ? 0.7 : 0.3;
    doc.setLineWidth(barWidth);
    doc.line(width - 60 + i * 1, height - 22, width - 60 + i * 1, height - 12);
  }
  doc.setFontSize(6);
  doc.text('0 0 0 0 0 0 0 0 0 0 0 0 0', width - 60, height - 8);

  // Footer text
  doc.setFontSize(6);
  doc.setTextColor(labelColor[0], labelColor[1], labelColor[2]);
  doc.text('BOARDING GATE CLOSE 20 MINUTES PRIOR TO DEPARTURE TIME', width / 2 - 10, height - 5, { align: 'center' });

  doc.save(`GoTravel-BoardingPass-${booking.id}.pdf`);
};
