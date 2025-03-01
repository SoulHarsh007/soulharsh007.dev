'use server';

import {Card} from '@/components/Card';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import MetricsCard from '@/components/MetricsCard';
import {TopRoutes} from '@/components/TopRoutes';
import {getCloudflareMetrics} from '@/lib/api';
import {IMetricsTimeRange} from '@/types/types';

export default async function Home() {
  const startDate = new Date();
  startDate.setUTCDate(1);
  startDate.setUTCHours(0);
  startDate.setUTCMinutes(0);
  startDate.setUTCSeconds(0);

  const endDate = new Date();
  endDate.setUTCHours(0);
  endDate.setUTCMinutes(0);
  endDate.setUTCSeconds(0);
  endDate.setUTCMonth(startDate.getUTCMonth() + 1);
  endDate.setUTCDate(0);

  const thisMonth = await getCloudflareMetrics(
    startDate,
    endDate,
    IMetricsTimeRange.MONTHLY
  );

  startDate.setUTCMonth(startDate.getUTCMonth() - 1);
  endDate.setUTCDate(0);

  const prevMonth = await getCloudflareMetrics(
    startDate,
    endDate,
    IMetricsTimeRange.MONTHLY
  );

  startDate.setUTCMonth(startDate.getUTCMonth() + 1);
  startDate.setUTCMonth(0);

  endDate.setUTCMonth(12);
  endDate.setUTCDate(0);

  const thisYear = await getCloudflareMetrics(
    startDate,
    endDate,
    IMetricsTimeRange.YEARLY
  );

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Header />
      <Card className="flex flex-col w-full h-full gap-y-8 p-1 md:p-4">
        <div className="flex w-full justify-center p-4">
          <h3 className="text-2xl font-bold text-center dark:text-white text-gray-900">
            Domain Traffic Analysis: soulharsh007.dev
          </h3>
        </div>

        <MetricsCard<'Year'>
          bytes={thisYear.map((x, i) => ({
            date: x.date,
            'This Year (CF Cache)': x.cachedBytes,
            'This Year (Total)': x.bytes,
            type: 'Year',
          }))}
          categories={['This Year (Total)', 'This Year (CF Cache)']}
          requests={thisYear.map((x, i) => ({
            date: x.date,
            'This Year (CF Cache)': x.cachedRequests,
            'This Year (Total)': x.requests,
            type: 'Year',
          }))}
          title="This Year"
        />

        <MetricsCard<'Month'>
          bytes={thisMonth.map((x, i) => ({
            date: x.date,
            'Last Month (CF Cache)': prevMonth[i].cachedBytes,
            'Last Month (Total)': prevMonth[i].bytes,
            'This Month (CF Cache)': x.cachedBytes,
            'This Month (Total)': x.bytes,
            type: 'Month',
          }))}
          categories={[
            'This Month (Total)',
            'This Month (CF Cache)',
            'Last Month (Total)',
            'Last Month (CF Cache)',
          ]}
          requests={thisMonth.map((x, i) => ({
            date: x.date,
            'Last Month (CF Cache)': prevMonth[i].cachedRequests,
            'Last Month (Total)': prevMonth[i].requests,
            'This Month (CF Cache)': x.cachedRequests,
            'This Month (Total)': x.requests,
            type: 'Month',
          }))}
          title="This Month"
        />

        <TopRoutes />
      </Card>
      <Footer />
    </div>
  );
}
