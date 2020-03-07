import { Injectable } from '@angular/core';
import { AppBaseService } from 'src/app/app-base.service';
import { MCUIService } from 'projects/mc-ui/src/public-api';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ExampleService extends AppBaseService {
  constructor(protected service: MCUIService) {
    super(service);
  }

  getDigitalCurrencyDaily() {
    return this.http('get', 'https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=CNY&apikey=L771LKUP5DIHHSKR').pipe(
      map((res: any) => {
        const data = res['Time Series (Digital Currency Daily)'];
        return Object.keys(data).map((key: string) => {
          const item = data[key];
          return {
            label: key,
            values: [
              { series: 'close', value: item['4b. close (USD)'] },
              { series: 'volume', value: item['5. volume'] }
            ]
          };
        });
      })
    );
  }
}
