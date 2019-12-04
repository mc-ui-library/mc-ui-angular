import {
  Injectable
} from '@angular/core';
import { MCUIService } from 'projects/mc-ui/src/public-api';
import { AppBaseService } from '../app-base.service';

@Injectable()
export class AuthService extends AppBaseService {

  constructor(
      protected service: MCUIService
  ) {
      super(service);
  }

}
