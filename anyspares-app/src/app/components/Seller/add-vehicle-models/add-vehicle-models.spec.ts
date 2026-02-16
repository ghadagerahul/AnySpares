import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVehicleModels } from './add-vehicle-models';

describe('AddVehicleModels', () => {
  let component: AddVehicleModels;
  let fixture: ComponentFixture<AddVehicleModels>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddVehicleModels]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddVehicleModels);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
