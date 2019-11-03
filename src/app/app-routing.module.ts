import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CarComponent } from './car/car.component';
import { BrandComponent } from './brand/brand.component';
import { AppComponent } from './app.component';


const routes: Routes = [
  { path: 'carros', component: CarComponent },
  { path: 'marcas', component: BrandComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
