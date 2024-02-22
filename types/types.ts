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

export interface IMonthlyMetricsResponse {
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

export interface IComparableMetrics {
  date: string;
  'This Month (Total)': number;
  'This Month (CF Cache)': number;
  'Last Month (Total)': number;
  'Last Month (CF Cache)': number;
}
