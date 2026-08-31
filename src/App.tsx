/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { VehicleRecord, ChallanRecord } from './types';
import { INITIAL_VEHICLES, generateVehicleFromRC } from './data/mockVehicles';
import { AndroidFrame } from './components/AndroidFrame';
import { TopAppBar } from './components/TopAppBar';
import { RegistrationCertificateCard } from './components/RegistrationCertificateCard';
import { ChallanList } from './components/ChallanList';
import { RulesDirectoryView } from './components/RulesDirectoryView';
import { AiTrafficAdvisor } from './components/AiTrafficAdvisor';
import { PaymentModal } from './components/PaymentModal';
import { ChallanDisputeModal } from './components/ChallanDisputeModal';
import { AiAnalyzeModal } from './components/AiAnalyzeModal';
import { AddVehicleModal } from './components/AddVehicleModal';
import { PlateScannerModal } from './components/PlateScannerModal';
import { ReceiptModal } from './components/ReceiptModal';
import { ExpiryAlertsModal } from './components/ExpiryAlertsModal';

const LOCAL_STORAGE_KEY = 'PARIVAHAN_VEHICLES_DB_V1';

export default function App() {
  const [vehicles, setVehicles] = useState<VehicleRecord[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load local storage vehicles:', e);
    }
    return INITIAL_VEHICLES;
  });

  const [activeVehicleId, setActiveVehicleId] = useState<string>("DL01CA1234");
  const [activeTab, setActiveTab] = useState<'rc' | 'challans' | 'rules' | 'advisor'>('rc');

  // Modals state
  const [paymentModalChallans, setPaymentModalChallans] = useState<ChallanRecord[] | null>(null);
  const [receiptModalChallan, setReceiptModalChallan] = useState<ChallanRecord | null>(null);
  const [disputeModalChallan, setDisputeModalChallan] = useState<ChallanRecord[] | null>(null);
  const [aiAnalyzeChallan, setAiAnalyzeChallan] = useState<ChallanRecord | null>(null);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [showExpiryModal, setShowExpiryModal] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(vehicles));
    } catch (e) {
      console.error('Failed to save to local storage:', e);
    }
  }, [vehicles]);

  const activeVehicle = vehicles.find(v => v.rcNumber === activeVehicleId) || vehicles[0];

  const pendingChallansCount = activeVehicle.challans.filter(
    c => c.status === 'PENDING' || c.status === 'IN_COURT'
  ).length;

  const handlePaymentSuccess = (paidChallanIds: string[], txnDetails: { txnId: string; receiptNo: string }) => {
    setVehicles(prev =>
      prev.map(veh => {
        if (veh.rcNumber === activeVehicle.rcNumber) {
          const updatedChallans = veh.challans.map(c => {
            if (paidChallanIds.includes(c.id)) {
              return {
                ...c,
                status: 'PAID' as const,
                paymentDate: new Date().toLocaleString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                }),
                transactionId: txnDetails.txnId,
                receiptNo: txnDetails.receiptNo,
                paymentGateway: 'SBI e-Pay / UPI BharatPe'
              };
            }
            return c;
          });
          return { ...veh, challans: updatedChallans };
        }
        return veh;
      })
    );
  };

  const handleDisputeSubmitted = (challanId: string, disputeData: any) => {
    setVehicles(prev =>
      prev.map(veh => {
        if (veh.rcNumber === activeVehicle.rcNumber) {
          const updatedChallans = veh.challans.map(c => {
            if (c.id === challanId) {
              return {
                ...c,
                status: 'DISPUTED' as const,
                disputeHistory: disputeData
              };
            }
            return c;
          });
          return { ...veh, challans: updatedChallans };
        }
        return veh;
      })
    );
  };

  const handleAddVehicle = (newVehicle: VehicleRecord) => {
    setVehicles(prev => {
      const exists = prev.find(v => v.rcNumber === newVehicle.rcNumber);
      if (exists) return prev;
      return [newVehicle, ...prev];
    });
    setActiveVehicleId(newVehicle.rcNumber);
  };

  const handleSelectVehicle = (vehicle: VehicleRecord) => {
    setActiveVehicleId(vehicle.rcNumber);
  };

  const handlePlateDetected = (plate: string) => {
    const existing = vehicles.find(v => v.rcNumber === plate);
    if (existing) {
      setActiveVehicleId(existing.rcNumber);
    } else {
      const generated = generateVehicleFromRC(plate);
      handleAddVehicle(generated);
    }
    setActiveTab('rc');
  };

  const handleUpdateVehicle = (updated: VehicleRecord) => {
    setVehicles(prev => prev.map(v => v.rcNumber === updated.rcNumber ? updated : v));
  };

  return (
    <AndroidFrame
      activeTab={activeTab}
      onTabChange={tab => setActiveTab(tab as any)}
      pendingCount={pendingChallansCount}
    >
      {/* Sticky Top App Bar */}
      <TopAppBar
        activeVehicle={activeVehicle}
        onOpenVehicleModal={() => setShowAddVehicleModal(true)}
        onOpenScannerModal={() => setShowScannerModal(true)}
        onOpenExpiryModal={() => setShowExpiryModal(true)}
      />

      {/* Main Tab Views */}
      <div className="flex-1">
        {activeTab === 'rc' && (
          <RegistrationCertificateCard
            vehicle={activeVehicle}
            onViewChallans={() => setActiveTab('challans')}
            onOpenExpiryModal={() => setShowExpiryModal(true)}
          />
        )}

        {activeTab === 'challans' && (
          <ChallanList
            vehicle={activeVehicle}
            onPay={c => setPaymentModalChallans([c])}
            onPayAll={pendingList => setPaymentModalChallans(pendingList)}
            onDispute={c => setDisputeModalChallan([c])}
            onAiAnalyze={c => setAiAnalyzeChallan(c)}
            onViewReceipt={c => setReceiptModalChallan(c)}
            onOpenAdvisor={() => setActiveTab('advisor')}
          />
        )}

        {activeTab === 'rules' && <RulesDirectoryView />}

        {activeTab === 'advisor' && <AiTrafficAdvisor activeVehicle={activeVehicle} />}
      </div>

      {/* MODALS */}
      {showExpiryModal && (
        <ExpiryAlertsModal
          vehicle={activeVehicle}
          onUpdateVehicle={handleUpdateVehicle}
          onClose={() => setShowExpiryModal(false)}
        />
      )}
      {receiptModalChallan && (
        <ReceiptModal
          challan={receiptModalChallan}
          vehicle={activeVehicle}
          onClose={() => setReceiptModalChallan(null)}
        />
      )}

      {paymentModalChallans && (
        <PaymentModal
          challans={paymentModalChallans}
          vehicle={activeVehicle}
          onSuccess={handlePaymentSuccess}
          onClose={() => setPaymentModalChallans(null)}
        />
      )}

      {disputeModalChallan && disputeModalChallan.length > 0 && (
        <ChallanDisputeModal
          challan={disputeModalChallan[0]}
          vehicle={activeVehicle}
          onDisputeSubmitted={handleDisputeSubmitted}
          onClose={() => setDisputeModalChallan(null)}
        />
      )}

      {aiAnalyzeChallan && (
        <AiAnalyzeModal
          challan={aiAnalyzeChallan}
          vehicle={activeVehicle}
          onClose={() => setAiAnalyzeChallan(null)}
          onProceedToDispute={() => {
            setDisputeModalChallan([aiAnalyzeChallan]);
          }}
        />
      )}

      {showAddVehicleModal && (
        <AddVehicleModal
          existingVehicles={vehicles}
          onSelectVehicle={handleSelectVehicle}
          onAddVehicle={handleAddVehicle}
          onClose={() => setShowAddVehicleModal(false)}
        />
      )}

      {showScannerModal && (
        <PlateScannerModal
          onPlateDetected={handlePlateDetected}
          onClose={() => setShowScannerModal(false)}
        />
      )}
    </AndroidFrame>
  );
}
