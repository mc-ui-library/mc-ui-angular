import {
  CommonModule
} from '@angular/common';
import {
  NgModule
} from '@angular/core';
import {
  RouterModule
} from '@angular/router';
import {
  MCUIService,
  TextareaComponent
} from '.';
import {
  InputComponent,
  FormComponent,
  ListComponent,
  ButtonComponent,
  FieldComponent,
  IconComponent,
  ListItemComponent,
  LoaderComponent,
  DrawerComponent,
  MessageBarComponent,
  InfiniteListComponent,
  InfiniteScrollComponent,
  PopupComponent,
  PopupMaskComponent,
  MaskComponent,
  GridHeaderComponent,
  GridBodyComponent,
  GridComponent
} from './component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule
  ],
  declarations: [
    FieldComponent,
    TextareaComponent,
    InputComponent,
    FormComponent,
    InfiniteScrollComponent,
    InfiniteListComponent,
    ListComponent,
    ButtonComponent,
    IconComponent,
    ListItemComponent,
    LoaderComponent,
    DrawerComponent,
    MessageBarComponent,
    GridHeaderComponent,
    GridBodyComponent,
    GridComponent,
    MaskComponent,
    PopupComponent,
    PopupMaskComponent
  ],
  entryComponents: [
    PopupComponent,
    PopupMaskComponent,
    DrawerComponent
  ],
  exports: [
    CommonModule,
    RouterModule,
    FieldComponent,
    TextareaComponent,
    InputComponent,
    FormComponent,
    InfiniteScrollComponent,
    InfiniteListComponent,
    ListComponent,
    ButtonComponent,
    IconComponent,
    ListItemComponent,
    LoaderComponent,
    DrawerComponent,
    MessageBarComponent,
    GridHeaderComponent,
    GridBodyComponent,
    GridComponent,
    MaskComponent,
    PopupComponent,
    PopupMaskComponent
  ],
  providers: [MCUIService]
})
export class MCUIModule {}
