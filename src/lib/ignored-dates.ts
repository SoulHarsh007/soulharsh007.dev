import {prettyDateFormat} from './utils';

export const knownDDosDates: string[] = [];
export const prettyKnownDDosDates = knownDDosDates.map(date =>
  prettyDateFormat(new Date(date))
);

export const ignoreDates = [...knownDDosDates];
