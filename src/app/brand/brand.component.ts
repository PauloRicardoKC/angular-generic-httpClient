import { Component, OnInit } from '@angular/core';
import { Brand } from '../models/brand';
import { BrandService } from '../services/brand.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.css']
})
export class BrandComponent implements OnInit {

  brand = {} as Brand;
  brands: Brand[];

  constructor(private brandService: BrandService) { }

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this.brandService.get().subscribe((brands: Brand[]) => {
      this.brands = brands;
    });
  }  

  save(form: NgForm) {
    if (this.brand.id !== undefined) {
      this.brandService.update(this.brand).subscribe(() => {
        this.cleanForm(form);
      });
    } else {
      this.brandService.create(this.brand).subscribe(() => {
        this.cleanForm(form);
      });
    }
  }

  edit(brand: Brand) {
    this.brand = { ...brand };
  }  

  delete(Brand: Brand) {
    this.brandService.delete(Brand).subscribe(() => {
      this.getAll();
    });
  }

  cleanForm(form: NgForm) {
    this.getAll();
    form.resetForm();
    this.brand = {} as Brand;
  } 
}