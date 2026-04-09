import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyBucketComponent } from './my-bucket';

describe('MyBuckComponent', () => {
  let component: MyBucketComponent;
  let fixture: ComponentFixture<MyBucketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyBucketComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyBucketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
