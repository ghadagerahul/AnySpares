import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoWheelerCategories } from './two-wheeler-categories';

describe('TwoWheelerCategories', () => {
  let component: TwoWheelerCategories;
  let fixture: ComponentFixture<TwoWheelerCategories>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TwoWheelerCategories]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TwoWheelerCategories);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
