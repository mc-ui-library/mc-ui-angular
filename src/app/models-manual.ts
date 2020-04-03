export enum AlphaVantageAPI {
  key = 'L771LKUP5DIHHSKR',
  url = 'https://www.alphavantage.co/query',
}

export enum AlphaVantageAPIParamKey {
  function = 'function',
  keywords = 'keywords',
  apikey = 'apikey'
}

export enum AlphaVantageAPIParamValue {
  SYMBOL_SEARCH = 'SYMBOL_SEARCH'
}

export interface CompanyApiOption {
  'latestFilingDate'?: Date; // Date | Return companies whose latest 10-Q or 10-K was filed on or after this date
  'sic'?: string; // String | Return companies with the given Standard Industrial Classification code
  'template'?: string; // String | Return companies with the given financial statement template
  'sector'?: string; // String | Return companies in the given industry sector
  'industryCategory'?: string; // String | Return companies in the given industry category
  'industryGroup'?: string; // String | Return companies in the given industry group
  'hasFundamentals': boolean; // Boolean | Return only companies that have fundamentals when true
  'hasStockPrices': boolean; // Boolean | Return only companies that have stock prices when true
  'pageSize': 100; // Number | The number of results to return
  'nextPage'?: string; // String | Gets the next page of data from a previous API call
}
