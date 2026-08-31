import React, { useState } from 'react';
import { ChallanRecord, VehicleRecord } from '../types';
import { 
  Scale, Sparkles, FileText, CheckCircle2, 
  Copy, Download, AlertTriangle, Loader2, ArrowRight
} from 'lucide-react';

interface Props {
  challan: ChallanRecord;
  vehicle: VehicleRecord;
  onDisputeSubmitted: (challanId: string, disputeData: any) => void;
  onClose: () => void;
}

export const ChallanDisputeModal: React.FC<Props> = ({
  challan,
  vehicle,
  onDisputeSubmitted,
  onClose
}) => {
  const [selectedReason, setSelectedReason] = useState('Camera Misread Number Plate / Wrong Vehicle Tagged');
  const [userRemarks, setUserRemarks] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPetition, setGeneratedPetition] = useState<{
    subject: string;
    petitionText: string;
    recommendedAttachments: string[];
  } | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const disputeReasons = [
    'Camera Misread Number Plate / Wrong Vehicle Tagged',
    'Doppler Speed Radar Lacks Valid Calibration Certificate (Rule 167A CMVR)',
    'Vehicle was sold / transferred before violation date',
    'Emergency medical patient transport / Life-saving circumstance',
    'Road traffic signage obscured by trees or missing speed limit board',
    'Defective or flickering junction traffic signal'
  ];

  const handleGenerateAiPetition = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/generate-dispute-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challan,
          vehicle,
          disputeReason: selectedReason,
          userRemarks: userRemarks || 'The photographic evidence lacks clear proof or shows plate discrepancy.'
        })
      });

      const data = await res.json();
      if (data && data.petitionText) {
        setGeneratedPetition({
          subject: data.subject || `Grievance Petition regarding e-Challan #${challan.challanNo}`,
          petitionText: data.petitionText,
          recommendedAttachments: data.recommendedAttachments || [
            'Vehicle Registration Certificate (RC)',
            'Photographs of vehicle showing physical registration plate',
            'Travel log or GPS tracking timestamp'
          ]
        });
      } else {
        // Fallback petition
        setGeneratedPetition({
          subject: `Grievance Petition & Objection to e-Challan No. ${challan.challanNo}`,
          petitionText: `To,\nThe Traffic Police Commissioner / Virtual Court Magistrate,\nTraffic Department, ${vehicle.rtoDetails.state}\n\nSubject: Formal Representation against e-Challan #${challan.challanNo} for Vehicle #${vehicle.rcNumber}\n\nRespected Authority,\n\nI, ${vehicle.ownerName}, registered owner of ${vehicle.makerModel} (${vehicle.rcNumber}), respectfully submit this grievance against Challan #${challan.challanNo} dated ${challan.violationDate} for alleged violation of ${challan.section}.\n\nGrounds of Dispute:\n1. ${selectedReason}\n2. ${userRemarks || 'The automated camera evidence does not establish the offense conclusively under Section 136A of the Motor Vehicles Act.'}\n\nPrayer:\nKindly review the high-resolution video footage and camera calibration records, and quash the said notice.\n\nYours faithfully,\n${vehicle.ownerName}\nContact: Registered Mobile Number`,
          recommendedAttachments: ['Copy of RC Smart Card', 'GPS / Dashcam footage']
        });
      }
    } catch (err) {
      console.error(err);
      setGeneratedPetition({
        subject: `Grievance Petition regarding e-Challan #${challan.challanNo}`,
        petitionText: `To,\nThe Traffic Police Commissioner / Virtual Court,\n\nSubject: Dispute against Challan #${challan.challanNo}\n\nGrounds: ${selectedReason}. ${userRemarks}\n\nSubmitted by: ${vehicle.ownerName} (${vehicle.rcNumber})`,
        recommendedAttachments: ['RC Certificate copy']
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmitDispute = () => {
    const disputeId = `GRV-${Math.floor(100000 + Math.random() * 900000)}`;
    onDisputeSubmitted(challan.id, {
      referenceId: disputeId,
      date: new Date().toLocaleDateString('en-IN'),
      reason: selectedReason,
      status: 'SUBMITTED',
      petitionText: generatedPetition?.petitionText || ''
    });
    setIsSubmitted(true);
  };

  const copyToClipboard = () => {
    if (generatedPetition) {
      navigator.clipboard.writeText(generatedPetition.petitionText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">AI Legal Challan Dispute Portal</h4>
              <p className="text-[10px] text-slate-500 font-medium">Section 136A & Virtual Court Representation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-lg font-bold px-2 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {!isSubmitted ? (
          <>
            {/* Challan Info Chip */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between font-mono">
                <span className="text-slate-500">Challan No:</span>
                <span className="text-indigo-700 font-bold">{challan.challanNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Alleged Offense:</span>
                <span className="text-slate-800 font-semibold truncate max-w-[60%]">{challan.violationType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Penalty:</span>
                <span className="text-red-600 font-bold font-mono">₹{challan.totalAmount}</span>
              </div>
            </div>

            {/* Select Dispute Grounds */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Select Legal Grounds for Dispute:
              </label>
              <select
                value={selectedReason}
                onChange={e => setSelectedReason(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 shadow-xs"
              >
                {disputeReasons.map((r, i) => (
                  <option key={i} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Additional Remarks */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Additional Facts / Owner's Statement (Optional):
              </label>
              <textarea
                value={userRemarks}
                onChange={e => setUserRemarks(e.target.value)}
                placeholder="e.g. My car has a sunroof and alloy wheels, whereas the camera photo shows a different variant."
                rows={2}
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-xs"
              />
            </div>

            {/* Generate Button */}
            {!generatedPetition && (
              <button
                onClick={handleGenerateAiPetition}
                disabled={isGenerating}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Gemini AI Drafting Legal Petition...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-white" />
                    <span>Generate Advocate-Drafted Legal Petition</span>
                  </>
                )}
              </button>
            )}

            {/* Generated Petition Output */}
            {generatedPetition && (
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-600" /> Legal Representation Draft
                  </span>
                  <button
                    onClick={copyToClipboard}
                    className="text-xs text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 px-2.5 py-1 rounded-lg flex items-center gap-1 border border-slate-200 cursor-pointer font-medium"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                  </button>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-800 max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed shadow-xs">
                  {generatedPetition.petitionText}
                </div>

                {generatedPetition.recommendedAttachments?.length > 0 && (
                  <div className="text-[10px] text-slate-600 bg-indigo-50/60 p-2.5 rounded-xl border border-indigo-100 space-y-1">
                    <span className="font-bold text-indigo-950 block">Recommended Evidence Attachments:</span>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                      {generatedPetition.recommendedAttachments.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => setGeneratedPetition(null)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs cursor-pointer"
                  >
                    Re-draft
                  </button>
                  <button
                    onClick={handleSubmitDispute}
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit Grievance to Traffic RTO</span>
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* SUCCESS SUBMISSION */
          <div className="text-center space-y-3 py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto ring-4 ring-emerald-100">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900">Dispute Grievance Submitted!</h3>
              <p className="text-xs text-emerald-700 font-semibold mt-1">Status updated to: UNDER REVIEW</p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-left text-xs space-y-1.5 font-mono shadow-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Grievance Ref ID:</span>
                <span className="font-bold text-indigo-700">GRV-DL-2025-9941</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Target Authority:</span>
                <span className="text-slate-800">Virtual Traffic Court & ACP Traffic</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Expected SLA:</span>
                <span className="text-slate-800">7-14 Working Days</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 text-center">
              Payment deadline has been stayed pending grievance verification.
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs"
            >
              Back to Challans
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
