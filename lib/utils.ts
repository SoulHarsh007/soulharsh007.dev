import prettyBytes from 'pretty-bytes';

export function bytesFormatter(bytes: number) {
  return prettyBytes(bytes);
}

export function cx(...args: ClassValue[]) {
  return twMerge(clsx(...args));
}

export function formatDate(date: Date) {
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}

// Tremor Raw cx [v0.0.0]

import clsx, {type ClassValue} from 'clsx';
import {twMerge} from 'tailwind-merge';

export function requestsFormatter(requests: number) {
  if (requests >= 1e6) {
    return (requests / 1e6).toFixed(1) + 'M';
  }
  if (requests >= 1e3) {
    return (requests / 1e3).toFixed(1) + 'K';
  }
  return requests.toString();
}

// Tremor Raw focusInput [v0.0.1]

export const focusInput = [
  // base
  'focus:ring-2',
  // ring color
  'focus:ring-blue-200 focus:dark:ring-blue-700/30',
  // border color
  'focus:border-blue-500 focus:dark:border-blue-700',
];

// Tremor Raw focusRing [v0.0.1]

export const focusRing = [
  // base
  'outline outline-offset-2 outline-0 focus-visible:outline-2',
  // outline color
  'outline-blue-500 dark:outline-blue-500',
];

// Tremor Raw hasErrorInput [v0.0.1]

export const hasErrorInput = [
  // base
  'ring-2',
  // border color
  'border-red-500 dark:border-red-700',
  // ring color
  'ring-red-200 dark:ring-red-700/30',
];
