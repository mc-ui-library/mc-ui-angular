export interface Company {
  symbol: string;
  name: string;
  type: string;
  region: string;
  marketOpen: string;
  marketClose: string;
  timezone: string;
  currency: string;
  matchScore: number;
}

export interface CompanyBestMatches {
  bestMatches: Array<Company>;
}

export interface TimeSeries {
  'Meta Data': TimeSeriesMetaData;
  'Time Series (Daily)': any;
}

export interface TimeSeriesMetaData {
  Information: string;
  Symbol: string;
  Interval: string;
  'Last Refreshed': Date;
  'Output Size': string;
  'Time Zone': string;
}

export interface TimeSeriesDetail {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
