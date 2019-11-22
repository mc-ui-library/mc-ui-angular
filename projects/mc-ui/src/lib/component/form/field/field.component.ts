// This component covers all of the form fields
import {
  Component,
  ViewChild,
  
  ElementRef
} from '@angular/core';
import {
  InputComponent
} from './input/input.component';
import {
  TextareaComponent
} from './textarea/textarea.component';
import { FieldBaseComponent } from './field-base.component';
import { MCUIService } from '../../../mc-ui.service';

@Component({
  selector: 'mc-field',
  styleUrls: ['field.component.scss'],
  templateUrl: './field.component.html'
})
export class FieldComponent extends FieldBaseComponent {

  @ViewChild(InputComponent, {static: false}) fieldInputCmp: InputComponent;
  @ViewChild(TextareaComponent, {static: false}) fieldTextareaCmp: TextareaComponent;

  constructor(protected er: ElementRef, protected service: MCUIService) {
    super(er, service);
  }

}
