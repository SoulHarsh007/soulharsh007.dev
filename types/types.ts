export enum IMetricsTimeRange {
  MONTHLY = 31,
  YEARLY = 366,
}

export type ComparableMetricsKeys<T extends TimePeriod> =
  | `This ${T} (CF Cache)`
  | `This ${T} (Total)`
  | (T extends 'Month' ? `Last ${T} (CF Cache)` | `Last ${T} (Total)` : never);

export interface ICloudflareMetricsResponse {
  data?: {
    viewer: {
      zones: [
        {
          httpRequests1dGroups: IHTTPRequests1DGroups[];
        },
      ];
    };
  };
}

export type IComparableMetrics<T extends TimePeriod> = {
  [K in ComparableMetricsKeys<T>]: number;
} & {
  date: string;
  type: T;
};

export interface IHTTPRequests1DGroups {
  dimensions: {
    date: string;
  };
  sum: {
    bytes: number;
    cachedBytes: number;
    cachedRequests: number;
    requests: number;
  };
}

export type TimePeriod = 'Month' | 'Year';
