'use server';

import {
  CloudflareMetricsRequest,
  CloudflareMetricsRequestSchema,
  CloudflareMetricsResponseSchema,
} from '@/lib/types';
import {formatDate} from '@/lib/utils';

export async function getCloudflareMetrics(request: CloudflareMetricsRequest) {
  console.log(
    `Fetching CF Stats for request: ${JSON.stringify(request, null, 2)} @ ${new Date().toUTCString()}`
  );
  const parsedRequest = CloudflareMetricsRequestSchema.safeParse(request);
  if (!parsedRequest.success) {
    console.error(
      'Error parsing Cloudflare metrics request:',
      parsedRequest.error
    );
    return [];
  }
  const {endDate, range, startDate} = parsedRequest.data;
  const response = await fetch('https://api.cloudflare.com/client/v4/graphql', {
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
  }).then(res => res.json());
  const parsed = CloudflareMetricsResponseSchema.safeParse(response);
  if (!parsed.success) {
    console.error('Error parsing Cloudflare metrics response:', parsed.error);
    return [];
  }

  return parsed.data.data.viewer.zones[0].httpRequests1dGroups.map(x => ({
    ...x.dimensions,
    ...x.sum,
  }));
}
