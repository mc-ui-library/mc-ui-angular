import {
  Component,
  ViewContainerRef,
  ViewChild,
  TemplateRef
} from '@angular/core';
import {
  AppBaseComponent
} from 'src/app/app-base.component';
import { MCUIService, PopupComponent, DrawerComponent } from 'mc-ui-angular';
import { HomeService } from '../../home.service';

@Component({
  selector: 'mc-grid-example',
  templateUrl: './grid-example.component.html',
  styleUrls: ['./grid-example.component.scss']
})
export class GridExampleComponent extends AppBaseComponent {

  private popupCmp: any;
  private drawerCmp: any;

  data = this.homeService.getUserListMock().data;
  gridCell: any = {};

  @ViewChild('popupTpl', {static: false}) popupTpl: TemplateRef<any>;
  @ViewChild('drawerTpl', {static: false}) drawerTpl: TemplateRef<any>;

  constructor(
    protected er: ViewContainerRef,
    protected service: MCUIService,
    private homeService: HomeService
  ) {
    super(er, service);
  }

  showPopup(el) {
    let instance = this.popupCmp ? this.popupCmp.instance : null;
    if (!this.popupCmp) {
      // add to root
      this.popupCmp = this.service.addComponent(PopupComponent);
      instance = this.popupCmp.instance;
      instance.tpl = this.popupTpl;
      instance.theme = 'audit';
      instance.hasIndicator = true;
      instance.checkTargetLocation = true;
    }
    instance.targetEl = el;
    instance.visible = true;
  }

  showDrawer() {
    let instance = this.drawerCmp ? this.drawerCmp.instance : null;
    if (!this.drawerCmp) {
      // add to root
      this.drawerCmp = this.service.addComponent(DrawerComponent);
      instance = this.drawerCmp.instance;
      instance.from = 'right';
      instance.mask = false;
      instance.tpl = this.drawerTpl;
    }
    instance.visible = true;
  }

  getCellValue(id) {
    return this.data.find(d => id + '' === d.id + '');
  }

  onGridAction(e) {
    switch (e.action) {
      case 'select-cell':
        const rowData = this.getCellValue(e.id);
        e.value = rowData[e.field];
        e.name = rowData['name'];
        this.gridCell = e;
        if (e.field !== 'friends') {
          this.showPopup(e.el);
        } else {
          this.showDrawer();
        }
        break;
    }
  }

  destroyCmp() {
    if (this.popupCmp) {
      this.popupCmp.destroy();
    }
    if (this.drawerCmp) {
      this.drawerCmp.destroy();
    }
  }
}
