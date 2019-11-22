import {
  Component,
  ContentChildren,
  QueryList,
  ElementRef,
  Input
} from '@angular/core';
import {
  FieldComponent
} from './field/field.component';
import {
  BaseComponent
} from '../base.component';
import {
  MCUIService
} from '../../mc-ui.service';

@Component({
  selector: 'mc-form',
  styleUrls: ['form.component.scss'],
  templateUrl: './form.component.html'
})

export class FormComponent extends BaseComponent {

  private values: any;
  private inputCmps = [];

  private _readonly;

  @Input()
  set readonly(value) {
    this._readonly = value;
    this.applyReadonly();
  }
  get readonly() {
    return this._readonly;
  }

  @ContentChildren(FieldComponent) contentInputCmps: QueryList < FieldComponent > ;

  constructor(protected er: ElementRef, protected service: MCUIService) {
    super(er, service);
  }

  afterInitCmp() {
    this.updateFieldsInfo();
    this.contentInputCmps.changes.subscribe(() => {
      setTimeout(() => this.updateFieldsInfo());
    });
  }

  updateFieldsInfo() {
    this.values = {};
    this.inputCmps = [];
    // gathering fields
    if (this.contentInputCmps) {
      this.contentInputCmps.forEach(cmp => this.inputCmps.push(cmp));
    }
    this.applyReadonly();
  }

  applyReadonly() {
    setTimeout(() => this.inputCmps.forEach(cmp => cmp.readonly = this._readonly));
  }

  getValues() {
    const isEmpty = this.util.isEmpty;
    this.values = this.inputCmps.reduce((values, cmp) => {
      values[cmp.name] = isEmpty(cmp.value) ? '' : cmp.value;
      return values;
    }, {});
    return this.values;
  }
}
