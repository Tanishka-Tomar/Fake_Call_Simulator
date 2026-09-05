import type { PhoneStyle } from '../types';

/**
 * Gets initials from caller name (e.g. "Rahul Sharma" -> "RS")
 */
export function getInitials(name: string): string {
  if (!name.trim()) return 'FC';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Format phone duration into MM:SS format
 */
export function formatTimeMMSS(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format phone duration into human readable format (e.g., "1m 30s")
 */
export function formatHumanDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  if (secs === 0) return `${mins}m`;
  return `${mins}m ${secs}s`;
}

/**
 * Format phone number visually depending on phone style or raw format
 */
export function formatPhoneNumber(number: string, style?: PhoneStyle): string {
  if (!number) return '';
  const cleaned = number.trim();
  
  // If user already formatted it with spaces or dashes, preserve their preference
  if (/[-\s()]/.test(cleaned)) {
    return cleaned;
  }
  
  // Otherwise, format basic 10-digit or international numbers
  const digits = cleaned.replace(/\D/g, '');
  
  if (digits.length === 10) {
    if (style === 'apple') {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    } else if (style === 'samsung') {
      return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    }
    return `${digits.slice(0, 5)} ${digits.slice(5)}`;
  } else if (digits.length === 12 && digits.startsWith('91')) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  } else if (digits.length === 11 && digits.startsWith('1')) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  
  return cleaned;
}

/**
 * Format byte size into human readable string
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
