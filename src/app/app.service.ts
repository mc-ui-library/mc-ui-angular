import { Injectable } from '@angular/core';
import * as intrinioSDK from 'intrinio-sdk';
import { IntrinioAPI, CompanyApiOption } from './models';
import { from } from 'rxjs';

@Injectable()
export class SharedService {
  private companyAPI: any;
  constructor() {
    intrinioSDK.ApiClient.instance.authentications[IntrinioAPI.authentications].apiKey = IntrinioAPI.key;
    this.companyAPI = new intrinioSDK.CompanyApi();
  }

  getAllCompanies() {
    const opts: CompanyApiOption = {
      hasFundamentals: true,
      hasStockPrices: true,
      pageSize: 100
    };
    return from(this.companyAPI.getAllCompanies(opts));
  }
}
