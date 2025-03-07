'use server';

import {formatDate} from '@/lib/utils';
import {ICloudflareMetricsResponse, IMetricsTimeRange} from '@/types/types';

export async function getCloudflareMetrics(
  startDate: Date,
  endDate: Date,
  range: IMetricsTimeRange
) {
  const response = (await fetch(
    'https://api.cloudflare.com/client/v4/graphql',
    {
      body: JSON.stringify({
        query:
          '{viewer {zones(filter: { zoneTag: $zoneTag }) {httpRequests1dGroups(limit: $limit orderBy: [date_ASC] filter: { date_geq: $startDate, date_leq: $endDate }) {dimensions {date} sum {bytes cachedBytes requests cachedRequests}}}}}',
        variables: {
          endDate: formatDate(endDate),
          limit: range,
          startDate: formatDate(startDate),
          zoneTag: process.env.SITE_CF_ZONE_TAG,
        },
      }),
      headers: {
        Authorization: `Bearer ${process.env.SITE_CF_API_TOKEN}`,
      },
      method: 'POST',
      next: {
        revalidate: 21600,
      },
    }
  ).then(res => res.json())) as ICloudflareMetricsResponse;
  if (response.data?.viewer.zones[0]) {
    return response.data.viewer.zones[0].httpRequests1dGroups.map(x => ({
      ...x.dimensions,
      ...x.sum,
    }));
  }
  return [];
}
