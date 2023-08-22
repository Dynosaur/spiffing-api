import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RateCounterComponent } from './rate-counter.component';

describe('RateCounterComponent', () => {
  let component: RateCounterComponent;
  let fixture: ComponentFixture<RateCounterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RateCounterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RateCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
