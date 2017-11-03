import {Observable} from 'rxjs/Rx';

const CLEARED=0;
const RUNNING=1;
const PAUSED=2;
const EXPIRED=3;

export class Timer {
  public currentTick: number;
  public message: string;
  public active: boolean;
  private timerId: number;
  private tickCallback;
  private expiredCallback;
  private state: number;

  constructor(private seconds:number, tickCb, expiredCb) {
    this.tickCallback = tickCb;
    this.expiredCallback = expiredCb;
    this.message = '';
    this.active = false;
    this.currentTick = 0;
    this.timerId = 0;
    this.state = CLEARED;
  }

  private emitTimerExpiredEvent() {
    console.log("Expired ",this.timerId);
    this.state = EXPIRED;
    this.expiredCallback();
  }

  private emitTickEvent() {
    console.log("Tick ",this.currentTick,this.timerId);
    this.tickCallback(this.currentTick);
  }

  pauseTimer() {
    console.log('Pausing timer ',this.timerId);
    this.state = PAUSED;
    clearInterval(this.timerId);
  }

  resumeTimer() {
    console.log('resumeTimer');
    var self = this;
    // We don't want to call setInterval if timer is already running.
    // (as this leads to very fast ticking with multiple underlying timers!)
    if (this.state != RUNNING) {
      this.timerId = setInterval(function() {
        self.currentTick--;
        self.emitTickEvent();
        if (self.currentTick <= 0) {
          self.currentTick = 0;
          self.emitTimerExpiredEvent();
        }
      },
      1000);
      this.state = RUNNING;
    }
  }

  startTimer() {
    this.resetTimer();
    this.resumeTimer();
    this.active = true;
  }

  stopTimer() {
    //this.active = false;
    this.state = CLEARED;
    clearInterval(this.timerId);
    this.timerId = 0;
  }

  resetTimer() {
    this.stopTimer();
    this.currentTick = this.seconds;
  }

  setTimer(seconds) {
    this.seconds = seconds;
  }

  setMessage(msg) {
    this.message = msg;
  }

}
