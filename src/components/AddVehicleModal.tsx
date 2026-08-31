import React, { useState } from 'react';
import { VehicleRecord } from '../types';
import { generateVehicleFromRC } from '../data/mockVehicles';
import { Search, Plus, Sparkles, Check, Car, Bike, AlertCircle, BellRing, AlertTriangle } from 'lucide-react';
import { getVehicleComplianceAlerts } from '../utils/validityAlerts';

interface Props {
  existingVehicles: VehicleRecord[];
  onSelectVehicle: (vehicle: VehicleRecord) => void;
  onAddVehicle: (newVehicle: VehicleRecord) => void;
  onClose: () => void;
}

export const AddVehicleModal: React.FC<Props> = ({
  existingVehicles,
  onSelectVehicle,
  onAddVehicle,
  onClose
}) => {
  const [rcInput, setRcInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const samplePlates = [
    { plate: 'DL01CA1234', desc: 'Hyundai Creta (Delhi) • 2 Challans' },
    { plate: 'MH02EZ9988', desc: 'Royal Enfield (Mumbai) • 2 Challans' },
    { plate: 'KA03MM7711', desc: 'Tata Nexon EV (Bengaluru) • 1 Challan' },
    { plate: 'WB06GH4321', desc: 'Maruti Suzuki Baleno (Kolkata)' },
    { plate: 'HR26DQ5555', desc: 'Kia Seltos GTX (Gurugram)' },
    { plate: 'UP16AX8899', desc: 'Mahindra Scorpio-N (Noida)' }
  ];

  const handleSearchOrAdd = () => {
    const clean = rcInput.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (clean.length < 5) {
      setErrorMsg('Please enter a valid vehicle number (e.g. DL01AB1234)');
      return;
    }

    // Check if already in garage
    const found = existingVehicles.find(v => v.rcNumber.toUpperCase() === clean);
    if (found) {
      onSelectVehicle(found);
      onClose();
      return;
    }

    // Generate verified VAHAN record for this plate
    const newVehicle = generateVehicleFromRC(clean);
    onAddVehicle(newVehicle);
    onClose();
  };

  const handleQuickSelect = (plate: string) => {
    const found = existingVehicles.find(v => v.rcNumber === plate);
    if (found) {
      onSelectVehicle(found);
      onClose();
    } else {
      const generated = generateVehicleFromRC(plate);
      onAddVehicle(generated);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Vehicle RC & Challan Lookup</h4>
              <p className="text-[10px] text-slate-500 font-medium">MoRTH Parivahan National Registry</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-lg font-bold px-2 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Input Box */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 block">
            Enter Vehicle Registration Number:
          </label>
          <div className="relative">
            <input
              type="text"
              value={rcInput}
              onChange={e => {
                setRcInput(e.target.value.toUpperCase());
                setErrorMsg('');
              }}
              placeholder="e.g. DL01CA1234 or MH02EZ9988"
              className="w-full pl-4 pr-12 py-3 bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 rounded-2xl text-base font-mono font-extrabold text-indigo-900 placeholder-slate-400 uppercase tracking-widest focus:outline-none shadow-xs"
            />
            <button
              onClick={handleSearchOrAdd}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
          {errorMsg && (
            <div className="text-[11px] text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Saved Garage Quick Switcher */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Your Saved Vehicles ({existingVehicles.length})
          </span>
          <div className="space-y-1.5">
            {existingVehicles.map(v => {
              const { hasUrgentAlert, alerts } = getVehicleComplianceAlerts(v);
              const urgentAlert = alerts.find(a => a.status === 'EXPIRED' || a.status === 'CRITICAL' || a.status === 'WARNING');

              return (
                <button
                  key={v.rcNumber}
                  onClick={() => {
                    onSelectVehicle(v);
                    onClose();
                  }}
                  className="w-full p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-200/80 hover:border-indigo-200 flex items-center justify-between text-left transition-all cursor-pointer shadow-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-white border border-slate-200 text-indigo-600 shadow-2xs">
                      {v.vehicleType === 'BIKE' ? <Bike className="w-4 h-4" /> : <Car className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-xs text-slate-900">{v.rcNumber}</span>
                        {hasUrgentAlert && urgentAlert && (
                          <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold font-mono ${
                            urgentAlert.status === 'EXPIRED' 
                              ? 'bg-red-600 text-white animate-pulse' 
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}>
                            {urgentAlert.type === 'INSURANCE' ? 'Ins' : 'PUCC'} {urgentAlert.status === 'EXPIRED' ? 'Expired' : 'Expiring'}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">{v.makerModel}</div>
                    </div>
                  </div>
                  <div className="text-right text-[10px]">
                    <span className="text-emerald-700 font-bold block">Reg: {v.registrationDate}</span>
                    <span className="text-red-600 font-mono font-semibold">
                      {v.challans.filter(c => c.status === 'PENDING').length} Pending
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Preset Sample Indian Plates */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Sample Verification Vehicles
          </span>
          <div className="grid grid-cols-1 gap-1.5">
            {samplePlates.map(sample => (
              <button
                key={sample.plate}
                onClick={() => handleQuickSelect(sample.plate)}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/70 hover:border-indigo-200 flex items-center justify-between text-xs text-slate-700 transition-all cursor-pointer"
              >
                <span className="font-mono font-bold text-indigo-700">{sample.plate}</span>
                <span className="text-[10px] text-slate-500 font-medium">{sample.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
