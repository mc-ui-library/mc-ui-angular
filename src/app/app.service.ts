import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { VisualizerData } from 'projects/mc-ui/src/public-api';
import { Observable } from 'rxjs';
import {
  convertCsvToVisualizerData
} from 'projects/mc-ui/src/lib/utils/data-utils';

@Injectable()
export class AppService {
  constructor(private http: HttpClient) {}

  getNasdaqCompanies(symbol: string = ''): Observable<VisualizerData> {
    return this.http
      .get('../test/data/nasdaqlisted.txt', { responseType: 'text' })
      .pipe(
        map(data =>
          convertCsvToVisualizerData(data, [
            { field: 'Symbol', keyword: symbol }
          ])
        )
      );
  }

  getDailyDataBySymbol(symbol: string): Observable<VisualizerData> {
    return this.http
      .get(`../test/data/${symbol}.csv`, { responseType: 'text' })
      .pipe(map(data => convertCsvToVisualizerData(data)));
  }

  // getCompanies(keyword: string = ''): Observable<Array<VisualizerData>> {
  //   const params = new HttpParams()
  //     .set(
  //       AlphaVantageAPIParamKey.function,
  //       AlphaVantageAPIFunction.SYMBOL_SEARCH
  //     )
  //     .set(AlphaVantageAPIParamKey.keywords, keyword)
  //     .set(AlphaVantageAPIParamKey.apikey, AlphaVantageAPI.key);
  //   return this.http
  //     .get(AlphaVantageAPI.url, { params })
  //     .pipe(map((data: CompanyBestMatches) => this.normalizeComponies(data)));
  // }

  // normalizeComponies(data: CompanyBestMatches): Array<VisualizerData> {
  //   const VisualizerDataMap = new Map<string, VisualizerData>();
  //   data.bestMatches.forEach(row => {
  //     Object.keys(row).forEach(key =>
  //       this.addVisualizerDataValues(key, row[key], VisualizerDataMap)
  //     );
  //   });
  //   return [...VisualizerDataMap.values()];
  // }

  // getTimeSeries(
  //   symbol: string,
  //   fn: AlphaVantageAPIFunction = AlphaVantageAPIFunction.TIME_SERIES_DAILY,
  //   outputsize: AlphaVantageAPIOutputSize = AlphaVantageAPIOutputSize.compact
  // ) {
  //   const params = new HttpParams()
  //     .set(AlphaVantageAPIParamKey.function, fn)
  //     .set(AlphaVantageAPIParamKey.symbol, symbol)
  //     .set(AlphaVantageAPIParamKey.outputsize, outputsize)
  //     .set(AlphaVantageAPIParamKey.apikey, AlphaVantageAPI.key);
  //   return this.http
  //     .get(AlphaVantageAPI.url, { params })
  //     .pipe(map((data: TimeSeries) => this.normalizeTimeseries(data, fn)));
  // }

  // normalizeTimeseries(
  //   data: TimeSeries,
  //   fn: AlphaVantageAPIFunction
  // ): Array<VisualizerData> {
  //   const VisualizerDataMap = new Map<string, VisualizerData>();
  //   switch (fn) {
  //     case AlphaVantageAPIFunction.TIME_SERIES_DAILY:
  //       const d = data[TimeSeriesType.TIME_SERIES_DAILY];
  //       Object.keys(d).forEach(date => {
  //         this.addVisualizerDataValues('date', simpleFormatDate(date), VisualizerDataMap);
  //         const keyVal = d[date];
  //         Object.keys(keyVal).forEach(key =>
  //           this.addVisualizerDataValues(key, keyVal[key], VisualizerDataMap)
  //         );
  //       });
  //       return [...VisualizerDataMap.values()];
  //   }
  //   return [];
  // }

  // addVisualizerDataValues(
  //   key: string,
  //   value: any,
  //   VisualizerDataMap: Map<string, VisualizerData>
  // ): Map<string, VisualizerData> {
  //   key = key.includes('. ') ? key.split('. ')[1] : key;
  //   if (!VisualizerDataMap.has(key)) {
  //     VisualizerDataMap.set(key, { label: key, values: [] });
  //   }
  //   const VisualizerData = VisualizerDataMap.get(key);
  //   VisualizerData.values.push({ value });
  //   VisualizerDataMap.set(key, VisualizerData);
  //   return VisualizerDataMap;
  // }
}
