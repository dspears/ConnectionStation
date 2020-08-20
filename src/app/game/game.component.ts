import { Input,  ChangeDetectorRef, ChangeDetectionStrategy, HostListener } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import {Component, OnDestroy, OnInit} from "@angular/core";
import {Player} from '../models/Player';
import {Timer} from '../models/timer';

const INITIAL='initial';
const WAIT_MIN_PLAYERS='waitMinPlayers';
const WAIT_MORE_PLAYERS='waitMorePlayers';
const SHOWING_PSTRINGS='showingPstrings';
const SHOWING_NAMES='showingNames';
const MIN_PLAYERS=2;
const MAX_PLAYERS=10;
/*
  Index-1 (v1):
    7  1  2  8
    5  3  4  6
   11  9 10 12

  Index-1 (v2):
    9  1  2 10
    7  3  4  8
   11  5  6 12

    3  1  2  4
    5        6
    9  7  8 10

   Maps to:
    1  2  3  4
    5  6  7  8
    9 10 11 12
*/
const PLAYER_LAYOUT_ORDER = [
  //2, 3, 6, 7, 5, 8, 1, 4, 10, 11, 9, 12,
  2, 3, 1, 4, 5, 8, 10, 11, 9, 12
];

class ServerResponse {
  players: Player[];
  queue: Player[];
}

@Component({
  selector: 'game',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div id="gameBoard">
      <div class="playerContainer" *ngFor="let player of players">
        <player-visual [player]="player"></player-visual>
      </div>
      <timer-visual id="timer1" [timer]="timer1"></timer-visual>
    </div>`,
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy{
  title = "Connection Game";
  @Input() parentInfo: any;
  hide = true;
  users: any[] = [];
  players: Player[] = [];
  queue: Player[] = [];
  theDataSource: Observable<ServerResponse>;
  gameStartApi: Observable<any[]>;
  userSubscription: Subscription;
  error:string;
  stationID:string;
  parent;
  gameState:string;
  isPaused: boolean = false;
  showCount: number = 0;
  adminPasswd: string = "Zaphod42_";
  stationPasswd: string;
  timer1 : Timer;
  numActivePlayers: number;
  numberOfClicks: number = 0;
  @HostListener('document:click', ['$event']) onClick(btn) {
    this.numberOfClicks++;
    if (this.numberOfClicks % 2 == 0) {
      this.resumeGame();
    } else {
      this.pauseGame();
    }

  }

  constructor(private httpClient: HttpClient, private ref: ChangeDetectorRef) {
    var a = window.location.href.split('/')
    var stationInfo = a[a.length-2].split('-');
    console.log(window.location.href, a);
    this.stationID = stationInfo[0];
    this.stationPasswd = stationInfo.length > 1 ? stationInfo[1] : '';
    console.log("STATION ID: ",this.stationID, this.stationPasswd);
    this.theDataSource = this.httpClient.get<ServerResponse>('/api/users/'+this.stationID);
    //this.theQueueSource = this.httpClient.get<any[]>('/api/queue/'+this.stationID);
    this.gameStartApi = this.httpClient.get<any[]>('/api/game/start/'+this.stationID);

    this.timer1 = new Timer(0,this.timer1Tick.bind(this),this.timer1Expired.bind(this));
    this.startGame();
  }

  startGame() {
    this.gameState = INITIAL;
    this.numActivePlayers = 0;
    this.players = [];
    this.timer1.stopTimer();
    if (this.stationPasswd == this.adminPasswd) {
      this.userSubscription = this.gameStartApi
      .subscribe(
        data => {
          console.log("Told server to start game.")
        },
        err => {
          this.error = `Can't start game. Got ${err.status} from ${err.url}`
          console.log(this.error);
        }
      );
    }
    this.timer1.setMessage("Place your badge on the table to play!");
  }

  pauseGame() {
    this.timer1.pauseTimer();
    this.isPaused = true;
    console.log("Pausing game...");
  }

  resumeGame() {
    this.timer1.resumeTimer();
    this.isPaused = false;
    console.log("Resuming game...");
  }

  ngOnInit(){
    this.parent = document.getElementById("gameBoard");
    this.getPlayers(200);
    this.runAnimationTimer();
    this.runPollingTimer();
  }

  /**
   * Get list of active players in the game from the server.
   * Update internal array of Players objects to match list from server.
   */
  getPlayers(limit) {
    var w = this.parent.clientWidth;
    var h = this.parent.clientHeight;
    this.userSubscription = this.theDataSource
      .subscribe(
      data => {
        // If Game is "running" don't allow more people to join.
        if (this.gameState !== SHOWING_PSTRINGS  && this.gameState !== SHOWING_NAMES) {
          // Info from server:
          console.log(data);
          this.users=data.players;
          this.queue=data.queue;
          this.users.forEach((user,i) => {
            if (this.players.length < limit) {
              if (!this.playerExists(user.rfid)) {
                console.log("Player does not exist.  Creating. ", user.rfid);
                var player = new Player(user.name,user.pstring,user.rfid, w, h, PLAYER_LAYOUT_ORDER[this.players.length]);
                this.players.push(player);
              } else {
                //console.log("Player exists: ",user.rfid)
              }
            }
          });

          // Remove players who are not known on the server.
          for (var i=this.players.length-1; i>=0; i--) {
            // if this player is not in the list from server, delete the player
            var rfid = this.players[i].rfid;
            if (!this.playerInList(rfid,this.users)) {
              this.players.splice(i,1);
              console.log("Removed player ",i,'rfid: ',rfid,this.players);
            } else {
              // console.log("Player exists in game.  rfid: ", rfid);
            }
          }

          // When the number of players changes update the game state.
          if (this.players.length != this.numActivePlayers || this.players.length==0) {
            console.log('players.length: ',this.players.length,'numActivePlayers: ',this.numActivePlayers);
            this.numActivePlayers = this.players.length;
            this.updateGameState(this.players.length, false);
          }
        }
      },
      err =>
        this.error = `Can't get users. Got ${err.status} from ${err.url}`
    );
  }

  addPlayersFromQueue() {
    console.log("Add players from q ",this.queue);
    var w = this.parent.clientWidth;
    var h = this.parent.clientHeight;
    var addCount = 0;
    this.queue.forEach((user,i) => {
      if (this.players.length < MAX_PLAYERS) {
        if (!this.playerExists(user.rfid)) {
          console.log("Player does not exist.  Creating. ", user.rfid);
          addCount++;
          var player = new Player(user.name,user.pstring,user.rfid, w, h, PLAYER_LAYOUT_ORDER[this.players.length]);
          this.players.push(player);
        } else {
          //console.log("Player exists: ",user.rfid)
        }
      }
    });
    return addCount;
  }

  updateGameState(numPlayers,timerExpired) {
    switch (this.gameState) {
      case INITIAL:
        // State: No players, no timer running.
        if (numPlayers > 0) {
          this.timer1.setMessage("Waiting for More Players to Join.");
          this.timer1.setTimer(30);
          this.timer1.startTimer();
          this.gameState = WAIT_MIN_PLAYERS;
        } else {
          this.timer1.stopTimer();
          this.timer1.setMessage("Come over and make new friends!");
        }
      break;
      case WAIT_MIN_PLAYERS:
        // State: 1 or more players, but not enough to play.  Timer running.
        if (timerExpired) {
          // Not enough players joined in time.
          this.startGame();
          /*
          if (this.addPlayersFromQueue() > 0) {
            this.timer1.setMessage("Game about to start...  still time to join!");
            this.timer1.setTimer(10);
            this.timer1.startTimer();
            this.gameState = WAIT_MORE_PLAYERS;
          } else {
            this.startGame();
          }
          */
        } else if (numPlayers >= MIN_PLAYERS) {
          this.timer1.setMessage("Game about to start...  still time to join!");
          this.timer1.setTimer(10);
          this.timer1.startTimer();
          this.gameState = WAIT_MORE_PLAYERS;
        } // else stay in this state.
      break;
      case WAIT_MORE_PLAYERS:
        // State: Enough players to play, but waiting for more.  Timer running.
        if (timerExpired) {
          // Start game with players we have.
          this.gameState = SHOWING_PSTRINGS;
          this.setStateOfPlayers('pstring grid');
          this.timer1.setMessage("Match people to statements!");
          this.timer1.setTimer(20); // 20
          this.timer1.startTimer();
          /*
          if (this.addPlayersFromQueue() > 0) {
            // Stay in state for one more round
            this.timer1.setTimer(10);
            this.timer1.startTimer();
          } else {
            // Start game with players we have.
            this.gameState = SHOWING_PSTRINGS;
            this.setStateOfPlayers('pstring grid');
            this.timer1.setMessage("Match people to statements!");
            this.timer1.setTimer(20);
            this.timer1.startTimer();
          }
          */
        } else {
          // Stay in this state but reset timer
          this.timer1.setTimer(10);
          this.timer1.startTimer();
        }
      break;
      case SHOWING_PSTRINGS:
        if (timerExpired) {
          // Now reveal names
          this.gameState = SHOWING_NAMES;
          this.setStateOfPlayers('name pstring grid');
          this.timer1.setMessage("");
          this.timer1.setTimer(5); // 20
          this.timer1.startTimer();
          this.showCount = -1;
          /*
          self = this;
          setTimeout( function() {
            self.players[0].state = "name pstring grid hilighted";
            console.log("Hilighting player 0");
            self.ref.markForCheck();
            setTimeout(function() {
              //self.players[0].state = "name pstring grid";
              console.log("Un-Hilighting player 0");
              self.ref.markForCheck();
            },5000);
          }, 2000);
          */
        }
      break;
      case SHOWING_NAMES:
        if (timerExpired) {
          if (this.showCount >= 0 && this.showCount < this.players.length) {
            this.players[this.showCount].state = "name pstring grid";
          }
          this.showCount++;
          if (this.showCount < this.players.length) {
            this.players[this.showCount].state = "name pstring grid hilighted";
          }
          if (this.showCount > this.players.length) {
            this.timer1.stopTimer();
            var self = this;
            setTimeout(function() { self.startGame() }, 500);
          } else {
            // Run the timer again
            this.timer1.setTimer(5); // 20
            this.timer1.startTimer();
          }
        }
      break;
      default:
        console.log("Error unknown game state: ",this.gameState);
        this.gameState = INITIAL;
    }
  }

  setStateOfPlayers(state) {
    this.players.forEach( player => player.state = state );
  }

  timer1Tick(t) {
    console.log("Timer 1 TICK ",t);
  }

  timer1Expired() {
    console.log("Timer 1 EXPIRED");
    this.updateGameState(this.numActivePlayers, true);
  }

  playerInList(rfid, users) {
    for (var i=0; i<users.length; i++) {
      if (users[i].rfid == rfid) {
        return true;
      }
    }
    return false;
  }

  playerExists(rfid) {
    for (var i=0; i<this.players.length; i++) {
      if (this.players[i].rfid == rfid) {
        return true;
      }
    }
    return false;
  }

  runPollingTimer() {
    var self = this;
    setInterval(function() {
      self.getPlayers(MAX_PLAYERS);
    },500);
  }

  shouldAnimate() {
    return !this.isPaused && this.gameState != SHOWING_NAMES && this.gameState != SHOWING_PSTRINGS;
    //return this.gameState != SHOWING_NAMES && this.gameState != SHOWING_PSTRINGS;
  }

  // The animation loop.
  runAnimationTimer() {
    window['runAnimation'] = true;
    var self = this;
    var w = self.parent.clientWidth;
    var h = self.parent.clientHeight;
    var animate = function() {
      // console.log("w:",w,"h:",h);
      if (self.shouldAnimate()) {
        self.players.forEach( p => {
          p.setBoundingBox(w,h);
          p.move();
        });
      }
      self.ref.markForCheck();
      if (self.gameState != 'gameOver') {
        requestAnimationFrame(animate);
      } else {
        console.log("Game Over - Stopping animation");
      }
    }
    requestAnimationFrame(animate);
  }

  ngOnDestroy(){
    this.userSubscription.unsubscribe();
  }
}
