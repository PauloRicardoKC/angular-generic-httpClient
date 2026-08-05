import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrandComponent } from './brand/brand.component';
import { CarComponent } from './car/car.component';

export const routes: Routes = [
  { path: '', redirectTo: 'carros', pathMatch: 'full' },
  { path: 'carros', component: CarComponent },
  { path: 'marcas', component: BrandComponent },
  { path: '**', redirectTo: 'carros' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
