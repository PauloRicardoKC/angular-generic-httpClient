import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Car } from '../models/car';
import { CarService } from '../services/car.service';

@Component({
  selector: 'app-car',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent implements OnInit {
  car: Car = {} as Car;
  cars: Car[] = [];

  constructor(private readonly carService: CarService) {}

  ngOnInit(): void {
    this.getAll();
  }

  getAll(): void {
    this.carService.get().subscribe((cars: Car[]) => {
      this.cars = cars;
    });
  }

  save(form: NgForm): void {
    if (this.car.id !== undefined) {
      this.carService.update(this.car).subscribe(() => {
        this.cleanForm(form);
      });
      return;
    }

    this.carService.create(this.car).subscribe(() => {
      this.cleanForm(form);
    });
  }

  edit(car: Car): void {
    this.car = { ...car };
  }

  delete(car: Car): void {
    this.carService.delete(car).subscribe(() => {
      this.getAll();
    });
  }

  cleanForm(form: NgForm): void {
    this.getAll();
    form.resetForm();
    this.car = {} as Car;
  }
}