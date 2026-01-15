import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerHydraulicFluids } from './seller-hydraulic-fluids';

describe('SellerHydraulicFluids', () => {
  let component: SellerHydraulicFluids;
  let fixture: ComponentFixture<SellerHydraulicFluids>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerHydraulicFluids]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerHydraulicFluids);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
