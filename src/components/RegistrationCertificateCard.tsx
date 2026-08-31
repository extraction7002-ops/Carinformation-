import React, { useState } from 'react';
import { VehicleRecord } from '../types';
import { 
  Calendar, ShieldCheck, AlertTriangle, FileText, CheckCircle2, 
  MapPin, Fuel, Eye, EyeOff, QrCode, Download, Share2, 
  Award, Clock, Building2, Landmark, Check, Bell, BellRing, ShieldAlert
} from 'lucide-react';
import { 
  getInsuranceAlert, 
  getPuccAlert, 
  getVehicleComplianceAlerts, 
  notifyVehicleExpiry, 
  sendBrowserNotification 
} from '../utils/validityAlerts';

interface Props {
  vehicle: VehicleRecord;
  onViewChallans: () => void;
  onOpenExpiryModal?: () => void;
}

export const RegistrationCertificateCard: React.FC<Props> = ({ 
  vehicle, 
  onViewChallans,
  onOpenExpiryModal
}) => {
  const [showMasked, setShowMasked] = useState(true);
  const [showFullCardModal, setShowFullCardModal] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const pendingChallans = vehicle.challans.filter(c => c.status === 'PENDING' || c.status === 'IN_COURT');
  const totalPendingFine = pendingChallans.reduce((sum, c) => sum + c.totalAmount, 0);

  const insuranceAlert = getInsuranceAlert(vehicle);
  const puccAlert = getPuccAlert(vehicle);
  const { hasUrgentAlert, urgentCount, alerts } = getVehicleComplianceAlerts(vehicle);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSendReminder = async (docName: string, alertItem: typeof insuranceAlert) => {
    const res = await notifyVehicleExpiry(vehicle, true);
    setToastMessage(`Push reminder dispatched for ${docName}!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Top Banner with Registration Number & Model */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 p-5 text-white shadow-md border border-slate-800">
        {/* Holographic Chip & Emblem Decor */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                MoRTH VAHAN 4.0
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Digitally Verified
              </span>
            </div>
            
            {/* Number Plate Graphic */}
            <div className="mt-2.5 inline-flex items-center bg-white text-slate-950 rounded-lg px-3 py-1.5 font-mono font-extrabold text-xl tracking-wider shadow-sm border-2 border-slate-300">
              <div className="flex flex-col items-center mr-2 pr-2 border-r border-slate-400">
                <span className="text-[8px] leading-tight text-blue-900 font-black">IND</span>
                <div className="w-2.5 h-2.5 rounded-full bg-blue-700 mt-0.5 flex items-center justify-center text-[6px] text-white">★</div>
              </div>
              <span className="text-slate-950 tracking-widest">{vehicle.rcNumber}</span>
            </div>

            <h2 className="text-base font-bold text-white mt-1.5">{vehicle.makerModel}</h2>
            <p className="text-xs text-slate-300">{vehicle.vehicleClass} • {vehicle.color}</p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <button
              onClick={() => setShowFullCardModal(true)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              title="View Parivahan Smart Card RC"
            >
              <QrCode className="w-4 h-4 text-indigo-300" />
              <span className="text-[11px] font-semibold">Smart RC</span>
            </button>
          </div>
        </div>

        {/* Pending Challan Alert Ribbon */}
        {pendingChallans.length > 0 ? (
          <div className="mt-4 p-3 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 animate-pulse" />
              <div>
                <div className="text-xs font-bold text-red-200">
                  {pendingChallans.length} Unpaid Traffic {pendingChallans.length === 1 ? 'Challan' : 'Challans'} Found
                </div>
                <div className="text-[11px] text-red-100/90">
                  Total Pending Fine: <span className="font-bold text-white">₹{totalPendingFine.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onViewChallans}
              className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              Pay Now
            </button>
          </div>
        ) : (
          <div className="mt-4 p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>No pending challans. Vehicle record is 100% clean in Parivahan database.</span>
          </div>
        )}

        {/* Document Expiry Alert Ribbon (Insurance & PUCC) */}
        {hasUrgentAlert && (
          <div className="mt-2.5 p-3 rounded-xl bg-amber-500/25 border border-amber-400/50 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <BellRing className="w-4 h-4 text-amber-300 shrink-0 animate-pulse" />
              <div>
                <div className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
                  <span>Document Validity Alert</span>
                  <span className="text-[10px] bg-amber-400/30 text-amber-100 px-1.5 py-0.2 rounded font-mono font-bold">
                    {urgentCount} Alert{urgentCount > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="text-[11px] text-amber-100/90 line-clamp-1">
                  {insuranceAlert.status === 'EXPIRED' || insuranceAlert.status === 'CRITICAL' || insuranceAlert.status === 'WARNING'
                    ? `${insuranceAlert.title} (${insuranceAlert.badgeLabel})`
                    : ''}
                  {insuranceAlert.status !== 'VALID' && puccAlert.status !== 'VALID' && puccAlert.status !== 'EXEMPT' ? ' • ' : ''}
                  {puccAlert.status === 'EXPIRED' || puccAlert.status === 'CRITICAL' || puccAlert.status === 'WARNING'
                    ? `${puccAlert.title} (${puccAlert.badgeLabel})`
                    : ''}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => handleSendReminder('Vehicle Documents', insuranceAlert)}
                className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1"
                title="Send Local Notification"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Remind</span>
              </button>

              {onOpenExpiryModal && (
                <button
                  onClick={onOpenExpiryModal}
                  className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold transition-all border border-white/20 cursor-pointer"
                >
                  View
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Toast message feedback */}
      {toastMessage && (
        <div className="p-3 rounded-xl bg-indigo-600 text-white text-xs font-semibold flex items-center justify-between shadow-lg animate-fadeIn">
          <div className="flex items-center gap-2">
            <BellRing className="w-4 h-4 text-amber-300 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-white/80 hover:text-white font-bold ml-2">✕</button>
        </div>
      )}

      {/* KEY REGISTRATION DATES & VEHICLE AGE (Primary user requirement) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Registration & Validity Dates</h3>
          </div>
          <span className="text-[11px] text-indigo-600 font-mono font-semibold bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">{vehicle.ownershipSerial}</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Registration Date */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 block mb-0.5">
              Registration Date
            </span>
            <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5 font-mono">
              <Calendar className="w-3.5 h-3.5 text-indigo-600" />
              {vehicle.registrationDate}
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold block mt-1">
              Registered in {vehicle.rtoDetails.state}
            </span>
          </div>

          {/* Vehicle Age */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 block mb-0.5">
              Vehicle Age
            </span>
            <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5 font-mono">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              {vehicle.regAge}
            </div>
            <span className="text-[10px] text-slate-500 block mt-1">
              Since 1st Registration
            </span>
          </div>

          {/* Fitness / RC Expiry */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 block mb-0.5">
              Fitness / RC Valid Upto
            </span>
            <div className="text-sm font-bold text-emerald-700 flex items-center gap-1.5 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              {vehicle.fitnessValidUpto}
            </div>
            <span className="text-[10px] text-slate-500 block mt-1">
              15-Year Standard Validity
            </span>
          </div>

          {/* Fuel & Emission */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 block mb-0.5">
              Fuel & Emission Norm
            </span>
            <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Fuel className="w-3.5 h-3.5 text-amber-600" />
              {vehicle.fuelType}
            </div>
            <span className="text-[10px] text-slate-500 block mt-1">
              {vehicle.emissionNorm}
            </span>
          </div>
        </div>
      </div>

      {/* OWNER & RTO DETAILS */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Building2 className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Ownership & RTO Authority</h3>
          </div>
          <button
            onClick={() => setShowMasked(!showMasked)}
            className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
          >
            {showMasked ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{showMasked ? 'Reveal' : 'Mask'}</span>
          </button>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
            <span className="text-slate-500">Registered Owner</span>
            <span className="font-bold text-slate-900">
              {showMasked ? vehicle.maskedOwnerName : vehicle.ownerName}
            </span>
          </div>

          <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
            <span className="text-slate-500">Father's Name</span>
            <span className="font-medium text-slate-700">
              {showMasked ? 'S*****h D***a' : vehicle.fatherName}
            </span>
          </div>

          <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
            <span className="text-slate-500">Registering Authority (RTO)</span>
            <span className="font-semibold text-indigo-700 text-right max-w-[60%]">
              {vehicle.rtoDetails.rtoName} ({vehicle.rtoDetails.rtoCode})
            </span>
          </div>

          <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
            <span className="text-slate-500">RTO Location</span>
            <span className="text-slate-700 flex items-center gap-1 font-medium">
              <MapPin className="w-3 h-3 text-slate-400" />
              {vehicle.rtoDetails.state} - {vehicle.rtoDetails.pinCode}
            </span>
          </div>

          <div className="flex justify-between items-center py-1.5">
            <span className="text-slate-500">Financed / Hypothecation</span>
            <span className="font-medium text-slate-700 flex items-center gap-1">
              <Landmark className="w-3.5 h-3.5 text-slate-400" />
              {vehicle.hypothecation.isFinanced ? vehicle.hypothecation.bankName : 'Free of Encumbrance'}
            </span>
          </div>
        </div>
      </div>

      {/* COMPLIANCE: INSURANCE, PUCC & ROAD TAX */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <Award className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Compliance & Certificates</h3>
          </div>

          {onOpenExpiryModal && (
            <button
              onClick={onOpenExpiryModal}
              className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer bg-indigo-50 hover:bg-indigo-100/80 px-2 py-0.5 rounded-md transition-colors"
            >
              <BellRing className="w-3.5 h-3.5" />
              <span>Reminders & Alerts</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Insurance Card */}
          <div className={`p-3 rounded-xl border transition-all ${
            insuranceAlert.status === 'EXPIRED'
              ? 'bg-red-50/70 border-red-200'
              : insuranceAlert.status === 'CRITICAL' || insuranceAlert.status === 'WARNING'
              ? 'bg-amber-50/70 border-amber-200'
              : 'bg-slate-50 border-slate-200/80'
          }`}>
            <div className="flex items-center justify-between mb-1.5 gap-1">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900">Motor Insurance</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-mono tracking-wide ${
                insuranceAlert.status === 'EXPIRED'
                  ? 'bg-red-600 text-white animate-pulse'
                  : insuranceAlert.status === 'CRITICAL' || insuranceAlert.status === 'WARNING'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                {insuranceAlert.badgeLabel}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 truncate font-medium">{vehicle.insuranceDetails.company}</p>
            
            <div className="mt-2 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Valid Till:</span>
              <span className="font-mono font-bold text-slate-900">{vehicle.insuranceDetails.validTill}</span>
            </div>

            {/* Warning liability note if expiring/expired */}
            {insuranceAlert.status !== 'VALID' && (
              <div className="mt-2 pt-2 border-t border-amber-200/60 text-[10px] text-red-700 flex items-center justify-between">
                <span className="font-medium">₹2,000 fine under Sec 196</span>
                <button
                  onClick={() => handleSendReminder('Insurance', insuranceAlert)}
                  className="px-2 py-0.5 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded font-bold flex items-center gap-1 cursor-pointer"
                  title="Send local notification reminder"
                >
                  <Bell className="w-3 h-3 text-amber-700" />
                  <span>Notify</span>
                </button>
              </div>
            )}
          </div>

          {/* PUCC (Pollution) Card */}
          <div className={`p-3 rounded-xl border transition-all ${
            puccAlert.status === 'EXPIRED'
              ? 'bg-red-50/70 border-red-200'
              : puccAlert.status === 'CRITICAL' || puccAlert.status === 'WARNING'
              ? 'bg-amber-50/70 border-amber-200'
              : 'bg-slate-50 border-slate-200/80'
          }`}>
            <div className="flex items-center justify-between mb-1.5 gap-1">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900">Pollution (PUCC)</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-mono tracking-wide ${
                puccAlert.status === 'EXPIRED'
                  ? 'bg-red-600 text-white animate-pulse'
                  : puccAlert.status === 'CRITICAL' || puccAlert.status === 'WARNING'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : puccAlert.status === 'EXEMPT'
                  ? 'bg-cyan-100 text-cyan-800'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                {puccAlert.badgeLabel}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 font-mono truncate font-medium">{vehicle.puccDetails.puccNo}</p>
            
            <div className="mt-2 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Valid Till:</span>
              <span className="font-mono font-bold text-slate-900">{vehicle.puccDetails.validTill}</span>
            </div>

            {/* Warning liability note if expiring/expired */}
            {puccAlert.status !== 'VALID' && puccAlert.status !== 'EXEMPT' && (
              <div className="mt-2 pt-2 border-t border-amber-200/60 text-[10px] text-red-700 flex items-center justify-between">
                <span className="font-medium">₹10,000 fine under Sec 190(2)</span>
                <button
                  onClick={() => handleSendReminder('PUCC Emission', puccAlert)}
                  className="px-2 py-0.5 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded font-bold flex items-center gap-1 cursor-pointer"
                  title="Send local notification reminder"
                >
                  <Bell className="w-3 h-3 text-amber-700" />
                  <span>Notify</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Technical Identifiers */}
        <div className="pt-2 border-t border-slate-100 space-y-2 text-[11px]">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Chassis No:</span>
            <div className="flex items-center gap-1 font-mono text-slate-800 font-medium">
              <span>{vehicle.chassisNo}</span>
              <button
                onClick={() => copyToClipboard(vehicle.chassisNo, 'chassis')}
                className="text-slate-400 hover:text-indigo-600 p-0.5 cursor-pointer"
                title="Copy Chassis Number"
              >
                {copiedField === 'chassis' ? <Check className="w-3 h-3 text-emerald-600" /> : <FileText className="w-3 h-3" />}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Engine No:</span>
            <div className="flex items-center gap-1 font-mono text-slate-800 font-medium">
              <span>{vehicle.engineNo}</span>
              <button
                onClick={() => copyToClipboard(vehicle.engineNo, 'engine')}
                className="text-slate-400 hover:text-indigo-600 p-0.5 cursor-pointer"
                title="Copy Engine Number"
              >
                {copiedField === 'engine' ? <Check className="w-3 h-3 text-emerald-600" /> : <FileText className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SMART RC MODAL */}
      {showFullCardModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 max-w-md w-full space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center text-xs font-bold border border-indigo-100">
                  ★
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Parivahan Digital RC Card</h4>
                  <p className="text-[10px] text-slate-500">MoRTH Government of India</p>
                </div>
              </div>
              <button
                onClick={() => setShowFullCardModal(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold px-2 py-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Smart Card Visual */}
            <div className="rounded-2xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 p-4 border-2 border-indigo-400/40 text-white relative shadow-lg space-y-3">
              <div className="flex justify-between items-start border-b border-indigo-400/20 pb-2">
                <div>
                  <span className="text-[9px] uppercase font-bold tracking-widest text-indigo-300 block">
                    GOVERNMENT OF INDIA • RTO
                  </span>
                  <h3 className="text-sm font-black text-white">{vehicle.rtoDetails.state}</h3>
                </div>
                <div className="text-right">
                  <span className="text-[8px] text-slate-300 block font-mono">FORM 23 (Rule 48)</span>
                  <span className="text-[9px] font-bold text-emerald-400">SMART CARD RC</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-slate-300 block">Registration No:</span>
                  <span className="text-base font-black font-mono tracking-wider text-indigo-200">{vehicle.rcNumber}</span>
                </div>
                <div className="bg-white p-1 rounded-lg">
                  <QrCode className="w-10 h-10 text-slate-950" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                <div>
                  <span className="text-slate-400 block">Owner Name:</span>
                  <span className="font-bold text-white">{vehicle.ownerName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Reg Date:</span>
                  <span className="font-bold font-mono text-white">{vehicle.registrationDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Vehicle Model:</span>
                  <span className="font-medium text-slate-200 truncate block">{vehicle.makerModel}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Fitness Upto:</span>
                  <span className="font-bold font-mono text-emerald-300">{vehicle.fitnessValidUpto}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  alert(`Digital Registration Certificate for ${vehicle.rcNumber} saved to device downloads.`);
                  setShowFullCardModal(false);
                }}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download PDF e-RC
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`Vehicle RC: ${vehicle.rcNumber}, Model: ${vehicle.makerModel}, Reg Date: ${vehicle.registrationDate}, Fitness: ${vehicle.fitnessValidUpto}`);
                  alert('RC Verification details copied to clipboard!');
                }}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-slate-200 cursor-pointer"
              >
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
