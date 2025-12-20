import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerRegister } from './seller-register';

describe('SellerRegister', () => {
  let component: SellerRegister;
  let fixture: ComponentFixture<SellerRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerRegister]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerRegister);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
