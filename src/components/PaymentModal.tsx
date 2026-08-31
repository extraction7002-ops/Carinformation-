import React, { useState } from 'react';
import { ChallanRecord, VehicleRecord } from '../types';
import { 
  CreditCard, CheckCircle2, ShieldCheck, Download, 
  Share2, QrCode, ArrowRight, Loader2, Sparkles, Building2, Check, Printer
} from 'lucide-react';
import { downloadReceiptPdf, downloadMultiReceiptPdf } from '../utils/receiptPdfGenerator';

interface Props {
  challans: ChallanRecord[];
  vehicle: VehicleRecord;
  onSuccess: (paidChallanIds: string[], txnDetails: { txnId: string; receiptNo: string }) => void;
  onClose: () => void;
}

export const PaymentModal: React.FC<Props> = ({
  challans,
  vehicle,
  onSuccess,
  onClose
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'UPI_QR' | 'UPI_ID' | 'CARD' | 'NETBANKING'>('UPI_QR');
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [receiptDetails, setReceiptDetails] = useState<{ txnId: string; receiptNo: string; date: string } | null>(null);

  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPdf = () => {
    if (!receiptDetails) return;
    setIsDownloading(true);
    try {
      if (challans.length === 1) {
        const challanWithReceipt = {
          ...challans[0],
          receiptNo: receiptDetails.receiptNo,
          transactionId: receiptDetails.txnId,
          paymentDate: receiptDetails.date,
          status: 'PAID' as const,
          paymentGateway: 'SBI e-Pay / UPI BharatPe'
        };
        downloadReceiptPdf(challanWithReceipt, vehicle);
      } else {
        downloadMultiReceiptPdf(challans, vehicle, receiptDetails);
      }
    } catch (e) {
      console.error('Error generating PDF receipt:', e);
    } finally {
      setTimeout(() => setIsDownloading(false), 800);
    }
  };

  const handleShareOrCopy = async () => {
    if (!receiptDetails) return;
    const summaryText = `[MoRTH Parivahan e-Challan Receipt]\nVehicle: ${vehicle.rcNumber}\nReceipt No: ${receiptDetails.receiptNo}\nTxn ID: ${receiptDetails.txnId}\nStatus: DISPOSED & PAID (₹${totalAmount})\nSettled Records: ${challans.length}\nDate: ${receiptDetails.date}\nPortal: https://echallan.parivahan.gov.in`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `e-Challan Receipt ${receiptDetails.receiptNo}`,
          text: summaryText,
        });
        return;
      } catch (err) {
        // Fallback
      }
    }

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalAmount = challans.reduce((sum, c) => sum + c.totalAmount, 0);

  const handleProcessPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const generatedTxn = `TXN_PARIVAHAN_${Math.floor(100000000 + Math.random() * 900000000)}`;
      const generatedReceipt = `REC-PARIVAHAN-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      const dateStr = new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      setReceiptDetails({
        txnId: generatedTxn,
        receiptNo: generatedReceipt,
        date: dateStr
      });
      setIsProcessing(false);
      setIsCompleted(true);
      onSuccess(challans.map(c => c.id), { txnId: generatedTxn, receiptNo: generatedReceipt });
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {!isCompleted ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">MoRTH Parivahan Payment Gateway</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Secure e-Challan Settlement</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold px-2 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Bill Summary */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Vehicle Number:</span>
                <span className="font-mono font-bold text-indigo-900">{vehicle.rcNumber}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Challans Selected:</span>
                <span className="font-semibold text-slate-800">{challans.length} Violation Record(s)</span>
              </div>
              <div className="flex justify-between items-center pt-2.5 border-t border-slate-200 text-sm">
                <span className="font-bold text-slate-900">Total Settlement Amount:</span>
                <span className="font-black font-mono text-indigo-700 text-base">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Select Payment Mode
              </span>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI_QR')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'UPI_QR'
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-indigo-600" />
                  <span>UPI Dynamic QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI_ID')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'UPI_ID'
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  <span>GPay / PhonePe / VPA</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CARD')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'CARD'
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-indigo-600" />
                  <span>Debit / Credit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('NETBANKING')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'NETBANKING'
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Building2 className="w-5 h-5 text-indigo-600" />
                  <span>Net Banking</span>
                </button>
              </div>
            </div>

            {/* Payment Details Form */}
            {paymentMethod === 'UPI_QR' && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col items-center text-center space-y-2">
                <div className="bg-white p-3 rounded-xl shadow-xs border border-slate-200 inline-block">
                  <QrCode className="w-28 h-28 text-slate-900" />
                </div>
                <div className="text-[11px] text-slate-600">
                  Scan using Google Pay, PhonePe, Paytm, BHIM, or any UPI App to pay <span className="font-bold text-indigo-700">₹{totalAmount}</span>
                </div>
              </div>
            )}

            {paymentMethod === 'UPI_ID' && (
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <label className="text-slate-600 font-medium block">Enter UPI ID / VPA</label>
                <input
                  type="text"
                  placeholder="e.g. mobile@okhdfcbank"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}

            {paymentMethod === 'CARD' && (
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <input
                  type="text"
                  placeholder="Card Number (RuPay, Visa, Mastercard)"
                  defaultValue="4532 •••• •••• 9102"
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    defaultValue="08/28"
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono"
                  />
                  <input
                    type="password"
                    placeholder="CVV"
                    defaultValue="123"
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'NETBANKING' && (
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <select className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-slate-800">
                  <option>State Bank of India (SBI)</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                  <option>Punjab National Bank (PNB)</option>
                  <option>Bank of Baroda</option>
                </select>
              </div>
            )}

            {/* Security Guarantee */}
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>256-Bit SSL Encrypted Government Payment Node</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={onClose}
                disabled={isProcessing}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleProcessPayment}
                disabled={isProcessing}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying with Bank...</span>
                  </>
                ) : (
                  <>
                    <span>Pay ₹{totalAmount}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          /* SUCCESS RECEIPT VIEW */
          <div className="space-y-4 text-center py-2">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto ring-4 ring-emerald-100">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900">Payment Successful!</h3>
              <p className="text-xs text-emerald-700 font-semibold mt-0.5">e-Challan Disposed in Parivahan Database</p>
            </div>

            {/* Official e-Receipt Paper Box */}
            <div className="bg-slate-50 text-slate-900 p-4 rounded-2xl text-left font-mono text-xs space-y-2 border border-slate-200 shadow-xs">
              <div className="text-center border-b border-slate-200 pb-2">
                <div className="font-extrabold text-xs text-slate-900">MINISTRY OF ROAD TRANSPORT & HIGHWAYS</div>
                <div className="text-[10px] text-slate-500">GOVERNMENT OF INDIA • E-CHALLAN RECEIPT</div>
              </div>

              <div className="space-y-1 text-[11px] pt-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Receipt No:</span>
                  <span className="font-bold">{receiptDetails?.receiptNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Transaction ID:</span>
                  <span className="font-bold truncate max-w-[60%]">{receiptDetails?.txnId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Vehicle Reg No:</span>
                  <span className="font-bold text-indigo-700">{vehicle.rcNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date & Time:</span>
                  <span>{receiptDetails?.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Settled Challans:</span>
                  <span className="font-bold">{challans.length} Record(s)</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 font-bold text-xs">
                  <span>Amount Paid:</span>
                  <span className="text-emerald-700">₹{totalAmount.toLocaleString('en-IN')} (PAID)</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[9px] text-slate-500 border-t border-slate-200">
                <span>DIGITALLY VERIFIED SEAL</span>
                <span className="font-bold text-emerald-700">STATUS: DISPOSED</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                onClick={handleDownloadPdf}
                disabled={isDownloading}
                className="flex-1 py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer min-w-[130px]"
              >
                <Download className="w-4 h-4" />
                <span>{isDownloading ? 'Generating PDF...' : 'Download PDF Slip'}</span>
              </button>
              
              <button
                onClick={handleShareOrCopy}
                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-colors"
                title="Share or Copy Receipt Data"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-slate-600" />}
                <span>{copied ? 'Copied' : 'Share'}</span>
              </button>

              <button
                onClick={onClose}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
