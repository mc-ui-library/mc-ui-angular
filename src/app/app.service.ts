import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AlphaVantageAPI, AlphaVantageAPIParamKey, AlphaVantageAPIParamValue } from './models-manual';
import { map } from 'rxjs/operators';
import { CompanyBestMatches } from './models';
import { VizData } from 'projects/mc-ui/src/public-api';
import { Observable } from 'rxjs';

@Injectable()
export class AppService {
  constructor(private http: HttpClient) {
  }

  getCompanies(keyword: string = ''): Observable<Array<VizData>> {
    const params = new HttpParams()
    .set(AlphaVantageAPIParamKey.function, AlphaVantageAPIParamValue.SYMBOL_SEARCH)
    .set(AlphaVantageAPIParamKey.keywords, keyword)
    .set(AlphaVantageAPIParamKey.apikey, AlphaVantageAPI.key);
    return this.http.get(AlphaVantageAPI.url, { params }).pipe(map((data: CompanyBestMatches) => this.normalizeComponies(data)));
  }

  normalizeComponies(data: CompanyBestMatches): Array<VizData> {
    const vizDataMap = new Map<string, VizData>();
    data.bestMatches.forEach(row => {
      Object.keys(row).forEach(key => {
        if (!vizDataMap.has(key)) {
          vizDataMap.set(key, { label: key, values: []});
        }
        const vizData = vizDataMap.get(key);
        vizData.values.push({ value: row[key]});
      });
    });
    return [...vizDataMap.values()];
  }
}
