import { MCUIService } from '../../../mc-ui.service';
import { BaseComponent } from '../../base.component';
import {
  Component,
  Input,
  ElementRef,
  HostBinding,
  HostListener
} from '@angular/core';

@Component({
  selector: 'mc-chart-legend',
  styleUrls: ['chart-legend.component.scss'],
  templateUrl: 'chart-legend.component.html'
})

export class BarChartComponent extends BaseComponent {

  constructor(protected er: ElementRef, protected service: MCUIService) {
    super(er, service);
  }
}
