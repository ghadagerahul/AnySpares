import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwowheelersDashboard } from './twowheelers-dashboard';

describe('TwowheelersDashboard', () => {
  let component: TwowheelersDashboard;
  let fixture: ComponentFixture<TwowheelersDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TwowheelersDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TwowheelersDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
