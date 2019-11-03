import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Brand } from '../models/brand';
import { BaseService } from './base-service.service';

@Injectable({
  providedIn: 'root'
})
export class BrandService extends BaseService<Brand> {

  constructor(httpClient: HttpClient) { 
    super(
      httpClient,
      environment.url,
      environment.endPointBrand);
  }
}
