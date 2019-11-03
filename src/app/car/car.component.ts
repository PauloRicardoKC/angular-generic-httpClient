import { CarService } from './../services/car.service';
import { Component, OnInit } from '@angular/core';
import { Car } from '../models/car';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent implements OnInit {
  
  car = {} as Car;
  cars: Car[];

  constructor(private carService: CarService) { }

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this.carService.get().subscribe((cars: Car[]) => {
      this.cars = cars;

      console.log(this.cars)
    });
  }  

  save(form: NgForm) {
    if (this.car.id !== undefined) {
      this.carService.update(this.car).subscribe(() => {
        this.cleanForm(form);
      });
    } else {
      this.carService.create(this.car).subscribe(() => {
        this.cleanForm(form);
      });
    }
  }

  edit(car: Car) {
    this.car = { ...car };
  }  

  delete(car: Car) {
    this.carService.delete(car).subscribe(() => {
      this.getAll();
    });
  }

  cleanForm(form: NgForm) {
    this.getAll();
    form.resetForm();
    this.car = {} as Car;
  }  
}