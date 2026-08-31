import React, { useState } from 'react';
import { Camera, RefreshCw, CheckCircle2, Sparkles, AlertCircle, Scan } from 'lucide-react';

interface Props {
  onPlateDetected: (plate: string) => void;
  onClose: () => void;
}

export const PlateScannerModal: React.FC<Props> = ({ onPlateDetected, onClose }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [detectedPlate, setDetectedPlate] = useState<string | null>(null);

  const sampleScanScenarios = [
    { plate: 'DL01CA1234', title: 'Front White HSRP Plate (Delhi)', confidence: '99.8%' },
    { plate: 'MH02EZ9988', title: 'Rear Motorcycle Plate (Mumbai)', confidence: '98.5%' },
    { plate: 'KA03MM7711', title: 'Green EV Number Plate (Bengaluru)', confidence: '99.2%' }
  ];

  const handleSimulateScan = (plate: string) => {
    setIsScanning(true);
    setDetectedPlate(null);

    setTimeout(() => {
      setIsScanning(false);
      setDetectedPlate(plate);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Optical Plate OCR Scanner</h4>
              <p className="text-[10px] text-slate-500 font-medium">AI Automatic Number Plate Recognition (ANPR)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-lg font-bold px-2 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Viewfinder Graphic */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-900 border-2 border-slate-200 h-52 flex flex-col items-center justify-center p-4 shadow-inner">
          {/* Target Bounding Box */}
          <div className="w-4/5 h-24 border-2 border-dashed border-indigo-400 rounded-xl relative flex items-center justify-center bg-indigo-500/10">
            <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-indigo-400" />
            <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-indigo-400" />
            <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-indigo-400" />
            <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-indigo-400" />

            {isScanning ? (
              <div className="flex flex-col items-center gap-2">
                <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin" />
                <span className="text-[10px] text-indigo-300 font-mono font-bold animate-pulse">
                  SCANNING HIGH-SECURITY PLATE...
                </span>
              </div>
            ) : detectedPlate ? (
              <div className="flex flex-col items-center gap-1">
                <div className="bg-white text-slate-950 font-mono font-extrabold px-3 py-1 rounded-lg text-base tracking-widest border border-slate-400 shadow">
                  {detectedPlate}
                </div>
                <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> MATCH VERIFIED (99.8%)
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1 text-slate-400 text-center px-2">
                <Scan className="w-6 h-6 text-slate-400" />
                <span className="text-[10px] font-medium">Position registration plate inside frame</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick OCR Samples */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Select Plate to Simulate Camera Scan:
          </span>
          <div className="space-y-1.5">
            {sampleScanScenarios.map((sc, i) => (
              <button
                key={i}
                onClick={() => handleSimulateScan(sc.plate)}
                className="w-full p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-200/80 hover:border-indigo-200 flex items-center justify-between text-left text-xs transition-all cursor-pointer shadow-xs"
              >
                <div>
                  <span className="font-mono font-bold text-indigo-700 block">{sc.plate}</span>
                  <span className="text-[10px] text-slate-500 font-medium">{sc.title}</span>
                </div>
                <span className="text-[10px] text-emerald-700 font-mono font-bold">
                  ANPR {sc.confidence}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Detected Action */}
        {detectedPlate && (
          <button
            onClick={() => {
              onPlateDetected(detectedPlate);
              onClose();
            }}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Load RC & Challans for {detectedPlate}</span>
          </button>
        )}
      </div>
    </div>
  );
};
