'use server';

import {getCloudflareMetrics} from '@/app/actions';
import {Card} from '@/components/Card';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import MetricsCard from '@/components/MetricsCard';
import {IMetricsTimeRange} from '@/types/types';
import {RiDonutChartLine, RiShieldStarLine} from '@remixicon/react';
import Link from 'next/link';

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

      <Card className="flex flex-col w-full h-full gap-y-4 p-1 md:p-4">
        <Card className="flex items-center gap-x-4 p-4 text-sm text-black rounded-lg bg-gray-100 dark:text-white text-justify">
          <svg
            className="ml-3 size-8 shrink-0"
            viewBox="0 0 640 480"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g fillRule="evenodd" strokeWidth="1pt">
              <path d="M0 0h640v480H0z" fill="gold" />
              <path d="M0 0h640v240H0z" fill="#0057b8" />
            </g>
          </svg>
          <div>
            <span className="font-bold">Stand with Ukraine</span> - In this
            critical time, we stand in solidarity with the people of Ukraine.
            Together, we can offer hope, support, and resilience. If {"you're "}
            able to help, consider donating to those in need.{' '}
            <span className="font-bold">Slava Ukraini! </span>
            <Link
              className="underline decoration-dotted inline-flex"
              href="https://u24.gov.ua/"
              target="_blank"
            >
              Show your support
              <span>
                <svg
                  aria-hidden="true"
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </span>
            </Link>
          </div>
        </Card>

        <div className="flex w-full justify-center p-4">
          <h3 className="text-2xl font-bold text-center dark:text-white text-gray-900">
            Domain Traffic Analysis: soulharsh007.dev
          </h3>
        </div>

        <Card className="flex gap-x-4 items-center">
          <RiDonutChartLine className="dark:text-white text-gray-900 size-10 shrink-0" />
          <p className="dark:text-white text-gray-900 text-justify">
            Due to a Cloudflare analytics bug, the data for March 2, 2025, and
            March 3, 2025, was removed from the calculation as it returned
            values of 9.22 EB. This bug was resolved with in 72 hours of
            reporting! A big thank you to Erisa (Community Champion), Rian (Data
            Team, Cloudflare), and the entire Cloudflare team for such a quick
            response!
          </p>
        </Card>

        <MetricsCard<'Year'>
          bytes={thisYear
            .filter(x => x.date !== '2025-03-02' && x.date !== '2025-03-03')
            .map(x => ({
              date: x.date,
              'This Year (CF Cache)': x.cachedBytes,
              'This Year (Total)': x.bytes,
              type: 'Year',
            }))}
          categories={['This Year (Total)', 'This Year (CF Cache)']}
          requests={thisYear
            .filter(x => x.date !== '2025-03-02' && x.date !== '2025-03-03')
            .map(x => ({
              date: x.date,
              'This Year (CF Cache)': x.cachedRequests,
              'This Year (Total)': x.requests,
              type: 'Year',
            }))}
          title="This Year"
        />

        <MetricsCard<'Month'>
          bytes={thisMonth
            .filter(x => x.date !== '2025-03-02' && x.date !== '2025-03-03')
            .map((x, i) => ({
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
          requests={thisMonth
            .filter(x => x.date !== '2025-03-02' && x.date !== '2025-03-03')
            .map((x, i) => ({
              date: x.date,
              'Last Month (CF Cache)': prevMonth[i].cachedRequests,
              'Last Month (Total)': prevMonth[i].requests,
              'This Month (CF Cache)': x.cachedRequests,
              'This Month (Total)': x.requests,
              type: 'Month',
            }))}
          title="This Month"
        />
      </Card>
      <Footer />
    </div>
  );
}
