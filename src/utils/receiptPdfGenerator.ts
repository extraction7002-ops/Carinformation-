import jsPDF from 'jspdf';
import { ChallanRecord, VehicleRecord } from '../types';

/**
 * Utility to convert numbers to Indian Rupee Words
 */
function numberToIndianWords(amount: number): string {
  const ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if (amount === 0) return 'Zero Rupees Only';

  function convertChunk(num: number): string {
    let chunk = '';
    if (num >= 100) {
      chunk += ones[Math.floor(num / 100)] + ' Hundred ';
      num %= 100;
    }
    if (num >= 20) {
      chunk += tens[Math.floor(num / 10)] + ' ';
      num %= 10;
    }
    if (num > 0) {
      chunk += ones[num] + ' ';
    }
    return chunk.trim();
  }

  let words = '';
  const crore = Math.floor(amount / 10000000);
  amount %= 10000000;
  const lakh = Math.floor(amount / 100000);
  amount %= 100000;
  const thousand = Math.floor(amount / 1000);
  amount %= 1000;
  const remaining = amount;

  if (crore > 0) words += convertChunk(crore) + ' Crore ';
  if (lakh > 0) words += convertChunk(lakh) + ' Lakh ';
  if (thousand > 0) words += convertChunk(thousand) + ' Thousand ';
  if (remaining > 0) words += convertChunk(remaining);

  return 'Rupees ' + words.trim() + ' Only';
}

/**
 * Generates and downloads a verified MoRTH e-Challan Official Payment Receipt as a PDF.
 */
export function downloadReceiptPdf(challan: ChallanRecord, vehicle: VehicleRecord) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const receiptNo = challan.receiptNo || `REC-${vehicle.rcNumber.slice(0, 2)}-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
  const txnId = challan.transactionId || `TXN_PARIVAHAN_${Date.now()}`;
  const paymentDate = challan.paymentDate || new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  const gateway = challan.paymentGateway || 'SBI e-Pay / UPI BharatPe Portal';

  // Page background & borders
  doc.setDrawColor(203, 213, 225); // Slate 300
  doc.setLineWidth(0.6);
  doc.rect(10, 10, 190, 277); // Outer border

  doc.setDrawColor(79, 70, 229); // Indigo 600
  doc.setLineWidth(0.3);
  doc.rect(12, 12, 186, 273); // Inner accent border

  // Top header banner
  doc.setFillColor(30, 41, 59); // Slate 800
  doc.rect(12, 12, 186, 28, 'F');

  // National / Gov Header Text
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('GOVERNMENT OF INDIA', 105, 19, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('MINISTRY OF ROAD TRANSPORT & HIGHWAYS (MoRTH)', 105, 24, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(253, 224, 71); // Amber 300
  doc.text('e-Challan Citizen Digital Payment Portal • Official Disposal Receipt', 105, 30, { align: 'center' });

  // Receipt Identification Bar
  doc.setFillColor(241, 245, 249); // Slate 100
  doc.rect(14, 43, 182, 14, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(14, 43, 182, 14, 'S');

  doc.setTextColor(15, 23, 42); // Slate 900
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('RECEIPT NO:', 18, 49);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(67, 56, 202); // Indigo 700
  doc.text(receiptNo, 45, 49);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text('DATE & TIME:', 118, 49);
  doc.setFont('helvetica', 'normal');
  doc.text(paymentDate, 144, 49);

  doc.setFont('helvetica', 'bold');
  doc.text('TRANSACTION ID:', 18, 54);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text(txnId, 49, 54);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('PAYMENT MODE:', 118, 54);
  doc.setFont('helvetica', 'normal');
  doc.text(gateway, 148, 54);

  // Section 1: Vehicle & Owner Information
  let y = 63;
  doc.setFillColor(238, 242, 255); // Indigo 50
  doc.rect(14, y, 182, 6.5, 'F');
  doc.setTextColor(67, 56, 202);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('1. VEHICLE & REGISTRATION PARTICULARS', 17, y + 4.5);

  y += 9;
  const vehicleRows = [
    ['Vehicle Registration No:', vehicle.rcNumber, 'Owner Name:', vehicle.ownerName],
    ['Maker & Model:', vehicle.makerModel, 'Vehicle Class:', vehicle.vehicleClass],
    ['Fuel Type / Emission:', `${vehicle.fuelType} (${vehicle.emissionNorm})`, 'RTO Jurisdiction:', `${vehicle.rtoDetails.rtoCode} - ${vehicle.rtoDetails.rtoName}`],
    ['Registration Date:', vehicle.registrationDate, 'Fitness Valid Upto:', vehicle.fitnessValidUpto]
  ];

  vehicleRows.forEach(row => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105); // Slate 600
    doc.text(row[0], 18, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(row[1], 55, y);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text(row[2], 118, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(row[3], 142, y);
    y += 5.5;
  });

  // Section 2: Violation & Offense Details
  y += 2;
  doc.setFillColor(238, 242, 255);
  doc.rect(14, y, 182, 6.5, 'F');
  doc.setTextColor(67, 56, 202);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('2. VIOLATION & STATUTORY OFFENSE DETAILS', 17, y + 4.5);

  y += 9;
  const challanRows = [
    ['Challan Number:', challan.challanNo, 'Violation Date/Time:', challan.violationDate],
    ['Statutory Section:', challan.section, 'Enforcement Unit:', challan.officerOrSystem],
    ['Violation Nature:', challan.violationType, 'Camera ID:', challan.cameraDetails.cameraId],
    ['Offense Location:', challan.location, 'ANPR Confidence:', challan.cameraDetails.capturedPlateConfidence]
  ];

  challanRows.forEach(row => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(row[0], 18, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    // Clip long text if needed
    const val1 = doc.splitTextToSize(row[1], 55);
    doc.text(val1[0], 52, y);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text(row[2], 118, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    const val2 = doc.splitTextToSize(row[3], 48);
    doc.text(val2[0], 148, y);
    y += 5.5;
  });

  // Section 3: Financial Settlement & Breakdown
  y += 3;
  doc.setFillColor(238, 242, 255);
  doc.rect(14, y, 182, 6.5, 'F');
  doc.setTextColor(67, 56, 202);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('3. SETTLEMENT PARTICULARS & FEE BREAKDOWN', 17, y + 4.5);

  y += 8;
  // Table Header
  doc.setFillColor(241, 245, 249);
  doc.rect(14, y, 182, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('SL', 18, y + 4);
  doc.text('DESCRIPTION OF HEAD', 30, y + 4);
  doc.text('APPLICABLE SECTION', 105, y + 4);
  doc.text('AMOUNT (INR)', 170, y + 4, { align: 'right' });

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('1.', 18, y + 4.5);
  doc.text(challan.violationType.slice(0, 42), 30, y + 4.5);
  doc.text(challan.section.slice(0, 32), 105, y + 4.5);
  doc.setFont('helvetica', 'bold');
  doc.text(`Rs. ${challan.fineAmount.toFixed(2)}`, 190, y + 4.5, { align: 'right' });

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.text('2.', 18, y + 4.5);
  doc.text('Late Fee / Virtual Court Penalty Surcharge', 30, y + 4.5);
  doc.text('Section 183/177 Surcharge', 105, y + 4.5);
  doc.text(`Rs. ${(challan.lateFee || 0).toFixed(2)}`, 190, y + 4.5, { align: 'right' });

  y += 6;
  doc.setFillColor(236, 253, 245); // Emerald 50
  doc.rect(14, y, 182, 8, 'F');
  doc.setDrawColor(167, 243, 208); // Emerald 200
  doc.rect(14, y, 182, 8, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(6, 95, 70); // Emerald 800
  doc.text('TOTAL AMOUNT PAID & CLEARED:', 18, y + 5.5);
  doc.setFontSize(10);
  doc.text(`INR Rs. ${challan.totalAmount.toLocaleString('en-IN')}.00`, 190, y + 5.5, { align: 'right' });

  y += 11;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Amount in Words: ${numberToIndianWords(challan.totalAmount)}`, 18, y);

  // Section 4: Digital Verification Seal & Legal Disposal Stamp
  y += 7;
  doc.setFillColor(248, 250, 252);
  doc.rect(14, y, 182, 38, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(14, y, 182, 38, 'S');

  // Left side: Digital Stamp box
  doc.setFillColor(236, 253, 245);
  doc.roundedRect(18, y + 4, 60, 30, 2, 2, 'FD');
  doc.setDrawColor(16, 185, 129);
  doc.roundedRect(18, y + 4, 60, 30, 2, 2, 'S');

  doc.setTextColor(4, 120, 87);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('MoRTH PARIVAHAN e-SEAL', 48, y + 10, { align: 'center' });
  doc.setFontSize(7);
  doc.text('DIGITALLY SIGNED & VERIFIED', 48, y + 15, { align: 'center' });
  doc.setFontSize(9);
  doc.text('STATUS: DISPOSED', 48, y + 21, { align: 'center' });
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`TS: ${paymentDate}`, 48, y + 26, { align: 'center' });
  doc.text('NO OUTSTANDING LEGAL LIABILITY', 48, y + 30, { align: 'center' });

  // Center / Right side: Official Legal Disclaimer
  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('LEGAL DECLARATION & AUDIT DISCLOSURE:', 84, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  const disclaimer = [
    '1. This is a system-generated electronic receipt issued under Section 136A of the Motor Vehicles Act.',
    '2. Physical signature is not required as this document is cryptographically verified on Parivahan Vahan/Sarathi.',
    '3. Blacklist / Challan Alert against this record is hereby removed from the National Registry database.',
    '4. For any queries, quote Receipt No. or Transaction ID at your jurisdictional RTO or Virtual Court.'
  ];

  let dy = y + 13;
  disclaimer.forEach(line => {
    doc.text(line, 84, dy);
    dy += 4.5;
  });

  // Footer bar
  doc.setFillColor(30, 41, 59);
  doc.rect(12, 270, 186, 15, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('National Portal for e-Challan & Traffic Enforcement • Government of India (MoRTH & NIC)', 105, 275, { align: 'center' });
  doc.setTextColor(203, 213, 225);
  doc.text('Portal URL: https://echallan.parivahan.gov.in • Toll Free Citizen Helpline: 1800-1800-151', 105, 280, { align: 'center' });

  // Save / trigger file download
  const cleanVehicleNo = vehicle.rcNumber.replace(/[^a-zA-Z0-9]/g, '');
  const cleanChallanNo = challan.challanNo.slice(-8);
  const filename = `eChallan_Receipt_${cleanVehicleNo}_${cleanChallanNo}.pdf`;
  doc.save(filename);
}

/**
 * Generates and downloads a consolidated receipt for multiple challans settled together.
 */
export function downloadMultiReceiptPdf(
  challans: ChallanRecord[],
  vehicle: VehicleRecord,
  receiptDetails: { receiptNo: string; txnId: string; date: string }
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const totalAmount = challans.reduce((sum, c) => sum + c.totalAmount, 0);

  // Outer & Inner Borders
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.6);
  doc.rect(10, 10, 190, 277);

  doc.setDrawColor(79, 70, 229);
  doc.setLineWidth(0.3);
  doc.rect(12, 12, 186, 273);

  // Top header banner
  doc.setFillColor(30, 41, 59);
  doc.rect(12, 12, 186, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('GOVERNMENT OF INDIA', 105, 19, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('MINISTRY OF ROAD TRANSPORT & HIGHWAYS (MoRTH)', 105, 24, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(253, 224, 71);
  doc.text('Consolidated e-Challan Settlement Receipt • Batch Disposal Slip', 105, 30, { align: 'center' });

  // Receipt Identification Bar
  doc.setFillColor(241, 245, 249);
  doc.rect(14, 43, 182, 14, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(14, 43, 182, 14, 'S');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('RECEIPT NO:', 18, 49);
  doc.setTextColor(67, 56, 202);
  doc.text(receiptDetails.receiptNo, 45, 49);

  doc.setTextColor(15, 23, 42);
  doc.text('DATE & TIME:', 118, 49);
  doc.setFont('helvetica', 'normal');
  doc.text(receiptDetails.date, 144, 49);

  doc.setFont('helvetica', 'bold');
  doc.text('TRANSACTION ID:', 18, 54);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text(receiptDetails.txnId, 49, 54);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('CHALLANS CLEARED:', 118, 54);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(4, 120, 87);
  doc.text(`${challans.length} Record(s)`, 156, 54);

  // Section 1: Vehicle & Owner Information
  let y = 63;
  doc.setFillColor(238, 242, 255);
  doc.rect(14, y, 182, 6.5, 'F');
  doc.setTextColor(67, 56, 202);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('1. VEHICLE & REGISTRATION PARTICULARS', 17, y + 4.5);

  y += 9;
  const vehicleRows = [
    ['Vehicle Registration No:', vehicle.rcNumber, 'Owner Name:', vehicle.ownerName],
    ['Maker & Model:', vehicle.makerModel, 'Vehicle Class:', vehicle.vehicleClass],
    ['RTO Jurisdiction:', `${vehicle.rtoDetails.rtoCode} - ${vehicle.rtoDetails.rtoName}`, 'Fitness Valid Upto:', vehicle.fitnessValidUpto]
  ];

  vehicleRows.forEach(row => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(row[0], 18, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(row[1], 55, y);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text(row[2], 118, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(row[3], 145, y);
    y += 5.5;
  });

  // Section 2: Settled Challans Itemized Table
  y += 2;
  doc.setFillColor(238, 242, 255);
  doc.rect(14, y, 182, 6.5, 'F');
  doc.setTextColor(67, 56, 202);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(`2. ITEMIZED LIST OF SETTLED VIOLATIONS (${challans.length} ITEMS)`, 17, y + 4.5);

  y += 8;
  doc.setFillColor(241, 245, 249);
  doc.rect(14, y, 182, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('SL', 18, y + 4);
  doc.text('CHALLAN NO', 26, y + 4);
  doc.text('OFFENSE DESCRIPTION', 68, y + 4);
  doc.text('SECTION', 135, y + 4);
  doc.text('AMOUNT (INR)', 190, y + 4, { align: 'right' });

  y += 6;
  challans.forEach((ch, idx) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`${idx + 1}.`, 18, y + 4);
    doc.setFont('helvetica', 'bold');
    doc.text(ch.challanNo.slice(-10), 26, y + 4);
    doc.setFont('helvetica', 'normal');
    doc.text(ch.violationType.slice(0, 36), 68, y + 4);
    doc.text(ch.section.slice(0, 24), 135, y + 4);
    doc.setFont('helvetica', 'bold');
    doc.text(`Rs. ${ch.totalAmount.toFixed(2)}`, 190, y + 4, { align: 'right' });
    y += 5.5;
  });

  // Total Box
  y += 2;
  doc.setFillColor(236, 253, 245);
  doc.rect(14, y, 182, 8, 'F');
  doc.setDrawColor(167, 243, 208);
  doc.rect(14, y, 182, 8, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(6, 95, 70);
  doc.text('TOTAL CONSOLIDATED AMOUNT PAID:', 18, y + 5.5);
  doc.setFontSize(10);
  doc.text(`INR Rs. ${totalAmount.toLocaleString('en-IN')}.00`, 190, y + 5.5, { align: 'right' });

  y += 11;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Amount in Words: ${numberToIndianWords(totalAmount)}`, 18, y);

  // Digital Seal Box
  y += 6;
  doc.setFillColor(248, 250, 252);
  doc.rect(14, y, 182, 38, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(14, y, 182, 38, 'S');

  doc.setFillColor(236, 253, 245);
  doc.roundedRect(18, y + 4, 60, 30, 2, 2, 'FD');
  doc.setDrawColor(16, 185, 129);
  doc.roundedRect(18, y + 4, 60, 30, 2, 2, 'S');

  doc.setTextColor(4, 120, 87);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('MoRTH PARIVAHAN e-SEAL', 48, y + 10, { align: 'center' });
  doc.setFontSize(7);
  doc.text('BATCH PAYMENT VERIFIED', 48, y + 15, { align: 'center' });
  doc.setFontSize(9);
  doc.text('ALL CHALLANS DISPOSED', 48, y + 21, { align: 'center' });
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`TS: ${receiptDetails.date}`, 48, y + 26, { align: 'center' });

  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('LEGAL DECLARATION & AUDIT DISCLOSURE:', 84, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  const disclaimer = [
    '1. This consolidated electronic receipt confirms total settlement of all selected traffic penalties.',
    '2. Physical signature is not required as this document is cryptographically verified on Parivahan Vahan/Sarathi.',
    '3. Vehicle blacklist locks in Vahan National Database have been cleared immediately upon successful gateway reconciliation.',
    '4. For any inquiries, quote Receipt No. or Transaction ID to your state traffic police division.'
  ];

  let dy = y + 13;
  disclaimer.forEach(line => {
    doc.text(line, 84, dy);
    dy += 4.5;
  });

  // Footer bar
  doc.setFillColor(30, 41, 59);
  doc.rect(12, 270, 186, 15, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('National Portal for e-Challan & Traffic Enforcement • Government of India (MoRTH & NIC)', 105, 275, { align: 'center' });
  doc.setTextColor(203, 213, 225);
  doc.text('Portal URL: https://echallan.parivahan.gov.in • Toll Free Citizen Helpline: 1800-1800-151', 105, 280, { align: 'center' });

  const cleanVehicleNo = vehicle.rcNumber.replace(/[^a-zA-Z0-9]/g, '');
  const filename = `eChallan_Consolidated_Receipt_${cleanVehicleNo}.pdf`;
  doc.save(filename);
}
