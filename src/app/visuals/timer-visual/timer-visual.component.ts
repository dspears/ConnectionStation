import { Component, OnInit, Input } from '@angular/core';
import { Timer } from '../../models/timer';


@Component({
  selector: 'timer-visual',
  template: `<div class="timer-visual">{{timer.message}} <span>{{timer.currentTick > 0 ? timer.currentTick : ' '}}</span></div>`,
  styleUrls: ['./timer-visual.component.css']
})
export class TimerVisualComponent implements OnInit {

  @Input('timer') timer: Timer;

  constructor() { }

  ngOnInit() {
  }

}
