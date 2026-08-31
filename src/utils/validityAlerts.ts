import { VehicleRecord } from '../types';

export interface ExpiryAlertItem {
  id: string;
  type: 'INSURANCE' | 'PUCC' | 'FITNESS';
  title: string;
  documentName: string;
  validTill: string;
  daysLeft: number;
  status: 'EXPIRED' | 'CRITICAL' | 'WARNING' | 'VALID' | 'EXEMPT';
  severity: 'danger' | 'warning' | 'info' | 'success';
  badgeLabel: string;
  penaltySection: string;
  fineAmount: number;
  policyOrCertNo: string;
  provider: string;
  description: string;
}

/**
 * Parses date string (e.g., "14-Sep-2025", "10-Jul-2025", "18-Oct-2026") into a Date object or calculates days
 */
export function calculateDaysRemaining(dateStr: string, fallbackDays?: number): number {
  if (!dateStr || dateStr.toUpperCase() === 'EXEMPT' || dateStr.toUpperCase() === 'LIFE TIME VALID') {
    return 9999;
  }

  if (typeof fallbackDays === 'number') {
    return fallbackDays;
  }

  try {
    const parts = dateStr.trim().split('-');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
      const monthIndex = monthNames.indexOf(parts[1].toLowerCase().slice(0, 3));
      const year = parseInt(parts[2], 10);

      if (!isNaN(day) && monthIndex !== -1 && !isNaN(year)) {
        const targetDate = new Date(year, monthIndex, day);
        const today = new Date();
        const diffTime = targetDate.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }
    }
  } catch (e) {
    console.error('Error parsing date for expiry:', dateStr, e);
  }

  return fallbackDays ?? 30;
}

/**
 * Evaluates Insurance Validity
 */
export function getInsuranceAlert(vehicle: VehicleRecord): ExpiryAlertItem {
  const daysLeft = vehicle.insuranceDetails.daysLeft !== undefined 
    ? vehicle.insuranceDetails.daysLeft 
    : calculateDaysRemaining(vehicle.insuranceDetails.validTill);

  let status: ExpiryAlertItem['status'] = 'VALID';
  let severity: ExpiryAlertItem['severity'] = 'success';
  let badgeLabel = `Active (${daysLeft} days left)`;

  if (daysLeft < 0) {
    status = 'EXPIRED';
    severity = 'danger';
    badgeLabel = `Expired ${Math.abs(daysLeft)}d ago`;
  } else if (daysLeft <= 7) {
    status = 'CRITICAL';
    severity = 'danger';
    badgeLabel = `Expires in ${daysLeft} days`;
  } else if (daysLeft <= 30) {
    status = 'WARNING';
    severity = 'warning';
    badgeLabel = `Expires in ${daysLeft} days`;
  }

  return {
    id: `INS-${vehicle.rcNumber}`,
    type: 'INSURANCE',
    title: status === 'EXPIRED' ? 'Motor Insurance Expired' : status === 'CRITICAL' || status === 'WARNING' ? 'Insurance Expiring Soon' : 'Insurance Valid',
    documentName: 'Motor Vehicle Insurance Policy',
    validTill: vehicle.insuranceDetails.validTill,
    daysLeft,
    status,
    severity,
    badgeLabel,
    penaltySection: 'Section 196 of MV Act 1988',
    fineAmount: 2000,
    policyOrCertNo: vehicle.insuranceDetails.policyNo,
    provider: vehicle.insuranceDetails.company,
    description: status === 'EXPIRED' 
      ? 'Driving an uninsured vehicle attracts ₹2,000 fine (₹4,000 on repeat) and up to 3 months imprisonment under Section 196.'
      : status === 'CRITICAL' || status === 'WARNING'
      ? `Your insurance policy expires in ${daysLeft} days. Renew immediately to maintain uninterrupted third-party and own-damage cover.`
      : `Policy is active and valid with ${vehicle.insuranceDetails.company}.`
  };
}

/**
 * Evaluates PUCC (Pollution) Validity
 */
export function getPuccAlert(vehicle: VehicleRecord): ExpiryAlertItem {
  if (vehicle.fuelType === 'Electric' || vehicle.puccDetails.validTill === 'EXEMPT') {
    return {
      id: `PUCC-${vehicle.rcNumber}`,
      type: 'PUCC',
      title: 'Pollution Certificate (Exempt)',
      documentName: 'Pollution Under Control Certificate (PUCC)',
      validTill: 'EXEMPT (Electric Vehicle)',
      daysLeft: 9999,
      status: 'EXEMPT',
      severity: 'info',
      badgeLabel: 'EV Exempt',
      penaltySection: 'Exempt under Central Motor Vehicles Rules',
      fineAmount: 0,
      policyOrCertNo: 'EXEMPT-EV-GREEN-PLATE',
      provider: 'National Clean Mobility Exemption',
      description: 'Pure battery electric vehicles (BEVs) are completely exempt from mandatory PUCC testing.'
    };
  }

  const daysLeft = vehicle.puccDetails.daysLeft !== undefined 
    ? vehicle.puccDetails.daysLeft 
    : calculateDaysRemaining(vehicle.puccDetails.validTill);

  let status: ExpiryAlertItem['status'] = 'VALID';
  let severity: ExpiryAlertItem['severity'] = 'success';
  let badgeLabel = `Active (${daysLeft} days left)`;

  if (daysLeft < 0) {
    status = 'EXPIRED';
    severity = 'danger';
    badgeLabel = `Expired ${Math.abs(daysLeft)}d ago`;
  } else if (daysLeft <= 7) {
    status = 'CRITICAL';
    severity = 'danger';
    badgeLabel = `Expires in ${daysLeft} days`;
  } else if (daysLeft <= 30) {
    status = 'WARNING';
    severity = 'warning';
    badgeLabel = `Expires in ${daysLeft} days`;
  }

  return {
    id: `PUCC-${vehicle.rcNumber}`,
    type: 'PUCC',
    title: status === 'EXPIRED' ? 'Pollution (PUCC) Expired' : status === 'CRITICAL' || status === 'WARNING' ? 'PUCC Expiring Soon' : 'PUCC Valid',
    documentName: 'Pollution Under Control Certificate (PUCC)',
    validTill: vehicle.puccDetails.validTill,
    daysLeft,
    status,
    severity,
    badgeLabel,
    penaltySection: 'Section 190(2) of MV Act 1988',
    fineAmount: 10000,
    policyOrCertNo: vehicle.puccDetails.puccNo,
    provider: vehicle.puccDetails.testCenter,
    description: status === 'EXPIRED'
      ? 'Driving without valid PUCC attracts a hefty ₹10,000 fine and up to 3 months driving licence disqualification under Section 190(2).'
      : status === 'CRITICAL' || status === 'WARNING'
      ? `Your emission test certificate expires in ${daysLeft} days. Visit any authorized petrol pump emission center.`
      : `PUCC is active and compliant with BS-6 emission standards.`
  };
}

/**
 * Returns all compliance alerts for a vehicle
 */
export function getVehicleComplianceAlerts(vehicle: VehicleRecord): {
  alerts: ExpiryAlertItem[];
  hasUrgentAlert: boolean;
  highestSeverity: 'danger' | 'warning' | 'info' | 'success';
  urgentCount: number;
} {
  const insurance = getInsuranceAlert(vehicle);
  const pucc = getPuccAlert(vehicle);
  const alerts = [insurance, pucc];

  const urgentAlerts = alerts.filter(a => a.status === 'EXPIRED' || a.status === 'CRITICAL' || a.status === 'WARNING');
  const hasUrgentAlert = urgentAlerts.length > 0;
  
  let highestSeverity: 'danger' | 'warning' | 'info' | 'success' = 'success';
  if (alerts.some(a => a.severity === 'danger')) {
    highestSeverity = 'danger';
  } else if (alerts.some(a => a.severity === 'warning')) {
    highestSeverity = 'warning';
  } else if (alerts.some(a => a.severity === 'info')) {
    highestSeverity = 'info';
  }

  return {
    alerts,
    hasUrgentAlert,
    highestSeverity,
    urgentCount: urgentAlerts.length
  };
}

/**
 * Request Web Push Notification Permission
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('This browser does not support desktop notifications.');
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.error('Error requesting notification permission:', err);
    return 'denied';
  }
}

/**
 * Triggers a real browser Local Notification
 */
export function sendBrowserNotification(title: string, options?: NotificationOptions): boolean {
  if (!('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    try {
      new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      });
      return true;
    } catch (e) {
      console.error('Error creating Notification instance:', e);
    }
  }

  return false;
}

/**
 * Dispatches expiry check and notification for active vehicle
 */
export async function notifyVehicleExpiry(
  vehicle: VehicleRecord,
  force: boolean = false
): Promise<{ sent: boolean; message: string }> {
  const { alerts, hasUrgentAlert } = getVehicleComplianceAlerts(vehicle);
  const urgent = alerts.filter(a => a.status === 'EXPIRED' || a.status === 'CRITICAL' || a.status === 'WARNING');

  if (!hasUrgentAlert && !force) {
    return { sent: false, message: 'All documents are currently valid and up to date.' };
  }

  // Request permission if not yet decided
  if ('Notification' in window && Notification.permission === 'default') {
    await Notification.requestPermission();
  }

  const primaryAlert = urgent[0] || alerts[0];
  const title = `⚠️ Parivahan Alert: ${vehicle.rcNumber}`;
  const body = urgent.length > 0
    ? `${primaryAlert.title} (${primaryAlert.badgeLabel}). Fine liability: ₹${primaryAlert.fineAmount.toLocaleString('en-IN')}. Tap to review details.`
    : `Compliance verification clean: Insurance & PUCC are valid for ${vehicle.rcNumber}.`;

  const sent = sendBrowserNotification(title, {
    body,
    tag: `parivahan-expiry-${vehicle.rcNumber}`,
    requireInteraction: true
  });

  return {
    sent,
    message: sent 
      ? `Local alert sent to your system notification tray for ${vehicle.rcNumber}.`
      : `Notification permission is ${('Notification' in window ? Notification.permission : 'unsupported')}. In-app reminder active.`
  };
}
