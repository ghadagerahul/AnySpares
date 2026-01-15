import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerSuspensionParts } from './seller-suspension-parts';

describe('SellerSuspensionParts', () => {
  let component: SellerSuspensionParts;
  let fixture: ComponentFixture<SellerSuspensionParts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerSuspensionParts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerSuspensionParts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
