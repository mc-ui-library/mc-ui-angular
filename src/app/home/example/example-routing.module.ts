import {
  NgModule
} from '@angular/core';
import {
  RouterModule,
  Routes
} from '@angular/router';
import { ExampleComponent } from './example.component';

const exampleRoutes: Routes = [{
  path: '',
  component: ExampleComponent,
  children: []
}];

@NgModule({
  imports: [
    RouterModule.forChild(exampleRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ExampleRoutingModule {}
