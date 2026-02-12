import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoWheelersCategory } from './two-wheelers-category';

describe('TwoWheelersCategory', () => {
  let component: TwoWheelersCategory;
  let fixture: ComponentFixture<TwoWheelersCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TwoWheelersCategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TwoWheelersCategory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
