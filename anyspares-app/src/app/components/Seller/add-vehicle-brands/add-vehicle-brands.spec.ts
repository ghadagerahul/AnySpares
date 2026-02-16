import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVehicleBrands } from './add-vehicle-brands';

describe('AddVehicleBrands', () => {
  let component: AddVehicleBrands;
  let fixture: ComponentFixture<AddVehicleBrands>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddVehicleBrands]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddVehicleBrands);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
