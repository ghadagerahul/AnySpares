import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterationPage } from './registeration-page';

describe('RegisterationPage', () => {
  let component: RegisterationPage;
  let fixture: ComponentFixture<RegisterationPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterationPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
