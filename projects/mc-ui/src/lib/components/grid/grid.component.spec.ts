import { combinedCashProceduresGridHeaderData, combinedCashProceduresGridData } from './../../../../test/data/combined-cash-procedures-grid';
import { SharedService } from './../../shared.service';
import { LoaderComponent } from './../loader/loader.component';
import { IconComponent } from './../icon/icon.component';
import { ScrollComponent } from './../scroll/scroll.component';
import { GridBodyComponent } from './grid-body.component';
import { GridHeaderComponent } from './grid-header.component';
import { GridComponent } from './grid.component';
import { ComponentFixture, async, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
describe('GridComponent', () => {
  let component: GridComponent;
  let fixture: ComponentFixture<GridComponent>;
  let el: HTMLElement;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PerfectScrollbarModule],
      declarations: [GridComponent, GridHeaderComponent, GridBodyComponent, ScrollComponent, IconComponent, LoaderComponent],
      providers: [SharedService]
    }).compileComponents();
    fixture = TestBed.createComponent(GridComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement.nativeElement;

    // load data
    component.headerData = combinedCashProceduresGridHeaderData;
    component.data = combinedCashProceduresGridData;

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
