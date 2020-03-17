import { GridAction, SortDirection, SortItem } from './../../../models-manual';
import { combinedCashProceduresGridHeaderData } from './../../../../test/data/combined-cash-procedures-grid';
import { IconComponent } from './../icon/icon.component';
import { GridHeaderComponent } from './grid-header.component';
import { ComponentFixture, async, TestBed, tick, fakeAsync } from '@angular/core/testing';
describe('GridHeaderComponent', () => {
  let component: GridHeaderComponent;
  let fixture: ComponentFixture<GridHeaderComponent>;
  let el: HTMLElement;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [GridHeaderComponent, IconComponent],
      providers: []
    }).compileComponents();
    fixture = TestBed.createComponent(GridHeaderComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement.nativeElement;

    // load data
    component.data = combinedCashProceduresGridHeaderData;

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 2 rows header', () => {
    const rows = el.querySelectorAll('tr');
    expect(rows.length === 2).toBeTruthy();
  });

  it('should trigger GridAction.SORT DESC action', () => {
    let action: GridAction;
    let sort: SortItem;
    component.action.subscribe(e => {
      // console.log(e);
      action = e.action;
      sort = e.sort;
    });
    const sortableCellEl: HTMLElement = el.querySelector('.is-sortable');
    sortableCellEl.click();
    expect(action === GridAction.SORT && sort.direction === SortDirection.DESC).toBeTruthy();
  });

  it('should trigger GridAction.SORT ASC action', () => {
    let action: GridAction;
    let sort: SortItem;
    component.action.subscribe(e => {
      // console.log(e);
      action = e.action;
      sort = e.sort;
    });
    const sortableCellEl: HTMLElement = el.querySelector('.is-sortable');
    sortableCellEl.click();
    sortableCellEl.click();
    expect(action === GridAction.SORT && sort.direction === SortDirection.ASC).toBeTruthy();
  });
});
