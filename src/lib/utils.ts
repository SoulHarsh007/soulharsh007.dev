import {type ClassValue, clsx} from 'clsx';
import prettyBytes from 'pretty-bytes';
import {twMerge} from 'tailwind-merge';

export function bytesFormatter(bytes: number) {
  return prettyBytes(bytes, {
    locale: true,
  });
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractMonth(dateStr: string) {
  const parts = dateStr.split('-');
  if (parts.length !== 3) {
    return '';
  }
  const month = Number.parseInt(parts[1], 10);
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return monthNames[month - 1] || '';
}

export function formatDate(date: Date) {
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}

export function prettyDateFormat(date: Date) {
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function requestsFormatter(requests: number) {
  if (requests >= 1e12) {
    return (requests / 1e12).toFixed(1) + ' T';
  } else if (requests >= 1e9) {
    return (requests / 1e9).toFixed(1) + ' B';
  } else if (requests >= 1e6) {
    return (requests / 1e6).toFixed(1) + ' M';
  } else if (requests >= 1e3) {
    return (requests / 1e3).toFixed(1) + ' K';
  }
  return requests.toString();
}
