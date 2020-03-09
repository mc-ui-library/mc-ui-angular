import {
  Injectable,
  EventEmitter,
  ComponentFactoryResolver,
  Injector,
  ApplicationRef
} from '@angular/core';
import { BehaviorSubject, Observable, fromEvent } from 'rxjs';
import { Message } from './models';

/**
 * App Level shared services e.g) Dynamic Components or EventEmitters for sending message between UI Page Componensts, window resize etc.
 */
@Injectable()
export class MCUIService {

  private _message = new BehaviorSubject<Message>({ from: '', to: '', action: '' });
  message = this._message.asObservable();
  windowResize: Observable<any>;
  bodyPress: Observable<any>;

  constructor(private _resolver: ComponentFactoryResolver, private injector: Injector, private appRef: ApplicationRef) {
    this.bodyPress = fromEvent(this.getBody(), 'click');
    this.windowResize = fromEvent(window, 'resize');
  }

  // Sending a message between components that can't be accessed by Input/Output
  sendMessage(message: Message) {
    this._message.next(message);
  }

  addComponent(cmpType: any, parentEl = document.body) {
    // https://malcoded.com/posts/angular-dynamic-components/
    const factory = this._resolver.resolveComponentFactory(cmpType);
    const cmp: any = factory.create(this.injector);
    this.appRef.attachView(cmp.hostView);
    parentEl.appendChild(cmp.location.nativeElement);
    return cmp;
  }

  removeComponent(cmp) {
    this.appRef.detachView(cmp.hostView);
    cmp.destroy();
    cmp = null;
  }

  getBody() {
    return document.body;
  }
}
