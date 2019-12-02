import {
  NgModule
} from '@angular/core';
import {
  RouterModule,
  Routes
} from '@angular/router';
import {
  HomeComponent,
} from '.';

const homeRoutes: Routes = [{
  path: 'home',
  component: HomeComponent,
  children: [
    {
      path: 'example',
      loadChildren: './example/example.module#ExampleModule'
    }
  ]
}];

@NgModule({
  imports: [
    RouterModule.forChild(homeRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class HomeRoutingModule {}
