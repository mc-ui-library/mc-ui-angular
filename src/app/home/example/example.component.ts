import {
  Component,
  ViewContainerRef,
  ViewChild
} from '@angular/core';
import {
  AppBaseComponent
} from '../../index';
import { MCUIService, PopupComponent, DrawerComponent, ScrollData } from 'projects/mc-ui/src/public-api';
import {
  HomeService
} from '../home.service';
import {
  TemplateRef
} from '@angular/core';

@Component({
  selector: 'mc-example',
  styleUrls: ['example.component.scss'],
  templateUrl: 'example.component.html'
})
export class ExampleComponent extends AppBaseComponent {

  private popupCmp: any;
  private drawerCmp: any;

  data = this.homeService.getUserListMock().data;
  gridCell: any = {};
  dropdownData = this.data.concat();
  listBasicToggleData = this.data.slice(0, 10);
  listBasicTagsData = this.data.map((d, i) => this.getTagThemeItem(d, i)).slice(0, 10);
  listData = this.data.concat();
  gridBasicData = this.data.slice(0, 20);
  gridData = this.data.concat();
  gridCustomData = this.getCustomGridData();

  @ViewChild('popupTpl', {
    static: false
  }) popupTpl: TemplateRef<any>;
  @ViewChild('drawerTpl', {
    static: false
  }) drawerTpl: TemplateRef<any>;

  constructor(
    protected er: ViewContainerRef,
    protected service: MCUIService,
    private homeService: HomeService
  ) {
    super(er, service);
  }

  getCustomGridData() {
    const headerData = [
      [
        { name: 'ID', rowspan: 2 },
        { name: 'Active', rowspan: 2 },
        { name: 'Balance', rowspan: 2 },
        { name: 'Tags', rowspan: 2 },
        { name: 'Personal Detail', colspan: 5 },
        { name: 'Contact Info', colspan: 3 },
      ],
      [
        { name: 'Age' },
        { name: 'Eye Color' },
        { name: 'Name' },
        { name: 'Gender' },
        { name: 'Company' },
        { name: 'Email' },
        { name: 'Mobile' },
        { name: 'Address' },
      ]
    ];
    const columns = [
      {
        field: 'id'
      }, {
        field: 'isActive'
      }, {
        field: 'balance'
      }, {
        field: 'tags'
      }, {
        field: 'age'
      }, {
        field: 'eyeColor'
      }, {
        field: 'name'
      }, {
        field: 'gender'
      }, {
        field: 'company'
      }, {
        field: 'email'
      }, {
        field: 'phone'
      }, {
        field: 'address'
      }
    ];

    const data = {
      headerData,
      columns,
      rows: this.data.map((d: any) => {
        d.tags = d.tags ? d.tags.map((d, i) => this.getTagThemeItem(d, i)) : null;
        return d;
      })
    };
    return data;
  }

  getTagThemeItem(d: any, i: number) {
    const item = {
      id: d.id ? d.id : d,
      name: d.name ? d.name : d,
      theme: ['tag']
    };
    if (i % 2 === 0) {
      item.theme.push('tag-orange');
    }
    return item;
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
        e.name = rowData.name;
        this.gridCell = e;
        if (e.field !== 'friends') {
          const value = this.gridCell.value;
          this.gridCell.value = Array.isArray(value) ? value.map((d, i) => this.getTagThemeItem(d, i)) : value;
          this.showPopup(e.el);
        } else {
          this.showDrawer();
        }
        break;
    }
  }

  onDropdownNeedData(e) {
    switch (e.action) {
      case 'filter':
        this.dropdownData = this.service.util.data.search(this.data, e.keyword, 'name');
        // console.log('dropdown filter', this.dropdownData);
        break;
    }
  }

  destroyCmp() {
    if (this.popupCmp) {
      this.service.removeComponent(this.popupCmp);
    }
    if (this.drawerCmp) {
      this.service.removeComponent(this.drawerCmp);
    }
  }
}
