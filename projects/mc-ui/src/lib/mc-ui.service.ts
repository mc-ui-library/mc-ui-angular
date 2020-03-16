import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class McUiService {

  private _message = new BehaviorSubject<Message>({ from: '', to: '', action: '' });
  message = this._message.asObservable();
  windowResize: Observable<any>;
  bodyPress: Observable<any>;

  private data = new Map();

  constructor(private _resolver: ComponentFactoryResolver, private injector: Injector, private appRef: ApplicationRef) {
    this.bodyPress = fromEvent(this.getBody(), 'click');
    this.windowResize = fromEvent(window, 'resize');
  }

  // for global data
  setData(key: any, value: any) {
    this.data.set(key, value);
  }

  getData(key: any) {
    return this.data.get(key);
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
