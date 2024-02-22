'use client';

import {bytesFormatter, requestsFormatter} from '@/lib/utils';
import {IComparableMetrics} from '@/types/types';
import {AreaChart, Card, Grid} from '@tremor/react';

import Metric from './Metric';

export default function MetricsCard({
  bytes,
  requests,
}: Readonly<{
  bytes: IComparableMetrics[];
  requests: IComparableMetrics[];
}>) {
  const totalRequests = requestsFormatter(
    requests.reduce((prev, curr) => prev + curr['This Month (Total)'], 0)
  );
  const totalCFRequests = requestsFormatter(
    requests.reduce((prev, curr) => prev + curr['This Month (CF Cache)'], 0)
  );
  const totalBandwidth = bytesFormatter(
    bytes.reduce((prev, curr) => prev + curr['This Month (Total)'], 0)
  );
  const totalCFBandwidth = bytesFormatter(
    bytes.reduce((prev, curr) => prev + curr['This Month (CF Cache)'], 0)
  );
  return (
    <Grid className="gap-4" numItemsLg={2}>
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
          categories={[
            'This Month (Total)',
            'This Month (CF Cache)',
            'Last Month (Total)',
            'Last Month (CF Cache)',
          ]}
          className="md:hidden"
          colors={['blue', 'orange', 'purple', 'yellow']}
          data={requests}
          index="date"
          showXAxis={false}
          showYAxis={false}
          valueFormatter={requestsFormatter}
        />
        <AreaChart
          categories={[
            'This Month (Total)',
            'This Month (CF Cache)',
            'Last Month (Total)',
            'Last Month (CF Cache)',
          ]}
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
          categories={[
            'This Month (Total)',
            'This Month (CF Cache)',
            'Last Month (Total)',
            'Last Month (CF Cache)',
          ]}
          className="md:hidden"
          colors={['blue', 'orange', 'purple', 'yellow']}
          data={bytes}
          index="date"
          showXAxis={false}
          showYAxis={false}
          valueFormatter={bytesFormatter}
        />
        <AreaChart
          categories={[
            'This Month (Total)',
            'This Month (CF Cache)',
            'Last Month (Total)',
            'Last Month (CF Cache)',
          ]}
          className="hidden md:block"
          colors={['blue', 'orange', 'purple', 'yellow']}
          data={bytes}
          index="date"
          valueFormatter={bytesFormatter}
        />
      </Card>
    </Grid>
  );
}
