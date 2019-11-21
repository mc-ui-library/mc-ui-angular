import {
  CommonModule
} from '@angular/common';
import {
  NgModule
} from '@angular/core';
import {
  RouterModule
} from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FieldComponent } from './component/form/field/field.component';
import { TextareaComponent } from './component/form/field/textarea/textarea.component';
import { InputComponent } from './component/form/field/input/input.component';
import { FormComponent } from './component/form/form.component';
import { InfiniteScrollComponent } from './component/infinite-scroll/infinite-scroll.component';
import { InfiniteListComponent } from './component/list/infinite-list.component';
import { ListComponent } from './component/list/list.component';
import { ButtonComponent } from './component/button/button.component';
import { IconComponent } from './component/icon/icon.component';
import { ListItemComponent } from './component/list/list-item.component';
import { LoaderComponent } from './component/loader/loader.component';
import { DrawerComponent } from './component/drawer/drawer.component';
import { MessageBarComponent } from './component/message-bar/message-bar.component';
import { GridHeaderComponent } from './component/grid/grid-header.component';
import { GridBodyComponent } from './component/grid/grid-body.component';
import { MaskComponent } from './component/mask/mask.component';
import { GridComponent } from './component/grid/grid.component';
import { PopupComponent } from './component/popup/popup.component';
import { PopupMaskComponent } from './component/popup/popup-mask.component';
import { MCUIService } from './mc-ui.service';

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
