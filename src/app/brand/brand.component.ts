import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Brand } from '../models/brand';
import { BrandService } from '../services/brand.service';

@Component({
  selector: 'app-brand',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.css']
})
export class BrandComponent implements OnInit {
  brand: Brand = {} as Brand;
  brands: Brand[] = [];

  constructor(private readonly brandService: BrandService) {}

  ngOnInit(): void {
    this.getAll();
  }

  getAll(): void {
    this.brandService.get().subscribe((brands: Brand[]) => {
      this.brands = brands;
    });
  }

  save(form: NgForm): void {
    if (this.brand.id !== undefined) {
      this.brandService.update(this.brand).subscribe(() => {
        this.cleanForm(form);
      });
      return;
    }

    this.brandService.create(this.brand).subscribe(() => {
      this.cleanForm(form);
    });
  }

  edit(brand: Brand): void {
    this.brand = { ...brand };
  }

  delete(brand: Brand): void {
    this.brandService.delete(brand).subscribe(() => {
      this.getAll();
    });
  }

  cleanForm(form: NgForm): void {
    this.getAll();
    form.resetForm();
    this.brand = {} as Brand;
  }
}