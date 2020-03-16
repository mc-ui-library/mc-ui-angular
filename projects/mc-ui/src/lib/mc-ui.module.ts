import { NgModule } from '@angular/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ScrollComponent, ScrollbarComponent, LoaderComponent } from './components';

@NgModule({
  declarations: [ScrollComponent, ScrollbarComponent, LoaderComponent],
  imports: [
    PerfectScrollbarModule
  ],
  exports: [ScrollComponent, ScrollbarComponent, LoaderComponent]
})
export class McUiModule { }
