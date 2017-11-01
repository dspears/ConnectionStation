import {Observable} from 'rxjs/Rx';

export class Timer {
  public currentTick: number;
  public message: string;
  public active: boolean;
  private timerId: number;
  private tickCallback;
  private expiredCallback;

  constructor(private seconds:number, tickCb, expiredCb) {
    this.tickCallback = tickCb;
    this.expiredCallback = expiredCb;
    this.message = '';
    this.active = false;
    this.currentTick = 0;
    this.timerId = 0;
  }

  private emitTimerExpiredEvent() {
    console.log("Expired ",this.timerId);
    this.expiredCallback();
  }

  private emitTickEvent() {
    console.log("Tick ",this.currentTick,this.timerId);
    this.tickCallback(this.currentTick);
  }

  pauseTimer() {
    console.log('Pausing timer ',this.timerId);
    clearInterval(this.timerId);
  }

  resumeTimer() {
    console.log('resumeTimer');
    var self = this;
    this.timerId = setInterval(function() {
      self.currentTick--;
      self.emitTickEvent();
      if (self.currentTick <= 0) {
        self.currentTick = 0;
        self.emitTimerExpiredEvent();
      }
    },
    1000);
  }

  startTimer() {
    this.resetTimer();
    this.resumeTimer();
    this.active = true;
  }

  stopTimer() {
    //this.active = false;
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
