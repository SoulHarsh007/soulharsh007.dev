'use client';

import {Area, AreaChart, CartesianGrid, XAxis, YAxis} from 'recharts';

import {
  ChartConfig,
  ChartConfigValue,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {ProcessedCloudflareMetricsResponse} from '@/lib/types';
import {bytesFormatter, requestsFormatter} from '@/lib/utils';

const chartConfig: Record<string, ChartConfigValue> = {
  lastMonthCfCache: {
    color: 'var(--chart-3)',
    label: 'Last Month (CF Cache)',
  },
  lastMonthTotal: {
    color: 'var(--chart-4)',
    label: 'Last Month (Total)',
  },
  thisMonthCfCache: {
    color: 'var(--chart-1)',
    label: 'This Month (CF Cache)',
  },
  thisMonthTotal: {
    color: 'var(--chart-2)',
    label: 'This Month (Total)',
  },
  thisYearCfCache: {
    color: 'var(--chart-1)',
    label: 'This Year (CF Cache)',
  },
  thisYearTotal: {
    color: 'var(--chart-2)',
    label: 'This Year (Total)',
  },
} satisfies ChartConfig;

const chartKeys = Object.keys(chartConfig);

export type StatsAreaChartFormat = 'BYTES' | 'REQUESTS';

export function StatsAreaChart({
  chartData,
  format,
  syncId,
}: Readonly<{
  chartData: ProcessedCloudflareMetricsResponse[];
  format?: StatsAreaChartFormat;
  syncId?: string;
}>) {
  const formatter = getFormatter(format);
  const dataKeys = chartData[0] ? Object.keys(chartData[0]) : [];
  const filteredKeys = chartKeys.filter(key => dataKeys.includes(key));
  return (
    <ChartContainer className="max-h-[32rem] pb-0" config={chartConfig}>
      <AreaChart accessibilityLayer data={chartData} syncId={syncId}>
        <CartesianGrid vertical={false} />
        <XAxis
          axisLine={false}
          dataKey="date"
          tickLine={false}
          tickMargin={8}
        />
        <YAxis
          className="w-8 md:w-12 lg:w-14"
          tickFormatter={formatter}
          type="number"
        />
        <ChartTooltip
          content={<ChartTooltipContent valueFormatter={formatter} />}
        />
        <ChartLegend
          content={<ChartLegendContent className="justify-end gap-0" />}
          verticalAlign="top"
        />
        <defs>
          {filteredKeys.map(chartKey => (
            <linearGradient
              id={`fill${chartKey}`}
              key={chartKey}
              x1="0"
              x2="0"
              y1="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor={chartConfig[chartKey].color}
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor={chartConfig[chartKey].color}
                stopOpacity={0}
              />
            </linearGradient>
          ))}
        </defs>
        {filteredKeys
          .filter(x => Object.keys(chartData[0]).includes(x))
          .map(chartKey => (
            <Area
              dataKey={chartKey}
              fill={`url(#fill${chartKey})`}
              fillOpacity={0.3}
              key={`monthly-chart-area-${chartKey}`}
              stroke={chartConfig[chartKey].color}
              strokeWidth={2}
              type="linear"
            />
          ))}
      </AreaChart>
    </ChartContainer>
  );
}

function getFormatter(format?: StatsAreaChartFormat) {
  switch (format) {
    case 'BYTES':
      return bytesFormatter;
    case 'REQUESTS':
      return requestsFormatter;
    default:
      return (value: number) => value.toLocaleString();
  }
}
