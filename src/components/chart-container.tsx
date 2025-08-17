import {StatsAreaChart} from '@/components/charts';
import {Metric} from '@/components/metric';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {
  AggregatedCloudflareMetricsResponse,
  ProcessedCloudflareMetricsResponse,
} from '@/lib/types';
import {bytesFormatter, requestsFormatter} from '@/lib/utils';

export function ChartContainer({
  bytes,
  header,
  requests,
  syncId,
  totalBytes,
  totalRequests,
}: Readonly<{
  bytes: ProcessedCloudflareMetricsResponse[];
  header: string;
  requests: ProcessedCloudflareMetricsResponse[];
  syncId?: string;
  totalBytes: AggregatedCloudflareMetricsResponse;
  totalRequests: AggregatedCloudflareMetricsResponse;
}>) {
  return (
    <Card className="pt-0 p-0 md:p-6">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="text-center text-2xl">{header}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 px-0">
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 w-full">
          <Card className="p-0 md:p-6">
            <div className="flex md:flex-row flex-col gap-4">
              <Metric
                color="bg-blue-500"
                title="Total Bandwidth"
                value={bytesFormatter(totalBytes.total)}
              />
              <Metric
                color="bg-orange-500"
                title="CF Cached Bandwidth"
                value={bytesFormatter(totalBytes.cfCache)}
              />
            </div>
            <StatsAreaChart chartData={bytes} format="BYTES" syncId={syncId} />
          </Card>
          <Card className="p-0 md:p-6">
            <div className="flex md:flex-row flex-col gap-4">
              <Metric
                color="bg-blue-500"
                title="Total Requests"
                value={requestsFormatter(totalRequests.total)}
              />
              <Metric
                color="bg-orange-500"
                title="CF Cached Requests"
                value={requestsFormatter(totalRequests.cfCache)}
              />
            </div>
            <StatsAreaChart
              chartData={requests}
              format="REQUESTS"
              syncId={syncId}
            />
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
