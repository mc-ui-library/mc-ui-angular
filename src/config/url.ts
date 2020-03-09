import {
  user_mock
} from 'src/test/api/user_mock';
import { getRootUrl } from 'projects/mc-ui/src/lib/utils/utils';

const URLS = {
  user: 'api/user/',
};

const MOCK_URLS = {
  user: user_mock
};

export class Url {

  private root = '';

  constructor() {
    this.root = getRootUrl();
  }

  /**
   *
   * @param id url id
   * @param extra for dynamic url e.g) id data string
   */
  getUrl(id: string, params = [], isMockData = false) {
    let val = URLS[id];
    if (params.length > 0) {
      params.map((u, i) => {
        val = val.replace(`{${i}}`, u);
      });
    }
    return !isMockData ? this.root + val : MOCK_URLS[id] || {};
  }

}
