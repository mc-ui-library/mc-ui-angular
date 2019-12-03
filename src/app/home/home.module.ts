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
import { ExampleModule } from './example/example.module';
import { HomeHeaderComponent } from './home-header/home-header.component';

@NgModule({
    imports: [MCUIModule, HomeRoutingModule, ExampleModule],
    declarations: [
        HomeComponent,
        HomeHeaderComponent,
    ],
    entryComponents: [
    ],
    providers: [
        HomeService,
    ]
})
export class HomeModule {}
