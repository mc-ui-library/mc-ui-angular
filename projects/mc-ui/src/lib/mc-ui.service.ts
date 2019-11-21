import {
  Injectable,
  EventEmitter,
  ComponentFactoryResolver,
  Injector,
  ApplicationRef
} from '@angular/core';
import {
  HttpClient
} from '@angular/common/http';
import {
  Util
} from './util/util';

interface Message {
  from ? : string;
  to: string;
  action: string;
  data: any;
}

/**
 * App Level shared services e.g) Dynamic Components or EventEmitters for sending message between UI Page Componensts, window resize etc.
 */
@Injectable()
export class MCUIService {

  util: Util;

  message: EventEmitter < any > = new EventEmitter();
  windowResize: EventEmitter < any > = new EventEmitter();
  bodyPress: EventEmitter < any > = new EventEmitter();

  constructor(private _resolver: ComponentFactoryResolver, private injector: Injector, private appRef: ApplicationRef, private hc: HttpClient) {
    this.util = new Util(this.hc);
    this.getBody().addEventListener('click', this.onClickBody.bind(this));
    window.addEventListener('resize', this.onResizeWindow.bind(this));
  }

  sendMessage(message: Message) {
    this.message.emit(message);
  }

  addComponent(cmpType: any, parentEl = document.body) {
    // https://malcoded.com/posts/angular-dynamic-components/
    const factory = this._resolver.resolveComponentFactory(cmpType);
    const cmp: any = factory.create(this.injector);
    this.appRef.attachView(cmp.hostView);
    parentEl.appendChild(cmp.location.nativeElement);
    return cmp;
  }

  removeComponentEl(cmp) {
    this.appRef.detachView(cmp.hostView);
    cmp.destroy();
  }

  getBody() {
    return document.body;
  }

  onClickBody(e: any) {
    this.bodyPress.emit(e);
  }

  onResizeWindow(e: any) {
    this.windowResize.emit(e);
  }
}
