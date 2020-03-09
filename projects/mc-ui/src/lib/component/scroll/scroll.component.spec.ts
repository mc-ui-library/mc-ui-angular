import { LoaderComponent } from './../loader/loader.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ScrollComponent } from './scroll.component';
import { ComponentFixture, async, TestBed, tick, fakeAsync } from '@angular/core/testing';
describe('ScrollComponent', () => {
  let component: ScrollComponent;
  let fixture: ComponentFixture<ScrollComponent>;
  let el: HTMLElement;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PerfectScrollbarModule],
      declarations: [ScrollComponent, LoaderComponent],
      providers: []
    }).compileComponents();
    fixture = TestBed.createComponent(ScrollComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement.nativeElement;

    // load data
    component.rowCount = 100;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Content Height should be rowCount * rowHeight', fakeAsync(() => {
    el.parentElement.style.height = '100px';
    component.updateState();
    tick();
    fixture.detectChanges();
    const contentEl: HTMLElement = el.querySelector('.scroll--content');
    // console.log(contentEl.style.height, component.rowCount, component.rowHeight, component.state);
    expect(contentEl.style.height === (component.rowCount * component.rowHeight) + 'px').toBeTruthy();
  }));

  it('Should display the loading text when loading', fakeAsync(() => {
    component.rowCount = 0;
    component.isLoading = true;
    tick();
    fixture.detectChanges();
    const messageEl: HTMLElement = el.querySelector('.scroll--empty');
    expect(messageEl.innerText === component.loadingText).toBeTruthy();
  }));
});
