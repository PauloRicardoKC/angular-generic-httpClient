import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { Car } from '../models/car';
import { BaseService } from './base-service.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CarService extends BaseService<Car> {

  constructor(httpClient: HttpClient) { 
    super(
      httpClient,
      environment.url,
      environment.endPointCars);
  }
}
