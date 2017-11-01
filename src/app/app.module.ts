import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
// import { GameComponent } from './app/game/game.component';
import { ProductService } from './product/product.service';
import { GameComponent } from './game/game.component';
import { PlayerVisualComponent } from './visuals/player-visual/player-visual.component';

import { Router, ActivatedRoute, Params } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { TimerVisualComponent } from './visuals/timer-visual/timer-visual.component';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    PlayerVisualComponent,
    TimerVisualComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [ProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }
