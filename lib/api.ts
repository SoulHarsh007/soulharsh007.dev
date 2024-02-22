import {IMonthlyMetricsResponse} from '@/types/types';

import {formatDate} from './utils';

export async function getMonthlyMetrics(startDate: Date, endDate: Date) {
  const {data} = (await fetch('https://api.cloudflare.com/client/v4/graphql', {
    body: JSON.stringify({
      query:
        '{viewer {zones(filter: { zoneTag: $zoneTag }) {httpRequests1dGroups(limit: 31 orderBy: [date_ASC] filter: { date_geq: $startDate, date_leq: $endDate }) {dimensions {date} sum {bytes cachedBytes requests cachedRequests}}}}}',
      variables: {
        endDate: formatDate(endDate),
        startDate: formatDate(startDate),
        zoneTag: process.env.CF_ZONE_TAG,
      },
    }),
    headers: {
      Authorization: `Bearer ${process.env.CF_API_TOKEN}`,
    },
    method: 'POST',
    next: {
      revalidate: 21600,
    },
  }).then(res => res.json())) as IMonthlyMetricsResponse;
  if (data?.viewer.zones[0]) {
    return data.viewer.zones[0].httpRequests1dGroups.map(x => ({
      ...x.dimensions,
      ...x.sum,
    }));
  }
  return [];
}
