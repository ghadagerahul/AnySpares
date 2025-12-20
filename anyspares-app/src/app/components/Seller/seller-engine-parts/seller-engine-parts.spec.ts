import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerEngineParts } from './seller-engine-parts';

describe('SellerEngineParts', () => {
  let component: SellerEngineParts;
  let fixture: ComponentFixture<SellerEngineParts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerEngineParts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerEngineParts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
