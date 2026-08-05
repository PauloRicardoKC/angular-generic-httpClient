import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { CarService } from '../services/car.service';
import { CarComponent } from './car.component';

describe('CarComponent', () => {
  let component: CarComponent;
  let fixture: ComponentFixture<CarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CarComponent],
      providers: [
        {
          provide: CarService,
          useValue: {
            get: () => of([]),
            create: () => of({}),
            update: () => of({}),
            delete: () => of({})
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
