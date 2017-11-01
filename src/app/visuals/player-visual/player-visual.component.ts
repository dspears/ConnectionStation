import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { Player } from '../../models/Player';

@Component({
  selector: 'player-visual',
  template: `
    <div [id]="player.id" [class]="player.state+' player '" [style.backgroundColor]="player.color" [style.top]="player.y+'px'" [style.left]="player.x+'px'">
      <p>
        <span class="name">{{player.name}}</span>
        <span class="pstring">{{player.pstring}}</span>
      </p>
    </div>
  `,
  styleUrls: ['./player-visual.component.css']
})
export class PlayerVisualComponent implements OnInit {
  // TODO: When do we add {{player.pstring}}
  @Input('player') player: Player;

  constructor(private _elementRef : ElementRef) { }

  ngOnInit() {
    console.log('ngOnInit for: ',this.player.rfid,this._elementRef);
  }
}
