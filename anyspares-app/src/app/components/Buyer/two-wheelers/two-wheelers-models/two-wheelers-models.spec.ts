import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoWheelersModels } from './two-wheelers-models';

describe('TwoWheelersModels', () => {
  let component: TwoWheelersModels;
  let fixture: ComponentFixture<TwoWheelersModels>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TwoWheelersModels]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TwoWheelersModels);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
