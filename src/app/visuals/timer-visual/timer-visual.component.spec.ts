import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerVisualComponent } from './timer-visual.component';

describe('TimerVisualComponent', () => {
  let component: TimerVisualComponent;
  let fixture: ComponentFixture<TimerVisualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimerVisualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimerVisualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
