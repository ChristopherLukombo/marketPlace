import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateHouseComponent } from './create-house/create-house.component';
import { HouseInfoComponent } from './house-info/house-info.component';
import { HousesComponent } from './houses/houses.component';

const routes: Routes = [
  {
    path: 'createHouse',
    component: CreateHouseComponent
  },
  {
    path: 'houseInfo/:idHouse',
    component: HouseInfoComponent
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
