import { IconComponent } from './icon.component';
import { ComponentFixture, async, TestBed, tick, fakeAsync } from '@angular/core/testing';
describe('IconComponent', () => {
  let component: IconComponent;
  let fixture: ComponentFixture<IconComponent>;
  let el: HTMLElement;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [IconComponent],
      providers: []
    }).compileComponents();
    fixture = TestBed.createComponent(IconComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement.nativeElement;

    // load data
    component.icon = 'chevron';

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the "chevron" icon', () => {
    expect(el.classList.contains('icon-chevron')).toBeTruthy();
  });
});
