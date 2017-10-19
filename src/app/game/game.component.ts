import { Input,  ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { GameServiceService } from '../game-service/game-service.service'
import {HttpClient} from '@angular/common/http';
import { Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import {Component, OnDestroy, OnInit} from "@angular/core";
import {Player} from '../models/Player';

@Component({
  selector: 'game',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy{
  title = "Connection Game";
  @Input() parentInfo: any;
  hide = true;
  users: any[] = [];
  players: Player[] = [];
  theDataSource: Observable<any[]>;
  userSubscription: Subscription;
  error:string;
  stationID:string;

  constructor(private httpClient: HttpClient, private ref: ChangeDetectorRef) {
    var a = window.location.href.split('/')
    this.stationID = a[a.length-2];
    console.log(window.location.href, a);
    console.log("STATION ID: ",this.stationID);
    this.theDataSource = this.httpClient.get<any[]>('/api/users/'+this.stationID);
    let self = this;
    setTimeout(function() {
       self.hide=false;
      },
      5000);
  }

  ngOnInit(){
    this.getPlayers(20);
    this.runAnimationTimer();
    this.runPollingTimer();

  }

  /**
   * Get list of active players in the game from the server.
   * Update internal array of Players objects to match list from server.
   */
  getPlayers(limit) {
    this.userSubscription = this.theDataSource
      .subscribe(
      data => {
          // Info from server:
          this.users=data;
          this.users.forEach((user,i) => {
            if (this.players.length <= limit) {
              if (!this.playerExists(user.rfid)) {
                console.log("Player does not exist.  Creating. ", user.rfid);
                var player = new Player(200+210*i,100,user.name,user.pstring,user.rfid);
                this.players.push(player);
              } else {
                //console.log("Player exists: ",user.rfid)
              }
            }
          });

          // Remove players who are not known on the server.
          console.log(this.players, this.users);

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

      },
      err =>
        this.error = `Can't get users. Got ${err.status} from ${err.url}`
    );
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
      self.getPlayers(10);
    },2000);
  }

  runAnimationTimer() {
    var self = this;
    var dir = 1;
    var count = 0;
    var added = false;

    var animate = function() {
      self.players.forEach(player=>player.y+=1*dir);
      count++;
      if (count > 250) {
        dir = -dir;
        count = 0;
      }
      self.ref.markForCheck();
      requestAnimationFrame(animate);
    };
    //setInterval(animate, 60);
    requestAnimationFrame(animate);
  }

  ngOnDestroy(){
    this.userSubscription.unsubscribe();
  }
}
