import {
  Injectable
} from '@angular/core';
import {
  MCUIService
} from 'mc-ui-angular';
import { AppBaseService } from '../app-base.service';

@Injectable()
export class AuthService extends AppBaseService {

  constructor(
      protected service: MCUIService
  ) {
      super(service);
  }

}
