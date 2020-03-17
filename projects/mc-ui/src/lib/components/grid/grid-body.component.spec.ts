import { GridAction, GridCellInfo } from './../../../models-manual';
import { combinedCashProceduresGridBodyData } from './../../../../test/data/combined-cash-procedures-grid';
import { GridBodyComponent } from './grid-body.component';
import { ComponentFixture, async, TestBed, tick, fakeAsync } from '@angular/core/testing';
describe('GridBodyComponent', () => {
  let component: GridBodyComponent;
  let fixture: ComponentFixture<GridBodyComponent>;
  let el: HTMLElement;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [GridBodyComponent],
      providers: []
    }).compileComponents();
    fixture = TestBed.createComponent(GridBodyComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement.nativeElement;

    // load data
    component.data = combinedCashProceduresGridBodyData;

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should trigger GridAction.SELECT_CELL action', () => {
    let action: GridAction;
    component.action.subscribe(e => {
      // console.log(e);
      action = e.action;
    });
    const td: HTMLElement = el.querySelector('td:not(.unselectable).grid-body--row--cell');
    td.click();
    expect(action === GridAction.SELECT_CELL).toBeTruthy();
  });

  it('should not trigger GridAction.SELECT_CELL action when it has ".unselectable" class name', () => {
    let action: GridAction;
    component.action.subscribe(e => {
      // console.log(e);
      action = e.action;
    });
    const td: HTMLElement = el.querySelector('td.unselectable');
    td.click();
    expect(!action).toBeTruthy();
  });
});
