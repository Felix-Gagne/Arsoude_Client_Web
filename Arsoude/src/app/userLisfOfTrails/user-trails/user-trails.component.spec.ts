import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTrailsComponent } from './user-trails.component';

describe('UserTrailsComponent', () => {
  let component: UserTrailsComponent;
  let fixture: ComponentFixture<UserTrailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserTrailsComponent]
    });
    fixture = TestBed.createComponent(UserTrailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
