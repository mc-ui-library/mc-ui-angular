
import {
  OnDestroy
} from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { Url } from 'src/config/url';
import { MCUIService } from 'projects/mc-ui/src/public-api';

const CONS = {};

/**
 * Base Class for all UI Services
 * Common Utility for services e.g) RESTful HTTP Util, Handling Exceptions
 */
export class AppBaseService implements OnDestroy {

  private lastErrorMsg;

  protected util;
  protected url: Url;

  constructor(protected service: MCUIService) {
    this.util = this.service.util;
    this.url = new Url(service);
  }

  getCons(id) {
    return this.util.clone(CONS[id]);
  }

  http(type, url, params = null, options = null) {
    return this.util.http(type, url, params, options).pipe(
        map((data: any) => {
            this.util.log([url, data]);
            return data;
        }),
        catchError((error = {}) => {
            // show the error page
            const msg = `${error.message} (${error.url}, ${error.status}, ${error.statusText})`;
            // prevent the duplicate error message
            if (this.lastErrorMsg !== msg) {
                this.lastErrorMsg = msg;
                this.service.sendMessage({ from: 'app-base', to: 'app', action: 'error', data: { message: msg } });
                setTimeout(_ => this.lastErrorMsg = '', 5000);
            }
            throw(error);
        })
    );
}

  ngOnDestroy(): void {
    this.destroyService();
  }

  destroyService() {
    // to destroy...
  }
}
