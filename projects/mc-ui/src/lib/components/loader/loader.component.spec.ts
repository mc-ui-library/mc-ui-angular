import { LoaderComponent } from './loader.component';
import { ComponentFixture, async, TestBed, tick, fakeAsync } from '@angular/core/testing';
describe('LoaderComponent', () => {
  let component: LoaderComponent;
  let fixture: ComponentFixture<LoaderComponent>;
  let el: HTMLElement;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [LoaderComponent],
      providers: []
    }).compileComponents();
    fixture = TestBed.createComponent(LoaderComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement.nativeElement;

    // load data
    component.theme = 'horizontal';

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the "horizontal" theme', () => {
    console.log(el);
    expect(el.className.indexOf('-horizontal') > -1).toBeTruthy();
  });
});
