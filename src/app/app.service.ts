import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  AlphaVantageAPI,
  AlphaVantageAPIParamKey,
  AlphaVantageAPIFunction,
  AlphaVantageAPIOutputSize,
  TimeSeriesType
} from './models-manual';
import { map } from 'rxjs/operators';
import { CompanyBestMatches, TimeSeries } from './models';
import { VizData } from 'projects/mc-ui/src/public-api';
import { Observable } from 'rxjs';
import { simpleFormatDate } from 'projects/mc-ui/src/lib/utils/date-utils';

@Injectable()
export class AppService {
  constructor(private http: HttpClient) {}

  getCompanies(keyword: string = ''): Observable<Array<VizData>> {
    const params = new HttpParams()
      .set(
        AlphaVantageAPIParamKey.function,
        AlphaVantageAPIFunction.SYMBOL_SEARCH
      )
      .set(AlphaVantageAPIParamKey.keywords, keyword)
      .set(AlphaVantageAPIParamKey.apikey, AlphaVantageAPI.key);
    return this.http
      .get(AlphaVantageAPI.url, { params })
      .pipe(map((data: CompanyBestMatches) => this.normalizeComponies(data)));
  }

  normalizeComponies(data: CompanyBestMatches): Array<VizData> {
    const vizDataMap = new Map<string, VizData>();
    data.bestMatches.forEach(row => {
      Object.keys(row).forEach(key => this.addVizDataValues(key, row[key], vizDataMap));
    });
    return [...vizDataMap.values()];
  }

  getTimeSeries(
    symbol: string,
    fn: AlphaVantageAPIFunction = AlphaVantageAPIFunction.TIME_SERIES_DAILY,
    outputsize: AlphaVantageAPIOutputSize = AlphaVantageAPIOutputSize.compact
  ) {
    const params = new HttpParams()
      .set(AlphaVantageAPIParamKey.function, fn)
      .set(AlphaVantageAPIParamKey.symbol, symbol)
      .set(AlphaVantageAPIParamKey.outputsize, outputsize)
      .set(AlphaVantageAPIParamKey.apikey, AlphaVantageAPI.key);
    return this.http
      .get(AlphaVantageAPI.url, { params })
      .pipe(map((data: TimeSeries) => this.normalizeTimeseries(data, fn)));
  }

  normalizeTimeseries(
    data: TimeSeries,
    fn: AlphaVantageAPIFunction
  ): Array<VizData> {
    const vizDataMap = new Map<string, VizData>();
    switch (fn) {
      case AlphaVantageAPIFunction.TIME_SERIES_DAILY:
        const d = data[TimeSeriesType.TIME_SERIES_DAILY];
        Object.keys(d).forEach(date => {
          this.addVizDataValues('date', simpleFormatDate(date), vizDataMap);
          const keyVal = d[date];
          Object.keys(keyVal).forEach(key => this.addVizDataValues(key, keyVal[key], vizDataMap));
        });
        return [...vizDataMap.values()];
    }
    return [];
  }

  addVizDataValues(
    key: string,
    value: any,
    vizDataMap: Map<string, VizData>
  ): Map<string, VizData> {
    key = key.includes('. ') ? key.split('. ')[1] : key;
    if (!vizDataMap.has(key)) {
      vizDataMap.set(key, { label: key, values: [] });
    }
    const vizData = vizDataMap.get(key);
    vizData.values.push({ value });
    vizDataMap.set(key, vizData);
    return vizDataMap;
  }
}
