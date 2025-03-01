'use client';

import {AreaChart} from '@/components/AreaChart';
import {Card} from '@/components/Card';
import Metric from '@/components/Metric';
import {bytesFormatter, requestsFormatter} from '@/lib/utils';
import {IComparableMetrics, TimePeriod} from '@/types/types';

export default function MetricsCard<T extends TimePeriod>({
  bytes,
  categories,
  requests,
  title,
}: Readonly<{
  bytes: IComparableMetrics<T>[];
  categories: string[];
  requests: IComparableMetrics<T>[];
  title: string;
}>) {
  const totalRequests = requestsFormatter(
    requests.reduce((prev, curr) => prev + curr[`This ${curr.type} (Total)`], 0)
  );
  const totalCFRequests = requestsFormatter(
    requests.reduce(
      (prev, curr) => prev + curr[`This ${curr.type} (CF Cache)`],
      0
    )
  );
  const totalBandwidth = bytesFormatter(
    bytes.reduce((prev, curr) => prev + curr[`This ${curr.type} (Total)`], 0)
  );
  const totalCFBandwidth = bytesFormatter(
    bytes.reduce((prev, curr) => prev + curr[`This ${curr.type} (CF Cache)`], 0)
  );
  return (
    <Card className="p-1 md:p-4">
      <div className="flex w-full justify-center p-4">
        <h3 className="text-xl font-semibold text-center dark:text-white text-gray-900">
          {title}
        </h3>
      </div>
      <div className="gap-4 grid md:grid-cols-2">
        <Card className="p-1 md:p-4">
          <div className="flex md:flex-row flex-col gap-4">
            <Metric
              color="bg-blue-500"
              title="Total Requests"
              value={totalRequests}
            />
            <Metric
              color="bg-orange-500"
              title="CF Cached Requests"
              value={totalCFRequests}
            />
          </div>
          <AreaChart
            categories={categories}
            chartKey="mobile-requests-chart"
            className="md:hidden"
            colors={['blue', 'orange', 'purple', 'yellow']}
            data={requests}
            index="date"
            showXAxis={false}
            showYAxis={false}
            valueFormatter={requestsFormatter}
          />
          <AreaChart
            categories={categories}
            chartKey="desktop-requests-chart"
            className="hidden md:block"
            colors={['blue', 'orange', 'purple', 'yellow']}
            data={requests}
            index="date"
            valueFormatter={requestsFormatter}
          />
        </Card>
        <Card className="p-1 md:p-4">
          <div className="flex md:flex-row flex-col gap-4">
            <Metric
              color="bg-blue-500"
              title="Total Bandwidth Usage"
              value={totalBandwidth}
            />
            <Metric
              color="bg-orange-500"
              title="CF Cached Bandwidth"
              value={totalCFBandwidth}
            />
          </div>
          <AreaChart
            categories={categories}
            chartKey="mobile-bytes-chart"
            className="md:hidden"
            colors={['blue', 'orange', 'purple', 'yellow']}
            data={bytes}
            index="date"
            showXAxis={false}
            showYAxis={false}
            valueFormatter={bytesFormatter}
          />
          <AreaChart
            categories={categories}
            chartKey="desktop-bytes-chart"
            className="hidden md:block"
            colors={['blue', 'orange', 'purple', 'yellow']}
            data={bytes}
            index="date"
            valueFormatter={bytesFormatter}
          />
        </Card>
      </div>
    </Card>
  );
}
