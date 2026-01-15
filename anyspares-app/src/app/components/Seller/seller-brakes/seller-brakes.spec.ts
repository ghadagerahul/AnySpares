import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerBrakes } from './seller-brakes';

describe('SellerBrakes', () => {
  let component: SellerBrakes;
  let fixture: ComponentFixture<SellerBrakes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerBrakes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerBrakes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
