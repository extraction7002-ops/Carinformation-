import React from 'react';
import { VehicleRecord } from '../types';
import { ChevronDown, Plus, Camera, ShieldCheck, Bell, BellRing } from 'lucide-react';
import { getVehicleComplianceAlerts } from '../utils/validityAlerts';

interface Props {
  activeVehicle: VehicleRecord;
  onOpenVehicleModal: () => void;
  onOpenScannerModal: () => void;
  onOpenExpiryModal?: () => void;
}

export const TopAppBar: React.FC<Props> = ({
  activeVehicle,
  onOpenVehicleModal,
  onOpenScannerModal,
  onOpenExpiryModal
}) => {
  const { hasUrgentAlert, urgentCount, highestSeverity } = getVehicleComplianceAlerts(activeVehicle);

  return (
    <div className="bg-white/95 backdrop-blur-md px-4 py-3 border-b border-slate-200 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Active Vehicle Dropdown Button */}
      <button
        onClick={onOpenVehicleModal}
        className="flex items-center gap-2.5 p-1.5 -ml-1 rounded-xl hover:bg-slate-50 transition-colors text-left cursor-pointer group"
      >
        <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center font-mono font-black text-xs text-indigo-700 shadow-xs">
          IND
        </div>

        <div>
          <div className="flex items-center gap-1">
            <span className="font-mono font-black text-sm tracking-wider text-slate-900 group-hover:text-indigo-600 transition-colors">
              {activeVehicle.rcNumber}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
          </div>
          <p className="text-[10px] text-slate-500 font-medium truncate max-w-[150px]">
            {activeVehicle.makerModel}
          </p>
        </div>
      </button>

      {/* Right Quick Actions */}
      <div className="flex items-center gap-2">
        {/* Document Validity Alerts Bell */}
        {onOpenExpiryModal && (
          <button
            onClick={onOpenExpiryModal}
            className={`p-2 rounded-xl relative transition-all cursor-pointer shadow-xs ${
              hasUrgentAlert 
                ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-300' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200'
            }`}
            title="Document Expiry Alerts & Reminders"
          >
            {hasUrgentAlert ? (
              <BellRing className="w-4 h-4 text-amber-600 animate-pulse" />
            ) : (
              <Bell className="w-4 h-4" />
            )}

            {hasUrgentAlert && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white rounded-full text-[9px] font-mono font-black flex items-center justify-center border-2 border-white shadow-xs">
                {urgentCount}
              </span>
            )}
          </button>
        )}

        <button
          onClick={onOpenScannerModal}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-indigo-600 border border-slate-200 transition-all cursor-pointer shadow-xs"
          title="Scan Number Plate with Camera"
        >
          <Camera className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenVehicleModal}
          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          title="Add / Switch Vehicle"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="text-[11px]">Vehicle</span>
        </button>
      </div>
    </div>
  );
};

