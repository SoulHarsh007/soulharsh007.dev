'use server';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import MetricsCard from '@/components/MetricsCard';
import {TopRoutes} from '@/components/TopRoutes';
import {getMonthlyMetrics} from '@/lib/api';
import {Card} from '@tremor/react';

export default async function Home() {
  const startDate = new Date();
  startDate.setDate(1);
  const endDate = new Date();
  endDate.setMonth(startDate.getMonth() + 1);
  endDate.setDate(0);
  const thisMonth = await getMonthlyMetrics(startDate, endDate);
  startDate.setMonth(startDate.getMonth() - 1);
  endDate.setDate(0);
  const prevMonth = await getMonthlyMetrics(startDate, endDate);
  return (
    <div className="min-h-screen bg-tremor-background dark:bg-dark-tremor-background ">
      <Header />
      <Card className="flex flex-col w-full h-full gap-y-8 p-1 md:p-4">
        <div className="flex w-full justify-center p-4">
          <h3 className="text-2xl font-bold text-center dark:text-white text-gray-900">
            Domain Traffic Analysis: soulharsh007.dev
          </h3>
        </div>
        <MetricsCard
          bytes={thisMonth.map((x, i) => ({
            'Last Month (CF Cache)': prevMonth[i].cachedBytes,
            'Last Month (Total)': prevMonth[i].bytes,
            'This Month (CF Cache)': x.cachedBytes,
            'This Month (Total)': x.bytes,
            date: x.date,
          }))}
          requests={thisMonth.map((x, i) => ({
            'Last Month (CF Cache)': prevMonth[i].cachedRequests,
            'Last Month (Total)': prevMonth[i].requests,
            'This Month (CF Cache)': x.cachedRequests,
            'This Month (Total)': x.requests,
            date: x.date,
          }))}
        />
        <TopRoutes />
      </Card>
      <Footer />
    </div>
  );
}
