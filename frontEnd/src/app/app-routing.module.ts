import { CreateHouseComponent } from './create-house/create-house.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HousesComponent } from './houses/houses.component';

const routes: Routes = [
  {
    path: 'createHouse',
    component: CreateHouseComponent
  },
  {
    path: 'houses',
    component: HousesComponent
  },
  {
    path: '',
    redirectTo: '/houses',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
