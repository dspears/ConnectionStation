import { Input } from '@angular/core';
import { GameServiceService } from '../game-service/game-service.service'
import {HttpClient} from '@angular/common/http';
import { Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import {Component, OnDestroy, OnInit} from "@angular/core";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy{
  title = "Connection Game";
  @Input() parentInfo: any;
  hide = true;
  users: any[] = [];
  theDataSource: Observable<any[]>;
  userSubscription: Subscription;
  error:string;

  constructor(private httpClient: HttpClient) {
    this.theDataSource = this.httpClient.get<any[]>('/api/users');
    let self = this;
    setTimeout(function() {
       self.hide=false;
      },
      5000);
  }

  ngOnInit(){
    this.userSubscription = this.theDataSource
      .subscribe(
      data => {
          this.users=data;
      },
      err =>
        this.error = `Can't get users. Got ${err.status} from ${err.url}`
    );
  }

  getRandomLeft() {
    return '200px'; // Math.floor(900*Math.random())+'px';
  }

  getRandomTop() {
    return '200px'; // Math.floor(500*Math.random())+'px';
  }

  ngOnDestroy(){
    this.userSubscription.unsubscribe();
  }
}
/*
export class GameComponent implements OnInit {
  title = "Connection Game";
  @Input() parentInfo: any;
  hide = true;

  users: Observable<any[]>;
  error:string;
  constructor(private httpClient: HttpClient) {
    this.users = this.httpClient.get<any[]>('/api/users');
  }


  constructor( private gameService: GameServiceService ) {
    this.users = gameService.getUsers();
    let self = this;

    setTimeout(function() {
      self.hide=false;
    },
    5000);

  }


  getRandomLeft() {
    return Math.floor(900*Math.random())+'px';
  }

  getRandomTop() {
    return Math.floor(500*Math.random())+'px';
  }

  ngOnInit() {
    //this.users = this.gameService.getUsers();
  }
}
*/
