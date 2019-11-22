import {
  NgModule
} from '@angular/core';
import {
  RouterModule,
  Routes
} from '@angular/router';
import {
  GridExampleComponent,
  ListExampleComponent
} from './';
import { ExampleComponent } from './example.component';

const exampleRoutes: Routes = [{
  path: '',
  component: ExampleComponent,
  children: [{
    path: 'list',
    component: ListExampleComponent
  }, {
    path: 'grid',
    component: GridExampleComponent
  }]
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
