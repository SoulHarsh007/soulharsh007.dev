import {prettyDateFormat} from './utils';

export const knownCFBugDates = ['2025-03-02', '2025-03-03'];
export const prettyKnownCFBugDates = knownCFBugDates.map(date =>
  prettyDateFormat(new Date(date))
);

export const knownDDosDates = [
  '2025-03-05',
  '2025-03-06',
  '2025-03-07',
  '2025-03-13',
  '2025-03-14',
];
export const prettyKnownDDosDates = knownDDosDates.map(date =>
  prettyDateFormat(new Date(date))
);

export const ignoreDates = [...knownCFBugDates, ...knownDDosDates];
