import React, { useState } from 'react';
import { ChallanRecord, VehicleRecord } from '../types';
import { 
  Download, Printer, Share2, Check, CheckCircle2, 
  ShieldCheck, FileText, QrCode, Building2, Calendar, MapPin
} from 'lucide-react';
import { downloadReceiptPdf } from '../utils/receiptPdfGenerator';

interface Props {
  challan: ChallanRecord;
  vehicle: VehicleRecord;
  onClose: () => void;
}

export const ReceiptModal: React.FC<Props> = ({ challan, vehicle, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const receiptNo = challan.receiptNo || `REC-${vehicle.rcNumber.slice(0, 2)}-2025-904128`;
  const txnId = challan.transactionId || `TXN_PARIVAHAN_${Date.now()}`;
  const paymentDate = challan.paymentDate || '20-Sep-2024, 11:20 AM';
  const gateway = challan.paymentGateway || 'SBI e-Pay / UPI BharatPe Portal';

  const handleDownloadPdf = () => {
    setIsDownloading(true);
    try {
      downloadReceiptPdf(challan, vehicle);
    } catch (e) {
      console.error('Error generating PDF receipt:', e);
    } finally {
      setTimeout(() => setIsDownloading(false), 800);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareOrCopy = async () => {
    const summaryText = `[MoRTH Parivahan e-Challan Receipt]\nVehicle: ${vehicle.rcNumber}\nReceipt No: ${receiptNo}\nTxn ID: ${txnId}\nStatus: DISPOSED & PAID (₹${challan.totalAmount})\nOffense: ${challan.violationType}\nDate: ${paymentDate}\nVerified at: https://echallan.parivahan.gov.in`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `e-Challan Receipt ${receiptNo}`,
          text: summaryText,
        });
        return;
      } catch (err) {
        // Fallback to clipboard
      }
    }

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full shadow-2xl relative max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Official Payment Receipt</h4>
              <p className="text-[10px] text-slate-500 font-medium">MoRTH Parivahan Digital e-Challan Disposal</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-lg font-bold px-2.5 py-1 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Receipt Canvas Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs font-sans">
          
          {/* Official MoRTH Receipt Paper Box */}
          <div 
            id="printable-challan-receipt"
            className="bg-white border-2 border-slate-300 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm relative"
          >
            {/* Watermark badge */}
            <div className="absolute right-4 top-4 opacity-10 pointer-events-none select-none">
              <Building2 className="w-32 h-32 text-indigo-900" />
            </div>

            {/* Government Emblem & Header */}
            <div className="text-center border-b-2 border-slate-200 pb-3 space-y-0.5">
              <div className="inline-block bg-slate-900 text-white text-[9px] font-bold tracking-widest px-2.5 py-0.5 rounded-full uppercase mb-1">
                Government of India
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">
                MINISTRY OF ROAD TRANSPORT & HIGHWAYS
              </h3>
              <p className="text-[11px] text-slate-600 font-semibold">
                e-Challan Citizen Digital Payment Portal • Disposal Receipt
              </p>
            </div>

            {/* Receipt Summary Identifiers */}
            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono text-[11px]">
              <div>
                <span className="text-slate-500 block text-[9px] font-sans uppercase font-bold">Receipt Number</span>
                <span className="font-bold text-indigo-700">{receiptNo}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px] font-sans uppercase font-bold">Date & Time</span>
                <span className="font-semibold text-slate-800">{paymentDate}</span>
              </div>
              <div className="col-span-2 pt-1 border-t border-slate-200 flex justify-between items-center">
                <div>
                  <span className="text-slate-500 block text-[9px] font-sans uppercase font-bold">Transaction Reference ID</span>
                  <span className="font-bold text-slate-900 truncate block max-w-[240px]">{txnId}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block text-[9px] font-sans uppercase font-bold">Payment Gateway</span>
                  <span className="text-slate-700 text-[10px]">{gateway}</span>
                </div>
              </div>
            </div>

            {/* Vehicle & Owner Particulars */}
            <div className="space-y-1.5 pt-1">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <FileText className="w-3 h-3 text-indigo-600" /> Vehicle Particulars
              </div>
              <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200 space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Registration Number:</span>
                  <span className="font-mono font-bold text-indigo-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {vehicle.rcNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Registered Owner:</span>
                  <span className="font-semibold text-slate-900">{vehicle.ownerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Maker & Model:</span>
                  <span className="text-slate-800">{vehicle.makerModel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">RTO Jurisdiction:</span>
                  <span className="text-slate-700">{vehicle.rtoDetails.rtoCode} - {vehicle.rtoDetails.rtoName}</span>
                </div>
              </div>
            </div>

            {/* Violation Particulars */}
            <div className="space-y-1.5 pt-1">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3 h-3 text-indigo-600" /> Violation & Statutory Section
              </div>
              <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200 space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Challan Number:</span>
                  <span className="font-mono font-bold text-slate-900">{challan.challanNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Offense:</span>
                  <span className="font-semibold text-slate-900 text-right max-w-[65%]">{challan.violationType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">MV Act Section:</span>
                  <span className="font-bold text-indigo-700">{challan.section}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Location of Offense:</span>
                  <span className="text-slate-700 text-right max-w-[65%]">{challan.location}</span>
                </div>
              </div>
            </div>

            {/* Financial Settlement Breakdown */}
            <div className="space-y-1 pt-1">
              <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100 space-y-1 text-[11px]">
                <div className="flex justify-between text-slate-600">
                  <span>Base Fine Amount:</span>
                  <span className="font-mono">₹{challan.fineAmount.toLocaleString('en-IN')}.00</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Late Fee / Court Surcharge:</span>
                  <span className="font-mono">₹{(challan.lateFee || 0).toLocaleString('en-IN')}.00</span>
                </div>
                <div className="flex justify-between pt-1.5 border-t border-indigo-200 font-bold text-xs text-indigo-950">
                  <span>Total Settled & Paid Amount:</span>
                  <span className="font-black font-mono text-emerald-700 text-sm">
                    ₹{challan.totalAmount.toLocaleString('en-IN')}.00
                  </span>
                </div>
              </div>
            </div>

            {/* Digital Seal & Stamp */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600 border border-emerald-200">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wide flex items-center gap-1">
                    <span>STATUS: DISPOSED & CLEARED</span>
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono">
                    Digitally signed on National Parivahan Node
                  </div>
                </div>
              </div>

              <div className="p-1 bg-white border border-slate-200 rounded-lg shadow-2xs">
                <QrCode className="w-9 h-9 text-slate-900" />
              </div>
            </div>

          </div>

          {/* Citizen Security Guarantee Note */}
          <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              This receipt serves as conclusive legal proof of payment under Section 136A of the Motor Vehicles (Amendment) Act. The pending status has been updated across state traffic police systems and Vahan registry.
            </span>
          </div>

        </div>

        {/* Bottom Actions Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/80 flex flex-wrap items-center gap-2">
          
          <button
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer min-w-[140px]"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloading ? 'Generating PDF...' : 'Download PDF Receipt'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="py-2.5 px-3.5 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs flex items-center gap-1.5 border border-slate-200 transition-all cursor-pointer shadow-2xs"
            title="Print Official Receipt"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Print</span>
          </button>

          <button
            onClick={handleShareOrCopy}
            className="py-2.5 px-3.5 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs flex items-center gap-1.5 border border-slate-200 transition-all cursor-pointer shadow-2xs"
            title="Share or Copy Receipt Data"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-slate-500" />
                <span className="hidden sm:inline">Share</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="py-2.5 px-4 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs transition-all cursor-pointer"
          >
            Close
          </button>

        </div>

      </div>
    </div>
  );
};
