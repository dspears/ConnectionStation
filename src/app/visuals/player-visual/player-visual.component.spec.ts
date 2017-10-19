import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerVisualComponent } from './player-visual.component';

describe('PlayerVisualComponent', () => {
  let component: PlayerVisualComponent;
  let fixture: ComponentFixture<PlayerVisualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerVisualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerVisualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
