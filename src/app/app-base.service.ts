import {
  MCUIService
} from 'mc-ui-angular';
import {
  OnDestroy
} from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { Url } from 'src/config/url';

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

  http(type, url, params, options) {
    let http;
    switch (type) {
        case 'get':
            http = this.util.http.get('get', url, null, options);
            break;
        case 'post':
            http = this.util.http.post('post', url, params, options);
            break;
        case 'put':
            http = this.util.http.put('put', url, params, options);
            break;
        case 'delete':
            http = this.util.http.delete('delete', url, params, options);
            break;
    }
    return http.pipe(
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
