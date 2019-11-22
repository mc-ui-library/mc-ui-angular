
import {
  Component,
  ViewContainerRef} from '@angular/core';
import {
  AppBaseComponent
} from '../../index';
import { Router } from '@angular/router';
import {
  MCUIService
} from 'mc-ui-angular';
import { AuthService } from '../auth.service';

@Component({
  selector: 'mc-signin',
  styleUrls: ['signin.component.scss'],
  templateUrl: 'signin.component.html'
})
export class SigninComponent extends AppBaseComponent {

  constructor(
      protected er: ViewContainerRef,
      protected service: MCUIService,
      private authService: AuthService,
      private router: Router
  ) {
      super(er, service);
  }

  onCanPlay(e: any) {
    e.target.muted = true;
    e.target.play();
  }

  onSignup() {}

  onPressSignin() {}

  onClickForgotPassword() {}
}
