import React, { useState } from 'react';
import { VehicleRecord } from '../types';
import { 
  Bell, BellRing, AlertTriangle, ShieldCheck, CheckCircle2, 
  Calendar, Award, Fuel, Sparkles, ExternalLink, RefreshCw, 
  ChevronRight, AlertCircle, Check, Info, ShieldAlert
} from 'lucide-react';
import { 
  getVehicleComplianceAlerts, 
  requestNotificationPermission, 
  notifyVehicleExpiry, 
  sendBrowserNotification 
} from '../utils/validityAlerts';

interface Props {
  vehicle: VehicleRecord;
  onUpdateVehicle?: (updated: VehicleRecord) => void;
  onClose: () => void;
}

export const ExpiryAlertsModal: React.FC<Props> = ({
  vehicle,
  onUpdateVehicle,
  onClose
}) => {
  const [notificationStatus, setNotificationStatus] = useState<string>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'unsupported'
  );
  const [isTriggering, setIsTriggering] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [renewalFormDoc, setRenewalFormDoc] = useState<'INSURANCE' | 'PUCC' | null>(null);
  
  // Custom date simulation state
  const [customDays, setCustomDays] = useState<number>(10);

  const { alerts, hasUrgentAlert, urgentCount } = getVehicleComplianceAlerts(vehicle);

  const handleEnableNotifications = async () => {
    setIsTriggering(true);
    try {
      const perm = await requestNotificationPermission();
      setNotificationStatus(perm);
      
      const res = await notifyVehicleExpiry(vehicle, true);
      setFeedbackMsg(res.message);
    } catch (e) {
      console.error(e);
      setFeedbackMsg('Failed to dispatch notification.');
    } finally {
      setIsTriggering(false);
      setTimeout(() => setFeedbackMsg(null), 5000);
    }
  };

  const handleSimulateUpdate = (type: 'INSURANCE' | 'PUCC', newDays: number) => {
    if (!onUpdateVehicle) return;

    const today = new Date();
    const futureDate = new Date(today.getTime() + newDays * 24 * 60 * 60 * 1000);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedDate = `${String(futureDate.getDate()).padStart(2, '0')}-${months[futureDate.getMonth()]}-${futureDate.getFullYear()}`;

    let updatedVehicle: VehicleRecord;

    if (type === 'INSURANCE') {
      updatedVehicle = {
        ...vehicle,
        insuranceDetails: {
          ...vehicle.insuranceDetails,
          validTill: formattedDate,
          daysLeft: newDays,
          status: newDays < 0 ? 'EXPIRED' : newDays <= 30 ? 'EXPIRING_SOON' : 'ACTIVE'
        }
      };
    } else {
      updatedVehicle = {
        ...vehicle,
        puccDetails: {
          ...vehicle.puccDetails,
          validTill: formattedDate,
          daysLeft: newDays,
          status: newDays < 0 ? 'EXPIRED' : 'ACTIVE'
        }
      };
    }

    onUpdateVehicle(updatedVehicle);
    setRenewalFormDoc(null);
    setFeedbackMsg(`Updated ${type} validity to ${formattedDate} (${newDays} days remaining).`);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full shadow-2xl relative max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 shadow-xs">
              <BellRing className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Document Expiry Reminders & Alerts</h4>
              <p className="text-[10px] text-slate-500 font-medium font-mono">
                {vehicle.rcNumber} • {vehicle.makerModel}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-lg font-bold px-2.5 py-1 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs font-sans">
          
          {/* Feedback banner */}
          {feedbackMsg && (
            <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>{feedbackMsg}</span>
            </div>
          )}

          {/* Local Push Notification Controller Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white shadow-md space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  Local Push Reminders
                </span>
                <h3 className="text-sm font-bold text-white mt-1">Smart Document Expiration Warnings</h3>
                <p className="text-[11px] text-slate-300">
                  Receive automated reminders 30 days, 15 days, and 3 days before your Insurance or PUCC expires.
                </p>
              </div>

              <div className="p-2 rounded-xl bg-white/10 text-amber-300 border border-white/10 shrink-0">
                <Bell className="w-5 h-5" />
              </div>
            </div>

            <div className="pt-1 flex flex-wrap items-center gap-2 border-t border-slate-800">
              <button
                onClick={handleEnableNotifications}
                disabled={isTriggering}
                className="flex-1 py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer min-w-[150px]"
              >
                {isTriggering ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <BellRing className="w-3.5 h-3.5" />
                )}
                <span>{notificationStatus === 'granted' ? 'Send Test Local Notification' : 'Enable Local Notifications'}</span>
              </button>

              <div className="text-[10px] text-slate-300 font-mono px-2 py-1 bg-white/5 rounded-lg border border-white/10">
                Status: <span className={notificationStatus === 'granted' ? 'text-emerald-400 font-bold' : 'text-amber-300'}>{notificationStatus}</span>
              </div>
            </div>
          </div>

          {/* Compliance Status Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-slate-700 font-bold text-xs uppercase tracking-wider">
              <span>Vehicle Validity Status</span>
              {hasUrgentAlert ? (
                <span className="text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {urgentCount} Action Needed
                </span>
              ) : (
                <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  100% Compliant
                </span>
              )}
            </div>

            {alerts.map(item => {
              const isUrgent = item.status === 'EXPIRED' || item.status === 'CRITICAL' || item.status === 'WARNING';
              const isExpired = item.status === 'EXPIRED';

              return (
                <div 
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isExpired 
                      ? 'bg-red-50/70 border-red-200 shadow-2xs' 
                      : item.status === 'CRITICAL' || item.status === 'WARNING'
                      ? 'bg-amber-50/70 border-amber-200 shadow-2xs'
                      : 'bg-slate-50/80 border-slate-200 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {item.type === 'INSURANCE' ? (
                          <Award className={`w-4 h-4 ${isUrgent ? 'text-amber-600' : 'text-indigo-600'}`} />
                        ) : (
                          <Fuel className={`w-4 h-4 ${isUrgent ? 'text-amber-600' : 'text-indigo-600'}`} />
                        )}
                        <h4 className="font-bold text-slate-900 text-xs">{item.documentName}</h4>
                      </div>

                      <p className="text-[11px] text-slate-600 font-medium">
                        {item.provider} • <span className="font-mono">{item.policyOrCertNo}</span>
                      </p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono tracking-wide shrink-0 ${
                      isExpired 
                        ? 'bg-red-600 text-white animate-pulse' 
                        : item.status === 'CRITICAL' || item.status === 'WARNING'
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : item.status === 'EXEMPT'
                        ? 'bg-cyan-100 text-cyan-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {item.badgeLabel}
                    </span>
                  </div>

                  {/* Validity Details & Warning description */}
                  <div className="mt-3 pt-2.5 border-t border-slate-200/80 space-y-2 text-[11px]">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Validity Expiry Date:</span>
                      <span className="font-mono font-bold text-slate-900">{item.validTill}</span>
                    </div>

                    {item.fineAmount > 0 && isUrgent && (
                      <div className="p-2.5 rounded-xl bg-white border border-red-200 text-red-700 flex items-start gap-2">
                        <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold block">Statutory Penalty Alert:</span>
                          <span>{item.description} (Penalty: ₹{item.fineAmount.toLocaleString('en-IN')})</span>
                        </div>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="pt-1 flex items-center gap-2">
                      <button
                        onClick={() => setRenewalFormDoc(item.type === 'INSURANCE' ? 'INSURANCE' : 'PUCC')}
                        className="flex-1 py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 shadow-2xs transition-colors cursor-pointer"
                      >
                        <span>{item.type === 'INSURANCE' ? 'Renew / Extend Policy' : 'Log New PUCC Test'}</span>
                      </button>

                      <button
                        onClick={() => {
                          sendBrowserNotification(`⚠️ Reminder: ${item.documentName}`, {
                            body: `${item.title} for ${vehicle.rcNumber} (${item.badgeLabel}). Valid till: ${item.validTill}`,
                            tag: `alert-${item.id}`
                          });
                          setFeedbackMsg(`Local reminder sent for ${item.documentName}!`);
                          setTimeout(() => setFeedbackMsg(null), 3000);
                        }}
                        className="py-1.5 px-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-[11px] font-semibold flex items-center gap-1 shadow-2xs cursor-pointer"
                        title="Send Immediate Push Notification"
                      >
                        <Bell className="w-3.5 h-3.5 text-slate-500" />
                        <span>Remind</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Simulation / Test Sandbox */}
          {renewalFormDoc && (
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-indigo-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Simulate / Update {renewalFormDoc} Validity
                </h4>
                <button
                  onClick={() => setRenewalFormDoc(null)}
                  className="text-indigo-400 hover:text-indigo-700 font-bold"
                >
                  ✕
                </button>
              </div>

              <p className="text-[11px] text-indigo-800">
                Choose a validity preset to simulate how the app badges, alerts, and push notifications respond:
              </p>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleSimulateUpdate(renewalFormDoc, -15)}
                  className="p-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-xl font-bold text-[11px] text-center border border-red-200 cursor-pointer"
                >
                  Set Expired (-15d)
                </button>
                <button
                  onClick={() => handleSimulateUpdate(renewalFormDoc, 7)}
                  className="p-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl font-bold text-[11px] text-center border border-amber-200 cursor-pointer"
                >
                  Expiring in 7 Days
                </button>
                <button
                  onClick={() => handleSimulateUpdate(renewalFormDoc, 365)}
                  className="p-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-xl font-bold text-[11px] text-center border border-emerald-200 cursor-pointer"
                >
                  Renewed (1 Year)
                </button>
              </div>
            </div>
          )}

          {/* Guidelines info */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 space-y-1">
            <div className="font-bold text-slate-700 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-indigo-600" />
              <span>MoRTH Statutory Compliance Guidelines</span>
            </div>
            <p>
              Under MoRTH Rule 115(7), all in-use vehicles must carry a valid PUCC. Under MV Act Sec 146, third-party liability insurance is mandatory on all public roads across India.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="py-2 px-5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs transition-all cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
