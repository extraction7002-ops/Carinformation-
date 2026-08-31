import React, { useState } from 'react';
import { ChallanRecord, VehicleRecord } from '../types';
import { ChallanCard } from './ChallanCard';
import { AlertCircle, CheckCircle2, Filter, Search, CreditCard, Scale, Sparkles, Download, ShieldCheck } from 'lucide-react';
import { downloadReceiptPdf, downloadMultiReceiptPdf } from '../utils/receiptPdfGenerator';

interface Props {
  vehicle: VehicleRecord;
  onPay: (challan: ChallanRecord) => void;
  onPayAll: (pendingChallans: ChallanRecord[]) => void;
  onDispute: (challan: ChallanRecord) => void;
  onAiAnalyze: (challan: ChallanRecord) => void;
  onViewReceipt: (challan: ChallanRecord) => void;
  onOpenAdvisor: () => void;
}

export const ChallanList: React.FC<Props> = ({
  vehicle,
  onPay,
  onPayAll,
  onDispute,
  onAiAnalyze,
  onViewReceipt,
  onOpenAdvisor
}) => {
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'IN_COURT' | 'PAID'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const pendingList = vehicle.challans.filter(c => c.status === 'PENDING');
  const inCourtList = vehicle.challans.filter(c => c.status === 'IN_COURT');
  const paidList = vehicle.challans.filter(c => c.status === 'PAID');
  const totalPendingAmount = [...pendingList, ...inCourtList].reduce((sum, c) => sum + c.totalAmount, 0);

  const filteredChallans = vehicle.challans.filter(c => {
    // Status filter
    if (filterStatus === 'PENDING' && c.status !== 'PENDING') return false;
    if (filterStatus === 'IN_COURT' && c.status !== 'IN_COURT') return false;
    if (filterStatus === 'PAID' && c.status !== 'PAID') return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.challanNo.toLowerCase().includes(q) ||
        c.violationType.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.section.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-4 space-y-4">
      {/* Pending Summary & Batch Settlement Bar */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">
              Vehicle e-Challan Summary
            </span>
            <h3 className="text-lg font-black text-white font-mono">
              {vehicle.rcNumber}
            </h3>
            <p className="text-xs text-slate-300 font-medium">{vehicle.makerModel}</p>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider text-red-300 block">
              Pending Penalty
            </span>
            <div className="text-xl font-black text-red-400 font-mono">
              ₹{totalPendingAmount.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-slate-400">
              {pendingList.length + inCourtList.length} Actionable Records
            </span>
          </div>
        </div>

        {pendingList.length > 0 && (
          <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between gap-2">
            <div className="text-xs text-slate-300">
              Pay all <span className="font-bold text-white">{pendingList.length} pending challans</span> together:
            </div>
            <button
              onClick={() => onPayAll(pendingList)}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Clear All (₹{pendingList.reduce((s, c) => s + c.totalAmount, 0)})</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <button
          onClick={() => setFilterStatus('ALL')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
            filterStatus === 'ALL'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          All ({vehicle.challans.length})
        </button>

        <button
          onClick={() => setFilterStatus('PENDING')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
            filterStatus === 'PENDING'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <AlertCircle className="w-3 h-3" />
          <span>Pending ({pendingList.length})</span>
        </button>

        <button
          onClick={() => setFilterStatus('IN_COURT')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
            filterStatus === 'IN_COURT'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Scale className="w-3 h-3" />
          <span>Virtual Court ({inCourtList.length})</span>
        </button>

        <button
          onClick={() => setFilterStatus('PAID')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
            filterStatus === 'PAID'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <CheckCircle2 className="w-3 h-3" />
          <span>Paid ({paidList.length})</span>
        </button>
      </div>

      {/* Search Filter Field */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Filter by Challan No, Location, Section..."
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
          >
            ✕
          </button>
        )}
      </div>

      {/* Paid Settlements & Receipt Export Banner */}
      {filterStatus === 'PAID' && paidList.length > 0 && (
        <div className="bg-emerald-50 border border-emerald-200/90 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 rounded-xl text-emerald-800 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-950">Payment History & Tax Clearances</div>
              <div className="text-[11px] text-emerald-700">
                {paidList.length} disposed e-challan record(s) with digital receipt
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              if (paidList.length === 1) {
                downloadReceiptPdf(paidList[0], vehicle);
              } else {
                downloadMultiReceiptPdf(paidList, vehicle, {
                  receiptNo: `REC-CONSOLIDATED-${vehicle.rcNumber.slice(0, 2)}-2025`,
                  txnId: `TXN_BATCH_${Date.now()}`,
                  date: new Date().toLocaleString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })
                });
              }
            }}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
            title="Download PDF Receipts"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download All ({paidList.length})</span>
          </button>
        </div>
      )}

      {/* Challans List */}
      {filteredChallans.length > 0 ? (
        <div className="space-y-3">
          {filteredChallans.map(challan => (
            <ChallanCard
              key={challan.id}
              challan={challan}
              vehicle={vehicle}
              onPay={onPay}
              onDispute={onDispute}
              onAiAnalyze={onAiAnalyze}
              onViewReceipt={onViewReceipt}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">No Challan Records Found</h4>
            <p className="text-xs text-slate-500 mt-1">
              {searchQuery
                ? `No challans matched your query "${searchQuery}".`
                : filterStatus === 'PENDING'
                ? 'Great! There are no pending traffic challans for this vehicle.'
                : 'No records matching the selected filter.'}
            </p>
          </div>
        </div>
      )}

      {/* AI Help Promo Tile */}
      <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-indigo-950">Got an unfair or bogus challan?</div>
            <div className="text-[11px] text-indigo-700">Ask Sarathi AI to draft an official grievance petition</div>
          </div>
        </div>
        <button
          onClick={onOpenAdvisor}
          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all shadow-xs cursor-pointer shrink-0"
        >
          Ask AI
        </button>
      </div>
    </div>
  );
};
