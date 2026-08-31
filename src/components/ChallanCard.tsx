import React, { useState } from 'react';
import { ChallanRecord, VehicleRecord } from '../types';
import { 
  AlertCircle, CheckCircle2, Clock, MapPin, Camera, 
  Sparkles, FileText, ChevronDown, ChevronUp, 
  ExternalLink, CreditCard, Scale, Check, Download, ShieldCheck
} from 'lucide-react';
import { downloadReceiptPdf } from '../utils/receiptPdfGenerator';

interface Props {
  challan: ChallanRecord;
  vehicle: VehicleRecord;
  onPay: (challan: ChallanRecord) => void;
  onDispute: (challan: ChallanRecord) => void;
  onAiAnalyze: (challan: ChallanRecord) => void;
  onViewReceipt: (challan: ChallanRecord) => void;
}

export const ChallanCard: React.FC<Props> = ({
  challan,
  vehicle,
  onPay,
  onDispute,
  onAiAnalyze,
  onViewReceipt
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [copiedChallan, setCopiedChallan] = useState(false);

  const getStatusBadge = (status: ChallanRecord['status']) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
            <AlertCircle className="w-3 h-3" /> PENDING
          </span>
        );
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> PAID / DISPOSED
          </span>
        );
      case 'IN_COURT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Scale className="w-3 h-3" /> IN VIRTUAL COURT
          </span>
        );
      case 'DISPUTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3 h-3" /> DISPUTE SUBMITTED
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  const copyChallanNumber = () => {
    navigator.clipboard.writeText(challan.challanNo);
    setCopiedChallan(true);
    setTimeout(() => setCopiedChallan(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-4 transition-all shadow-xs space-y-3">
      {/* Header: Violation Type & Status */}
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-500 font-semibold">
              Challan #{challan.challanNo.slice(-8)}
            </span>
            <button
              onClick={copyChallanNumber}
              className="text-slate-400 hover:text-indigo-600 text-[10px] p-0.5 transition-colors cursor-pointer"
              title="Copy Full Challan Number"
            >
              {copiedChallan ? <Check className="w-3 h-3 text-emerald-600" /> : <FileText className="w-3 h-3 text-slate-400" />}
            </button>
          </div>

          <h4 className="text-sm font-bold text-slate-900 leading-snug">
            {challan.violationType}
          </h4>

          <div className="flex items-center gap-2 text-xs text-indigo-700 font-semibold">
            <span>{challan.section}</span>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="text-base font-extrabold text-slate-900 font-mono">
            ₹{challan.totalAmount.toLocaleString('en-IN')}
          </div>
          <div className="mt-1">{getStatusBadge(challan.status)}</div>
        </div>
      </div>

      {/* Basic Violation Meta */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
        <div className="flex items-center gap-1.5 text-slate-700">
          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="font-mono text-[11px] font-medium">{challan.violationDate}</span>
        </div>

        <div className="flex items-start gap-1.5 text-slate-700">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <span className="text-[11px] truncate font-medium" title={challan.location}>
            {challan.location}
          </span>
        </div>
      </div>

      {/* Traffic Camera Evidence Snippet */}
      <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-200/60">
        <div className="flex items-center gap-2.5">
          <div className="relative w-12 h-10 rounded-lg overflow-hidden border border-slate-300 bg-slate-100 shrink-0">
            <img
              src={challan.evidenceImage}
              alt="Traffic Violation Evidence"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover cursor-pointer hover:opacity-85 transition-opacity"
              onClick={() => setShowImagePreview(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-0.5">
              <Camera className="w-2.5 h-2.5 text-white" />
            </div>
          </div>

          <div className="text-[11px]">
            <div className="text-slate-800 font-semibold flex items-center gap-1">
              <Camera className="w-3 h-3 text-indigo-600" />
              <span>{challan.cameraDetails.type}</span>
            </div>
            {challan.cameraDetails.recordedSpeed && (
              <div className="text-red-600 font-mono font-bold text-[10px]">
                Recorded: {challan.cameraDetails.recordedSpeed}
              </div>
            )}
            <div className="text-slate-500 text-[10px]">
              ANPR Confidence: {challan.cameraDetails.capturedPlateConfidence}
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowImagePreview(true)}
          className="text-xs text-indigo-700 hover:text-indigo-900 font-semibold px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-100 flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span>View Photo</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {/* Expandable Deep Breakdown */}
      {isExpanded && (
        <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-700">
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-slate-500 block">Enforcement System:</span>
              <span className="font-semibold text-slate-800">{challan.officerOrSystem}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Camera ID:</span>
              <span className="font-mono font-medium text-slate-800">{challan.cameraDetails.cameraId}</span>
            </div>
            {challan.cameraDetails.gpsCoordinates && (
              <div className="col-span-2">
                <span className="text-slate-500 block">GPS Coordinates:</span>
                <span className="font-mono text-slate-700">{challan.cameraDetails.gpsCoordinates}</span>
              </div>
            )}
          </div>

          {challan.courtDetails && (
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <Scale className="w-3.5 h-3.5 text-amber-700" /> Virtual Traffic Court Notice
              </div>
              <div className="text-slate-700">Court: {challan.courtDetails.courtName}</div>
              <div className="text-slate-700">Notice No: <span className="font-mono font-medium">{challan.courtDetails.noticeNo}</span></div>
              <div className="text-amber-800 font-semibold">Hearing Date: {challan.courtDetails.hearingDate}</div>
            </div>
          )}

          {challan.disputeHistory && (
            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-[11px] space-y-1">
              <div className="flex items-center justify-between text-blue-900 font-bold">
                <span>Grievance Dispute #{challan.disputeHistory.referenceId}</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">{challan.disputeHistory.status}</span>
              </div>
              <div className="text-slate-700">Reason: {challan.disputeHistory.reason}</div>
            </div>
          )}

          {challan.status === 'PAID' && (
            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-[11px] space-y-2">
              <div className="flex items-center justify-between font-bold text-emerald-900">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Settlement & Clearance Details</span>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-mono font-bold">
                  DISPOSED
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] pt-1 border-t border-emerald-200/60 font-mono">
                <div>
                  <span className="text-slate-500 font-sans block text-[9px] uppercase font-bold">Receipt No</span>
                  <span className="font-bold text-slate-900">{challan.receiptNo || 'REC-PARIVAHAN-2025'}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-sans block text-[9px] uppercase font-bold">Payment Date</span>
                  <span className="text-slate-800">{challan.paymentDate || '20-Sep-2024'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500 font-sans block text-[9px] uppercase font-bold">Transaction Reference</span>
                  <span className="text-slate-700 truncate block">{challan.transactionId || 'TXN_PARIVAHAN_994810293'}</span>
                </div>
              </div>

              <div className="pt-1 flex gap-2">
                <button
                  onClick={() => downloadReceiptPdf(challan, vehicle)}
                  className="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF Receipt</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-slate-500 hover:text-slate-800 text-xs flex items-center gap-1 cursor-pointer py-1 font-medium"
        >
          <span>{isExpanded ? 'Less info' : 'Full details'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        <div className="flex items-center gap-2">
          {/* AI Advisor Button */}
          <button
            onClick={() => onAiAnalyze(challan)}
            className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs flex items-center gap-1 font-semibold transition-all cursor-pointer"
            title="AI Legal & Contest Analysis"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">AI Advice</span>
          </button>

          {challan.status === 'PENDING' && (
            <>
              <button
                onClick={() => onDispute(challan)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition-all cursor-pointer"
              >
                Dispute
              </button>
              <button
                onClick={() => onPay(challan)}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Pay ₹{challan.totalAmount}</span>
              </button>
            </>
          )}

          {challan.status === 'IN_COURT' && (
            <button
              onClick={() => onPay(challan)}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Settle in Virtual Court</span>
            </button>
          )}

          {challan.status === 'PAID' && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => downloadReceiptPdf(challan, vehicle)}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-all shadow-xs cursor-pointer"
                title="Download Official PDF Slip"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF Slip</span>
              </button>
              <button
                onClick={() => onViewReceipt(challan)}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                title="View & Print Official e-Receipt"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">View</span> Receipt
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Traffic Camera Evidence Full Preview Modal */}
      {showImagePreview && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 max-w-lg w-full space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-indigo-600" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Traffic Enforcement Camera Evidence</h4>
                  <p className="text-[10px] text-slate-500">Captured by {challan.cameraDetails.cameraId}</p>
                </div>
              </div>
              <button
                onClick={() => setShowImagePreview(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold px-2 py-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Evidence Image Container with HUD Overlays */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-950">
              <img
                src={challan.evidenceImage}
                alt="High Resolution Traffic Violation Capture"
                referrerPolicy="no-referrer"
                className="w-full h-64 object-cover"
              />

              {/* ANPR HUD Overlay Box */}
              <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm border border-indigo-400/60 rounded-lg p-2 font-mono text-[10px] text-indigo-200 space-y-0.5">
                <div className="font-bold flex items-center gap-1 text-white">
                  <span>PLATE MATCH:</span>
                  <span className="bg-indigo-600 text-white px-1 py-0.2 rounded font-extrabold">{challan.vehicleNo}</span>
                </div>
                <div>CONFIDENCE: {challan.cameraDetails.capturedPlateConfidence}</div>
                {challan.cameraDetails.recordedSpeed && (
                  <div className="text-red-400 font-bold">SPD: {challan.cameraDetails.recordedSpeed}</div>
                )}
                <div>TIME: {challan.violationDate}</div>
              </div>

              <div className="absolute bottom-3 right-3 bg-black/80 px-2 py-1 rounded text-[10px] font-mono text-slate-300 border border-slate-700">
                LAT/LONG: {challan.cameraDetails.gpsCoordinates || '28.7423° N, 77.1645° E'}
              </div>
            </div>

            <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="font-semibold text-slate-900">Legal Note:</span> Camera evidence is timestamped and cryptographically signed under Section 136A of the Motor Vehicles (Amendment) Act.
            </div>

            <button
              onClick={() => setShowImagePreview(false)}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all shadow-xs cursor-pointer"
            >
              Close Evidence View
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
