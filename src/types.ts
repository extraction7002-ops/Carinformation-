export type ChallanStatus = 'PENDING' | 'PAID' | 'IN_COURT' | 'DISPUTED' | 'DISPOSED';

export interface CameraEvidence {
  cameraId: string;
  type: string;
  recordedSpeed?: string;
  speedLimit?: string;
  capturedPlateConfidence: string;
  laneNumber?: string;
  gpsCoordinates?: string;
}

export interface ChallanRecord {
  id: string;
  challanNo: string;
  vehicleNo: string;
  violationDate: string; // e.g. "18-Jan-2025, 04:35 PM"
  violationType: string; // e.g. "Over-speeding / Exceeding speed limit"
  section: string; // e.g. "Sec 183(1) MV Act 1988"
  fineAmount: number;
  lateFee: number;
  totalAmount: number;
  status: ChallanStatus;
  location: string;
  state: string;
  officerOrSystem: string;
  cameraDetails: CameraEvidence;
  evidenceImage: string;
  paymentDate?: string;
  transactionId?: string;
  receiptNo?: string;
  paymentGateway?: string;
  courtDetails?: {
    courtName: string;
    hearingDate: string;
    noticeNo: string;
    magistrateName?: string;
  };
  disputeHistory?: {
    date: string;
    reason: string;
    status: 'SUBMITTED' | 'UNDER_REVIEW' | 'ACCEPTED' | 'REJECTED';
    petitionText: string;
    referenceId: string;
  };
}

export interface VehicleRecord {
  rcNumber: string; // e.g. "DL01CA1234"
  ownerName: string; // e.g. "Vikram Malhotra"
  maskedOwnerName: string; // e.g. "V****m M******a"
  fatherName: string; // e.g. "Sanjay Malhotra"
  ownershipSerial: string; // "1st Owner"
  registrationDate: string; // "14-Mar-2019"
  regAge: string; // "6 Years, 5 Months"
  fitnessValidUpto: string; // "13-Mar-2034"
  vehicleClass: string; // "Motor Car (LMV)"
  fuelType: 'Petrol' | 'Diesel' | 'CNG' | 'Electric' | 'Hybrid';
  maker: string; // "Hyundai Motor India Ltd"
  model: string; // "Creta SX 1.5 MPI"
  makerModel: string; // "Hyundai Creta SX (O) 1.5 Petrol"
  vehicleType: 'CAR' | 'BIKE' | 'COMMERCIAL' | 'SCOOTER' | 'BUS';
  color: string;
  bodyType: string;
  engineNo: string; // masked
  chassisNo: string; // masked
  seatingCapacity: number;
  unladenWeight: string;
  cubicCapacity: string;
  emissionNorm: string; // "BHARAT STAGE VI (BS-6)"
  
  insuranceDetails: {
    company: string;
    policyNo: string;
    validTill: string;
    status: 'ACTIVE' | 'EXPIRED' | 'EXPIRING_SOON';
    daysLeft: number;
  };
  
  puccDetails: {
    puccNo: string;
    validTill: string;
    status: 'ACTIVE' | 'EXPIRED';
    daysLeft: number;
    testCenter: string;
  };
  
  taxDetails: {
    taxStatus: string;
    paidUpto: string;
    receiptNo: string;
  };
  
  rtoDetails: {
    rtoCode: string;
    rtoName: string;
    state: string;
    address: string;
    pinCode: string;
  };
  
  hypothecation: {
    isFinanced: boolean;
    bankName?: string;
  };
  
  blacklistStatus: 'CLEAN' | 'CHALLAN_ALERT' | 'IMPOUND_ALERT';
  hsrpStatus: 'AFFIXED' | 'PENDING';
  fastagStatus: 'ACTIVE' | 'LOW_BALANCE' | 'INACTIVE';
  
  challans: ChallanRecord[];
}

export interface TrafficRule {
  id: string;
  section: string;
  violation: string;
  category: 'SPEED' | 'SIGNAL' | 'DOCUMENT' | 'SAFETY' | 'PARKING' | 'DUI';
  firstOffenseFine: number;
  repeatOffenseFine: number;
  penaltyPoints: number;
  courtCompoundable: boolean;
  imprisonment?: string;
  description: string;
}

export interface LokAdalatEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  maxWaiverPercent: number;
  eligibleViolations: string[];
  bookingStatus: 'OPEN' | 'CLOSING_SOON' | 'FULL';
  tokenSlotsAvailable: number;
}
