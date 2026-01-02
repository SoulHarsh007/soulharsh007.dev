import z from 'zod';

export enum MetricsTimeRange {
  MONTHLY = 31,
  YEARLY = 366,
}

export const CloudflareMetricsRequestSchema = z.object({
  endDate: z.date(),
  range: z.enum(MetricsTimeRange),
  startDate: z.date(),
});

export type CloudflareMetricsRequest = z.infer<
  typeof CloudflareMetricsRequestSchema
>;

export const CloudflareMetricsHttpRequestsSumSchema = z.strictObject({
  bytes: z.number().nonnegative(),
  cachedBytes: z.number().nonnegative(),
  cachedRequests: z.number().nonnegative(),
  requests: z.number().nonnegative(),
});

export type CloudflareMetricsHttpRequestsSum = z.infer<
  typeof CloudflareMetricsHttpRequestsSumSchema
>;

export const CloudflareMetricsHttpRequestsSumWithDateSchema =
  CloudflareMetricsHttpRequestsSumSchema.extend({
    date: z.string(),
  });

export type CloudflareMetricsHttpRequestsSumWithDate = z.infer<
  typeof CloudflareMetricsHttpRequestsSumWithDateSchema
>;

export const CloudflareMetricsHttpRequestsSchema = z.strictObject({
  dimensions: z.strictObject({
    date: z.string(),
  }),
  sum: CloudflareMetricsHttpRequestsSumSchema,
});

export type CloudflareMetricsHttpRequests = z.infer<
  typeof CloudflareMetricsHttpRequestsSchema
>;

export const CloudflareMetricsResponseSchema = z.strictObject({
  data: z.strictObject({
    viewer: z.strictObject({
      zones: z.array(
        z.strictObject({
          httpRequests1dGroups: z.array(CloudflareMetricsHttpRequestsSchema),
        })
      ),
    }),
  }),
  errors: z.unknown().nullable(),
});

export enum MetricPeriod {
  MONTH = 'MONTH',
  YEAR = 'YEAR',
}

export type AggregatedCloudflareMetricsResponse = {
  cfCache: number;
  total: number;
};

export type CloudflareMetricsResponse = z.infer<
  typeof CloudflareMetricsResponseSchema
>;

export type ProcessedCloudflareMetricsResponse =
  | {
      date: string;
      lastMonthCfCache: number;
      lastMonthTotal: number;
      thisMonthCfCache: number;
      thisMonthTotal: number;
      type: MetricPeriod.MONTH;
    }
  | {
      date: string;
      thisYearCfCache: number;
      thisYearTotal: number;
      type: MetricPeriod.YEAR;
    };
