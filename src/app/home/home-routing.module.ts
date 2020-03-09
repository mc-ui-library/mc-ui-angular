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
      loadChildren: () => import('./example/example.module').then(m => m.ExampleModule)
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
