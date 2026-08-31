import { VehicleRecord, TrafficRule, LokAdalatEvent } from '../types';

export const INITIAL_VEHICLES: VehicleRecord[] = [
  {
    rcNumber: "DL01CA1234",
    ownerName: "Biswajit Dutta",
    maskedOwnerName: "B*******t D***a",
    fatherName: "Subhash Dutta",
    ownershipSerial: "1st Owner",
    registrationDate: "14-Mar-2021",
    regAge: "4 Years, 5 Months",
    fitnessValidUpto: "13-Mar-2036",
    vehicleClass: "Motor Car (LMV)",
    fuelType: "Petrol",
    maker: "Hyundai Motor India Ltd",
    model: "Creta SX(O) 1.5 MPI",
    makerModel: "Hyundai Creta SX(O) 1.5 Petrol",
    vehicleType: "CAR",
    color: "Polar White",
    bodyType: "SUV / Sedan",
    engineNo: "G4FLM91048**",
    chassisNo: "MALC381CLPM91024**",
    seatingCapacity: 5,
    unladenWeight: "1265 kg",
    cubicCapacity: "1497 cc",
    emissionNorm: "BHARAT STAGE VI (BS-6)",
    
    insuranceDetails: {
      company: "HDFC ERGO General Insurance Co. Ltd",
      policyNo: "2311/20098492/00/000",
      validTill: "18-Oct-2026",
      status: "ACTIVE",
      daysLeft: 412
    },
    
    puccDetails: {
      puccNo: "DL01PUC889124",
      validTill: "28-Nov-2025",
      status: "ACTIVE",
      daysLeft: 88,
      testCenter: "HPCL Petrol Pump, Mall Road, North Delhi"
    },
    
    taxDetails: {
      taxStatus: "LTT - Life Time Tax",
      paidUpto: "Life Time Valid",
      receiptNo: "DL-TAX-2021-994821"
    },
    
    rtoDetails: {
      rtoCode: "DL-01",
      rtoName: "Mall Road Regional Transport Office, Civil Lines",
      state: "Delhi NCR",
      address: "Under Hill Road, Civil Lines, North Delhi",
      pinCode: "110054"
    },
    
    hypothecation: {
      isFinanced: true,
      bankName: "HDFC Bank Ltd - Auto Loan Division"
    },
    
    blacklistStatus: "CHALLAN_ALERT",
    hsrpStatus: "AFFIXED",
    fastagStatus: "ACTIVE",
    
    challans: [
      {
        id: "CH-DL-2025-90142",
        challanNo: "DL910245202501021430",
        vehicleNo: "DL01CA1234",
        violationDate: "12-Jan-2025, 04:32 PM",
        violationType: "Exceeding Prescribed Speed Limit (Over-speeding)",
        section: "Sec 183(1) of Motor Vehicles Act 1988",
        fineAmount: 2000,
        lateFee: 0,
        totalAmount: 2000,
        status: "PENDING",
        location: "NH-44 Outer Ring Road, Near Mukarba Chowk Flyover, North Delhi",
        state: "Delhi",
        officerOrSystem: "Automated Traffic Enforcement Camera (ATEC) & ACP Traffic",
        cameraDetails: {
          cameraId: "CAM-SPD-ORR-084",
          type: "3D Doppler Radar ANPR Camera",
          recordedSpeed: "79 km/h (Limit: 50 km/h)",
          speedLimit: "50 km/h",
          capturedPlateConfidence: "99.8%",
          laneNumber: "Lane 2 (Fast Track)",
          gpsCoordinates: "28.7423° N, 77.1645° E"
        },
        evidenceImage: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80"
      },
      {
        id: "CH-DL-2024-44109",
        challanNo: "DL440912202409180915",
        vehicleNo: "DL01CA1234",
        violationDate: "18-Sep-2024, 09:15 AM",
        violationType: "Violation of Stop Line / Zebra Crossing at Traffic Light",
        section: "Sec 177 & Sec 119/177 of MV Act 1988",
        fineAmount: 500,
        lateFee: 0,
        totalAmount: 500,
        status: "PAID",
        location: "Connaught Place Radial Road 4, Barakhamba Crossing",
        state: "Delhi",
        officerOrSystem: "RLVD Junction Smart Camera #14",
        cameraDetails: {
          cameraId: "CAM-RLVD-CP-14",
          type: "Red Light & Stop Line Violation Detection (RLVD)",
          capturedPlateConfidence: "98.7%",
          laneNumber: "Left Turn Bay",
          gpsCoordinates: "28.6289° N, 77.2219° E"
        },
        evidenceImage: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80",
        paymentDate: "20-Sep-2024, 11:20 AM",
        transactionId: "TXN_PARIVAHAN_994810293",
        receiptNo: "REC-DL-2024-904128",
        paymentGateway: "SBI e-Pay / UPI BharatPe"
      }
    ]
  },
  {
    rcNumber: "MH02EZ9988",
    ownerName: "Aarav Deshmukh",
    maskedOwnerName: "A***v D*******h",
    fatherName: "Girish Deshmukh",
    ownershipSerial: "1st Owner",
    registrationDate: "08-Oct-2018",
    regAge: "6 Years, 10 Months",
    fitnessValidUpto: "07-Oct-2033",
    vehicleClass: "Two Wheeler (M-Cycle/Scooter)",
    fuelType: "Petrol",
    maker: "Royal Enfield (Eicher Motors)",
    model: "Classic 350 Gunmetal Grey",
    makerModel: "Royal Enfield Classic 350 Dual Channel ABS",
    vehicleType: "BIKE",
    color: "Gunmetal Grey",
    bodyType: "Motorcycle",
    engineNo: "U3S5F10928**",
    chassisNo: "ME3U3S5F109281**",
    seatingCapacity: 2,
    unladenWeight: "195 kg",
    cubicCapacity: "349 cc",
    emissionNorm: "BHARAT STAGE IV (BS-4)",
    
    insuranceDetails: {
      company: "ICICI Lombard General Insurance",
      policyNo: "3001/99248102/00/000",
      validTill: "14-Sep-2025",
      status: "ACTIVE",
      daysLeft: 14,
      
    },
    
    puccDetails: {
      puccNo: "MH02PUC441029",
      validTill: "10-Jul-2025",
      status: "EXPIRED",
      daysLeft: -52,
      testCenter: "Bharat Petroleum Andheri West"
    },
    
    taxDetails: {
      taxStatus: "LTT - One Time Tax",
      paidUpto: "Life Time Valid",
      receiptNo: "MH-TAX-2018-441829"
    },
    
    rtoDetails: {
      rtoCode: "MH-02",
      rtoName: "Andheri Regional Transport Office, Mumbai West",
      state: "Maharashtra",
      address: "D-111, RTO Road, 4 Bungalows, Andheri West, Mumbai",
      pinCode: "400053"
    },
    
    hypothecation: {
      isFinanced: false
    },
    
    blacklistStatus: "CLEAN",
    hsrpStatus: "AFFIXED",
    fastagStatus: "ACTIVE",
    
    challans: [
      {
        id: "CH-MH-2025-10294",
        challanNo: "MH020918202502101130",
        vehicleNo: "MH02EZ9988",
        violationDate: "10-Feb-2025, 11:30 AM",
        violationType: "Riding Two-Wheeler Without Protective Headgear (No Helmet)",
        section: "Sec 194D of Motor Vehicles Act 1988",
        fineAmount: 1000,
        lateFee: 0,
        totalAmount: 1000,
        status: "PENDING",
        location: "Western Express Highway, Near Goregaon Hub Mall Junction",
        state: "Maharashtra",
        officerOrSystem: "Mumbai Traffic Police AI ANPR Cam #89",
        cameraDetails: {
          cameraId: "CAM-WEH-GOR-89",
          type: "AI Helmet & Pillion Detection Camera",
          capturedPlateConfidence: "99.1%",
          laneNumber: "Two Wheeler Left Lane",
          gpsCoordinates: "19.1663° N, 72.8526° E"
        },
        evidenceImage: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop&q=80"
      },
      {
        id: "CH-MH-2024-88120",
        challanNo: "MH020412202410141645",
        vehicleNo: "MH02EZ9988",
        violationDate: "14-Oct-2024, 04:45 PM",
        violationType: "Driving Without Valid Pollution Under Control Certificate (PUCC)",
        section: "Sec 190(2) of Motor Vehicles Act 1988",
        fineAmount: 2000,
        lateFee: 0,
        totalAmount: 2000,
        status: "IN_COURT",
        location: "SV Road, Bandra West Police Check Post",
        state: "Maharashtra",
        officerOrSystem: "Sub-Inspector K. Shinde (Traffic Branch)",
        cameraDetails: {
          cameraId: "E-CHALLAN-TAB-774",
          type: "Handheld Parivahan Traffic POS Terminal",
          capturedPlateConfidence: "100%",
          gpsCoordinates: "19.0596° N, 72.8295° E"
        },
        evidenceImage: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&auto=format&fit=crop&q=80",
        courtDetails: {
          courtName: "Metropolitan Magistrate Court #32, Bandra Mumbai",
          hearingDate: "25-Mar-2025",
          noticeNo: "VC-MH-2024-88412",
          magistrateName: "Metropolitan Magistrate S. Patil"
        }
      }
    ]
  },
  {
    rcNumber: "KA03MM7711",
    ownerName: "Priya Sundaram",
    maskedOwnerName: "P***a S******m",
    fatherName: "R. Sundaram",
    ownershipSerial: "1st Owner",
    registrationDate: "22-Jul-2022",
    regAge: "3 Years, 1 Month",
    fitnessValidUpto: "21-Jul-2037",
    vehicleClass: "Motor Car (LMV / Electric)",
    fuelType: "Electric",
    maker: "Tata Motors Passenger Vehicles Ltd",
    model: "Nexon EV Max XZ+ Lux",
    makerModel: "Tata Nexon EV Max Long Range",
    vehicleType: "CAR",
    color: "Intensi-Teal",
    bodyType: "Electric Compact SUV",
    engineNo: "EVDRIVE99102**",
    chassisNo: "MAT612981NLP910**",
    seatingCapacity: 5,
    unladenWeight: "1400 kg",
    cubicCapacity: "Electric Motor (40.5 kWh)",
    emissionNorm: "ZERO EMISSION (EV)",
    
    insuranceDetails: {
      company: "Bajaj Allianz General Insurance",
      policyNo: "OG-23-1901-1801-00009182",
      validTill: "19-Jul-2026",
      status: "ACTIVE",
      daysLeft: 322
    },
    
    puccDetails: {
      puccNo: "EXEMPT-EV-GREEN-PLATE",
      validTill: "EXEMPT",
      status: "ACTIVE",
      daysLeft: 9999,
      testCenter: "Electric Vehicle Green Registration"
    },
    
    taxDetails: {
      taxStatus: "Exempted / Zero Road Tax (Karnataka EV Policy)",
      paidUpto: "Life Time Valid",
      receiptNo: "KA-EV-TAX-009124"
    },
    
    rtoDetails: {
      rtoCode: "KA-03",
      rtoName: "Indiranagar Regional Transport Office, Bengaluru East",
      state: "Karnataka",
      address: "Binnamangala 2nd Stage, Indiranagar, Bengaluru",
      pinCode: "560038"
    },
    
    hypothecation: {
      isFinanced: false
    },
    
    blacklistStatus: "CLEAN",
    hsrpStatus: "AFFIXED",
    fastagStatus: "ACTIVE",
    
    challans: [
      {
        id: "CH-KA-2025-33918",
        challanNo: "KA030119202501150820",
        vehicleNo: "KA03MM7711",
        violationDate: "15-Jan-2025, 08:20 AM",
        violationType: "Driving in Wrong Direction / One-Way Lane Violation",
        section: "Sec 184 & Sec 177 of Motor Vehicles Act",
        fineAmount: 1500,
        lateFee: 0,
        totalAmount: 1500,
        status: "PENDING",
        location: "100 Feet Road, Near 12th Main Junction, Indiranagar, Bengaluru",
        state: "Karnataka",
        officerOrSystem: "BTP Smart City AI Traffic Cam #41",
        cameraDetails: {
          cameraId: "CAM-BTP-IND-41",
          type: "Directional Flow Sensor & Plate Reader",
          capturedPlateConfidence: "99.5%",
          laneNumber: "Northbound Contraflow",
          gpsCoordinates: "12.9784° N, 77.6408° E"
        },
        evidenceImage: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&auto=format&fit=crop&q=80"
      },
      {
        id: "CH-KA-2024-11802",
        challanNo: "KA030810202408121400",
        vehicleNo: "KA03MM7711",
        violationDate: "12-Aug-2024, 02:00 PM",
        violationType: "Unauthorized Parking in No-Parking Zone / Towing Penalty",
        section: "Sec 122/177 & Sec 177 of Motor Vehicles Act 1988",
        fineAmount: 1000,
        lateFee: 0,
        totalAmount: 1000,
        status: "PAID",
        location: "MG Road Commercial Corridor, Near Brigade Road Junction, Bengaluru",
        state: "Karnataka",
        officerOrSystem: "BTP Enforcement Patrol Unit #08",
        cameraDetails: {
          cameraId: "CAM-BTP-MGR-08",
          type: "Static Optical Enforcement PTZ Camera",
          capturedPlateConfidence: "99.2%",
          laneNumber: "Curb Bay 1",
          gpsCoordinates: "12.9734° N, 77.6074° E"
        },
        evidenceImage: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80",
        paymentDate: "13-Aug-2024, 05:40 PM",
        transactionId: "TXN_BTP_KA_88491024",
        receiptNo: "REC-KA-2024-118092",
        paymentGateway: "Karnataka One / SBI Bharat BillPay"
      }
    ]
  }
];

export const INDIAN_TRAFFIC_RULES: TrafficRule[] = [
  {
    id: "RULE-1",
    section: "Section 183(1)",
    violation: "Exceeding Prescribed Speed Limit (LMV / Light Motor Vehicle)",
    category: "SPEED",
    firstOffenseFine: 2000,
    repeatOffenseFine: 4000,
    penaltyPoints: 2,
    courtCompoundable: true,
    description: "Driving a motor car above the posted speed limit monitored via Doppler radar or speed cameras."
  },
  {
    id: "RULE-2",
    section: "Section 184",
    violation: "Dangerous / Rash Driving or Jumping Red Lights",
    category: "SAFETY",
    firstOffenseFine: 5000,
    repeatOffenseFine: 10000,
    penaltyPoints: 3,
    courtCompoundable: false,
    imprisonment: "Up to 6 months - 1 year",
    description: "Driving in a manner dangerous to the public, including crossing red signals or erratic lane changes."
  },
  {
    id: "RULE-3",
    section: "Section 194D",
    violation: "Riding Two-Wheeler Without Helmet (Rider / Pillion)",
    category: "SAFETY",
    firstOffenseFine: 1000,
    repeatOffenseFine: 1000,
    penaltyPoints: 1,
    courtCompoundable: true,
    imprisonment: "3 months DL disqualification",
    description: "Failure to wear an approved BIS-standard protective helmet while riding a motorcycle/scooter."
  },
  {
    id: "RULE-4",
    section: "Section 194B",
    violation: "Driving Without Wearing Seat Belt (Driver / Passengers)",
    category: "SAFETY",
    firstOffenseFine: 1000,
    repeatOffenseFine: 1000,
    penaltyPoints: 1,
    courtCompoundable: true,
    description: "Operating a four-wheeler without fastening safety seatbelts for driver or front/rear occupants."
  },
  {
    id: "RULE-5",
    section: "Section 190(2)",
    violation: "Driving Without Valid Pollution Certificate (PUCC)",
    category: "DOCUMENT",
    firstOffenseFine: 10000,
    repeatOffenseFine: 10000,
    penaltyPoints: 2,
    courtCompoundable: true,
    imprisonment: "Up to 3 months imprisonment or community service",
    description: "Operating a motor vehicle without a valid Pollution Under Control Certificate."
  },
  {
    id: "RULE-6",
    section: "Section 196",
    violation: "Driving Without Valid Third-Party Motor Insurance",
    category: "DOCUMENT",
    firstOffenseFine: 2000,
    repeatOffenseFine: 4000,
    penaltyPoints: 2,
    courtCompoundable: true,
    imprisonment: "Up to 3 months imprisonment",
    description: "Driving an uninsured vehicle on public roads, compromising third-party liability."
  },
  {
    id: "RULE-7",
    section: "Section 185",
    violation: "Drunk Driving (Blood Alcohol > 30mg per 100ml)",
    category: "DUI",
    firstOffenseFine: 10000,
    repeatOffenseFine: 15000,
    penaltyPoints: 4,
    courtCompoundable: false,
    imprisonment: "Up to 6 months (1st offense), up to 2 years (2nd offense)",
    description: "Operating any motor vehicle under the influence of alcohol or narcotics."
  },
  {
    id: "RULE-8",
    section: "Section 177 / 179",
    violation: "Unauthorized Parking / Obstruction of Traffic Flow",
    category: "PARKING",
    firstOffenseFine: 500,
    repeatOffenseFine: 1500,
    penaltyPoints: 0,
    courtCompoundable: true,
    description: "Parking in No-Parking zones, blocking emergency lanes, or obstructing pedestrian footpaths."
  }
];

export const LOK_ADALAT_DATA: LokAdalatEvent = {
  id: "LOK-2025-Q1",
  title: "National Lok Adalat - Traffic Challan Settlement Drive",
  date: "14-September-2025 (Sunday)",
  location: "All District Courts & Virtual Traffic Courts Across India",
  maxWaiverPercent: 75,
  eligibleViolations: [
    "Red Light Jumping (Section 184 / 119)",
    "Speeding (Section 183)",
    "No Helmet / No Seatbelt (Sec 194B/194D)",
    "Improper Parking (Sec 122/177)",
    "Lane Discipline & Stop Line Violations"
  ],
  bookingStatus: "OPEN",
  tokenSlotsAvailable: 420
};

// Helper to generate dynamic vehicle data if user enters an unlisted RC number
export function generateVehicleFromRC(rcInput: string): VehicleRecord {
  const clean = rcInput.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const stateCode = clean.slice(0, 2);
  const rtoNum = clean.slice(2, 4) || "01";
  
  const stateMap: Record<string, { state: string, city: string }> = {
    "DL": { state: "Delhi NCR", city: "Delhi North" },
    "MH": { state: "Maharashtra", city: "Mumbai / Pune" },
    "KA": { state: "Karnataka", city: "Bengaluru" },
    "WB": { state: "West Bengal", city: "Kolkata" },
    "TN": { state: "Tamil Nadu", city: "Chennai" },
    "TS": { state: "Telangana", city: "Hyderabad" },
    "UP": { state: "Uttar Pradesh", city: "Noida / Lucknow" },
    "HR": { state: "Haryana", city: "Gurugram / Faridabad" },
    "GJ": { state: "Gujarat", city: "Ahmedabad" },
    "RJ": { state: "Rajasthan", city: "Jaipur" },
    "KL": { state: "Kerala", city: "Kochi / Trivandrum" },
    "PB": { state: "Punjab", city: "Ludhiana / Mohali" },
    "CH": { state: "Chandigarh", city: "Chandigarh City" },
    "AP": { state: "Andhra Pradesh", city: "Visakhapatnam" },
    "BR": { state: "Bihar", city: "Patna" }
  };

  const stateInfo = stateMap[stateCode] || { state: "India (Parivahan VAHAN)", city: "Central Regional Transport" };

  return {
    rcNumber: clean,
    ownerName: "Verified Vehicle Owner",
    maskedOwnerName: "V******d O***r",
    fatherName: "N.A. (VAHAN Registry)",
    ownershipSerial: "1st Owner",
    registrationDate: "10-Jun-2021",
    regAge: "4 Years, 2 Months",
    fitnessValidUpto: "09-Jun-2036",
    vehicleClass: "Motor Car (LMV)",
    fuelType: "Petrol",
    maker: "Maruti Suzuki India Ltd",
    model: "Swift ZXI 1.2L DualJet",
    makerModel: "Maruti Suzuki Swift ZXI Plus",
    vehicleType: "CAR",
    color: "Metallic Magma Grey",
    bodyType: "Hatchback",
    engineNo: "K12M98412**",
    chassisNo: "MBHFE9819NL9910**",
    seatingCapacity: 5,
    unladenWeight: "875 kg",
    cubicCapacity: "1197 cc",
    emissionNorm: "BHARAT STAGE VI (BS-6)",
    
    insuranceDetails: {
      company: "New India Assurance Co. Ltd",
      policyNo: "11090031240100091823",
      validTill: "08-Jun-2026",
      status: "ACTIVE",
      daysLeft: 281
    },
    
    puccDetails: {
      puccNo: `${clean}PUC8921`,
      validTill: "15-Dec-2025",
      status: "ACTIVE",
      daysLeft: 105,
      testCenter: "National Auto Testing Station"
    },
    
    taxDetails: {
      taxStatus: "LTT - One Time Lifetime Tax",
      paidUpto: "Life Time Valid",
      receiptNo: `${stateCode}-TAX-2021-9921`
    },
    
    rtoDetails: {
      rtoCode: `${stateCode}-${rtoNum}`,
      rtoName: `${stateInfo.city} Regional Transport Authority`,
      state: stateInfo.state,
      address: `RTO Complex, ${stateInfo.city}`,
      pinCode: "110001"
    },
    
    hypothecation: {
      isFinanced: false
    },
    
    blacklistStatus: "CLEAN",
    hsrpStatus: "AFFIXED",
    fastagStatus: "ACTIVE",
    
    challans: [
      {
        id: `CH-${stateCode}-2025-001`,
        challanNo: `${clean}202501091240`,
        vehicleNo: clean,
        violationDate: "09-Jan-2025, 02:15 PM",
        violationType: "Exceeding Prescribed Speed Limit (Sec 183(1))",
        section: "Section 183(1) Motor Vehicles Act",
        fineAmount: 2000,
        lateFee: 0,
        totalAmount: 2000,
        status: "PENDING",
        location: `Main Express Corridor, Near ${stateInfo.city} Bypass`,
        state: stateInfo.state,
        officerOrSystem: "Smart City Electronic ANPR Radar",
        cameraDetails: {
          cameraId: `CAM-${stateCode}-RAD-101`,
          type: "High Speed ANPR Doppler System",
          recordedSpeed: "76 km/h (Limit 50 km/h)",
          speedLimit: "50 km/h",
          capturedPlateConfidence: "99.4%",
          laneNumber: "Lane 1",
          gpsCoordinates: "28.6139° N, 77.2090° E"
        },
        evidenceImage: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80"
      }
    ]
  };
}
