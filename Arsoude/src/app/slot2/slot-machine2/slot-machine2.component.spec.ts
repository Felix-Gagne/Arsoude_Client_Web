import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlotMachine2Component } from './slot-machine2.component';

describe('SlotMachine2Component', () => {
  let component: SlotMachine2Component;
  let fixture: ComponentFixture<SlotMachine2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SlotMachine2Component]
    });
    fixture = TestBed.createComponent(SlotMachine2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
