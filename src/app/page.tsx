import {cacheLife} from 'next/cache';

import {getCloudflareMetrics} from '@/app/actions';
import {ChartContainer} from '@/components/chart-container';
import {ExcludedDataCard} from '@/components/excluded-data-card';
import {Footer} from '@/components/footer';
import {Header} from '@/components/header';
import {UASupportCard} from '@/components/ua-support-card';
import {Card} from '@/components/ui/card';
import {ignoreDates} from '@/lib/ignored-dates';
import {
  CloudflareMetricsHttpRequestsSumWithDate,
  MetricPeriod,
  MetricsTimeRange,
  ProcessedCloudflareMetricsResponse,
} from '@/lib/types';
import {extractMonth} from '@/lib/utils';

export default async function Home() {
  'use cache';
  cacheLife('days');
  const startDate = new Date();
  startDate.setUTCDate(1);
  startDate.setUTCHours(0);
  startDate.setUTCMinutes(0);
  startDate.setUTCSeconds(0);
  startDate.setUTCMilliseconds(0);

  const endDate = new Date();
  endDate.setUTCHours(0);
  endDate.setUTCMinutes(0);
  endDate.setUTCSeconds(0);
  endDate.setUTCMilliseconds(0);
  endDate.setUTCMonth(startDate.getUTCMonth() + 1);
  endDate.setUTCDate(0);

  const thisMonth = (
    await getCloudflareMetrics({
      endDate,
      range: MetricsTimeRange.MONTHLY,
      startDate,
    })
  )
    // Filter out the dates with known DDoS dates
    .filter(x => !ignoreDates.includes(x.date));

  startDate.setUTCMonth(startDate.getUTCMonth() - 1);
  endDate.setUTCDate(0);

  const prevMonth = (
    await getCloudflareMetrics({
      endDate,
      range: MetricsTimeRange.MONTHLY,
      startDate,
    })
  ) // Filter out the dates with known DDoS dates
    .filter(x => !ignoreDates.includes(x.date));

  startDate.setUTCMonth(startDate.getUTCMonth() + 1);
  startDate.setUTCMonth(0);

  endDate.setUTCMonth(12);
  endDate.setUTCDate(0);
  endDate.setUTCFullYear(endDate.getUTCFullYear() + 1);

  const thisYear = (
    await getCloudflareMetrics({
      endDate,
      range: MetricsTimeRange.YEARLY,
      startDate,
    })
  ) // Filter out the dates with known DDoS dates
    .filter(x => !ignoreDates.includes(x.date));

  const aggregatedThisYear = Object.values(
    thisYear.reduce(
      (acc, curr) => {
        const month = extractMonth(curr.date);
        if (!acc[month]) {
          acc[month] = {
            bytes: 0,
            cachedBytes: 0,
            cachedRequests: 0,
            date: month,
            requests: 0,
          };
        }
        acc[month].bytes += curr.bytes;
        acc[month].cachedBytes += curr.cachedBytes;
        acc[month].cachedRequests += curr.cachedRequests;
        acc[month].requests += curr.requests;
        return acc;
      },
      {} as Record<string, CloudflareMetricsHttpRequestsSumWithDate>
    )
  );

  const thisYearBytes: ProcessedCloudflareMetricsResponse[] =
    aggregatedThisYear.map(x => ({
      date: x.date,
      thisYearCfCache: x.cachedBytes,
      thisYearTotal: x.bytes,
      type: MetricPeriod.YEAR,
    }));
  const thisYearBytesTotal = aggregatedThisYear.reduce(
    (acc, curr) => ({
      cfCache: acc.cfCache + curr.cachedBytes,
      total: acc.total + curr.bytes,
    }),
    {cfCache: 0, total: 0}
  );
  const thisYearRequests: ProcessedCloudflareMetricsResponse[] =
    aggregatedThisYear.map(x => ({
      date: x.date,
      thisYearCfCache: x.cachedRequests,
      thisYearTotal: x.requests,
      type: MetricPeriod.YEAR,
    }));
  const thisYearRequestsTotal = aggregatedThisYear.reduce(
    (acc, curr) => ({
      cfCache: acc.cfCache + curr.cachedRequests,
      total: acc.total + curr.requests,
    }),
    {cfCache: 0, total: 0}
  );

  const thisMonthBytes: ProcessedCloudflareMetricsResponse[] = thisMonth.map(
    (x, i) => ({
      date: x.date,
      lastMonthCfCache: prevMonth[i].cachedBytes,
      lastMonthTotal: prevMonth[i].bytes,
      thisMonthCfCache: x.cachedBytes,
      thisMonthTotal: x.bytes,
      type: MetricPeriod.MONTH,
    })
  );
  const thisMonthBytesTotal = thisMonth.reduce(
    (acc, curr) => ({
      cfCache: acc.cfCache + curr.cachedBytes,
      total: acc.total + curr.bytes,
    }),
    {cfCache: 0, total: 0}
  );
  const thisMonthRequests: ProcessedCloudflareMetricsResponse[] = thisMonth.map(
    (x, i) => ({
      date: x.date,
      lastMonthCfCache: prevMonth[i].cachedRequests,
      lastMonthTotal: prevMonth[i].requests,
      thisMonthCfCache: x.cachedRequests,
      thisMonthTotal: x.requests,
      type: MetricPeriod.MONTH,
    })
  );
  const thisMonthRequestsTotal = thisMonth.reduce(
    (acc, curr) => ({
      cfCache: acc.cfCache + curr.cachedRequests,
      total: acc.total + curr.requests,
    }),
    {cfCache: 0, total: 0}
  );

  return (
    <Card className="font-sans min-h-screen h-full items-center justify-between p-0 gap-2 rounded-none">
      <Header />
      <main className="flex-1 w-full mx-auto md:p-3 gap-3 flex flex-col">
        <UASupportCard />
        {ignoreDates.length > 0 ? <ExcludedDataCard /> : null}

        <ChartContainer
          bytes={thisYearBytes}
          header="Stats for Current Year"
          requests={thisYearRequests}
          syncId="yearly-chart"
          totalBytes={thisYearBytesTotal}
          totalRequests={thisYearRequestsTotal}
        />

        <ChartContainer
          bytes={thisMonthBytes}
          header="Stats for Current Month"
          requests={thisMonthRequests}
          syncId="monthly-chart"
          totalBytes={thisMonthBytesTotal}
          totalRequests={thisMonthRequestsTotal}
        />
      </main>
      <Footer />
    </Card>
  );
}
