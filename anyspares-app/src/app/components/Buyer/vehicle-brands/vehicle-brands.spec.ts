import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleBrands } from './vehicle-brands';

describe('VehicleBrands', () => {
  let component: VehicleBrands;
  let fixture: ComponentFixture<VehicleBrands>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleBrands]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleBrands);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
