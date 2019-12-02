import {
  Component,
  ViewContainerRef,

  HostBinding,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  AppBaseComponent
} from '../../index';
import {
  Router
} from '@angular/router';
import {
  MCUIService
} from 'mc-ui-angular';
import { HomeService } from '../home.service';

@Component({
  selector: 'mc-home-left-menu',
  styleUrls: ['home-left-menu.component.scss'],
  templateUrl: 'home-left-menu.component.html'
})
export class HomeLeftMenuComponent extends AppBaseComponent {

  private isMinWidth = false;

  menuData = this.homeService.getMenuList();

  @HostBinding('class.minimized') private minimized = false;
  @HostBinding('class.active-hover') private hover = false;

  @Output() minimize: EventEmitter < any > = new EventEmitter();

  constructor(
    protected er: ViewContainerRef,
    protected service: MCUIService,
    private homeService: HomeService,
    private router: Router,
  ) {
    super(er, service);
    this.subscriptions = this.service.windowResize.subscribe(_ => this.toggleSize());
  }

  toggleSize() {
    const size = this.service.util.getWindowSize();
    if (size.width < 960) {
      if (!this.isMinWidth) {
        this.isMinWidth = true;
        this.hover = true;
      }
    } else {
      if (this.isMinWidth) {
        // when bigger, automatically has big menu.
        this.isMinWidth = false;
        this.minimized = false;
        this.hover = false;
        this.minimize.emit(this.minimized);
      }
    }
  }

  onClickMenuButton() {
    // when minimizig, hovering should not work.
    // after minimized, hovering should work.
    // when window width is under 960, keep the hover.
    this.minimized = !this.minimized;
    this.minimize.emit(this.minimized);
    if (this.minimized) {
      setTimeout(() => this.hover = true, 200);
    } else {
      if (!this.isMinWidth) {
        this.hover = false;
      }
    }
  }

  onListAction(e) {
    switch (e.action) {
      case 'select-item':
        this.router.navigate([e.data.id]);
        break;
    }
  }
}
