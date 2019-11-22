import {
    NgModule
} from '@angular/core';
import {
    HomeComponent,
    HomeService,
} from '.';
import {
    MCUIModule
  } from 'mc-ui-angular';
import {
    HomeRoutingModule
} from './home-routing.module';
import { HomeLeftMenuComponent } from './home-left-menu/home-left-menu.component';
import { ExampleModule } from './example/example.module';

@NgModule({
    imports: [MCUIModule, HomeRoutingModule, ExampleModule],
    declarations: [
        HomeComponent,
        HomeLeftMenuComponent,
    ],
    entryComponents: [
    ],
    providers: [
        HomeService,
    ]
})
export class HomeModule {}
