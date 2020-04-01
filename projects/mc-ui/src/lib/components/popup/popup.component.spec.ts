import { PopupConfig } from '../../shared.models';
import { SharedService } from './../../shared.service';
import { ComponentFixture, async, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PopupComponent } from './popup.component';
describe('PopupComponent', () => {
  let component: PopupComponent;
  let fixture: ComponentFixture<PopupComponent>;
  let el: HTMLElement;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [PopupComponent],
      providers: [SharedService]
    }).compileComponents();
    fixture = TestBed.createComponent(PopupComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement.nativeElement;

    // load data
    const config: PopupConfig = {
      targetEl: document.body
    };
    component.config = config;
    component.show();

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show or hide the popup when visible is true or false', () => {
    component.hide();
    fixture.detectChanges();
    expect(el.style.display).toBe('none', 'hide popup');
    component.show();
    fixture.detectChanges();
    expect(el.style.display).toBe('', 'show popup');
  });

  it('should be changed the start point from start to center', fakeAsync(() => {
    component.config = { startFrom: 'start' };
    component.resize();
    tick();
    fixture.detectChanges();
    // console.log(el.style.left);
    const left = el.style.left;
    component.config = { startFrom: 'center' };
    component.resize();
    tick();
    fixture.detectChanges();
    // console.log(el.style.left);
    expect(el.style.left).not.toBe(left, 'it is resized and start from the center of the target el');
  }));

  it('should destroy', () => {
    component.hide();
    fixture.detectChanges();
    fixture.destroy();
    expect(document.body.querySelector('mc-popup')).toBeNull();
  });
});
