import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vehiclecategory } from './vehiclecategory';

describe('Vehiclecategory', () => {
  let component: Vehiclecategory;
  let fixture: ComponentFixture<Vehiclecategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Vehiclecategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Vehiclecategory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
