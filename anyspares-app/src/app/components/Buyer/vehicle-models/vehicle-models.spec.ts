import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleModels } from './vehicle-models';

describe('VehicleModels', () => {
  let component: VehicleModels;
  let fixture: ComponentFixture<VehicleModels>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleModels]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleModels);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
