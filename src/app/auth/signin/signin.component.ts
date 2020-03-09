
import {
  Component,
  ViewContainerRef} from '@angular/core';
import {
  AppBaseComponent
} from '../../index';

@Component({
  selector: 'mc-signin',
  styleUrls: ['signin.component.scss'],
  templateUrl: 'signin.component.html'
})
export class SigninComponent extends AppBaseComponent {

  constructor(
      protected er: ViewContainerRef
  ) {
      super(er);
  }

  onCanPlay(e: any) {
    e.target.muted = true;
    e.target.play();
  }

  onSignup() {}

  onPressSignin() {}

  onClickForgotPassword() {}
}
