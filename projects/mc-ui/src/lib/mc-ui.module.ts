import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedService } from './shared.service';
import {
  ListComponent,
  IconComponent,
  ListItemComponent,
  PopupComponent,
  ScrollbarComponent,
  DrawerComponent,
  MaskComponent,
  GridComponent,
  GridBodyComponent,
  GridHeaderComponent,
  ScrollComponent,
  LoaderComponent,
  VisualizerComponent,
  TextComponent,
  BarComponent
} from './components';
import {
  PerfectScrollbarModule
} from 'ngx-perfect-scrollbar';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [CommonModule, BrowserModule, RouterModule, HttpClientModule, PerfectScrollbarModule],
  declarations: [
    ListComponent,
    IconComponent,
    ListItemComponent,
    MaskComponent,
    DrawerComponent,
    ScrollbarComponent,
    GridComponent,
    GridBodyComponent,
    GridHeaderComponent,
    ScrollComponent,
    LoaderComponent,
    PopupComponent,
    VisualizerComponent,
    BarComponent,
    TextComponent
  ],
  exports: [
    ListComponent,
    IconComponent,
    ListItemComponent,
    MaskComponent,
    DrawerComponent,
    ScrollbarComponent,
    GridComponent,
    GridBodyComponent,
    GridHeaderComponent,
    ScrollComponent,
    LoaderComponent,
    PopupComponent,
    VisualizerComponent,
    BarComponent,
    TextComponent
  ],
  providers: [
    SharedService
  ]
})
export class McUiModule {}
