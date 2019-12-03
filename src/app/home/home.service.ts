import {
  Injectable
} from '@angular/core';
import {
  MCUIService
} from 'mc-ui-angular';
import { AppBaseService } from '../app-base.service';
import { user_mock } from 'src/test/api';

const CONS = {
  homeLeftMenu: {
    data: {
      menu: [
        { id: '/home/example', name: 'Components', depth: 0 },
        // { id: '/home/example/button', name: 'Button', depth: 0 },
        // { id: '/home/example/drawer', name: 'Drawer', depth: 0 },
        // { id: '/home/example/form', name: 'Form', depth: 0 },
        // { id: '/home/example/input', name: 'Input', depth: 1 },
        // { id: '/home/example/textarea', name: 'TextArea', depth: 1 },
        // { id: '/home/example/field', name: 'Field', depth: 1 },
        // { id: '/home/example/icon', name: 'Icon', depth: 0 },
        // { id: '/home/example/loader', name: 'Loader', depth: 0 },
        // { id: '/home/example/message-bar', name: 'Message Bar', depth: 0 },
      ]
    }
  }
};

@Injectable()
export class HomeService extends AppBaseService {

  constructor(
      protected service: MCUIService
  ) {
      super(service);
  }

  getMenuList() {
    return CONS.homeLeftMenu.data.menu;
  }

  getUserListMock() {
    return user_mock;
  }

}
