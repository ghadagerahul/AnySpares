import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerCategory } from './seller-category';

describe('SellerCategory', () => {
  let component: SellerCategory;
  let fixture: ComponentFixture<SellerCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerCategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerCategory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
