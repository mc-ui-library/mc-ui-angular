import {
    NgModule
} from '@angular/core';
import {
    MCUIModule
  } from 'mc-ui-angular';
import { ExampleRoutingModule } from './example-routing.module';
import { ExampleComponent } from './example.component';

@NgModule({
    imports: [MCUIModule, ExampleRoutingModule],
    declarations: [
        ExampleComponent
    ],
    entryComponents: [
    ],
    providers: []
})
export class ExampleModule {}
