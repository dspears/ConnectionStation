import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { Player } from '../../models/Player';

@Component({
  selector: 'player-visual',
  template: `
    <div id="player.rfid" class="player" [style.top]="player.y+'px'" [style.left]="player.x+'px'">
      {{player.name}} - {{player.pstring}}
    </div>
  `,
  styleUrls: ['./player-visual.component.css']
})
export class PlayerVisualComponent implements OnInit {

  @Input('player') player: Player;

  constructor(private _elementRef : ElementRef) { }

  ngOnInit() {
    console.log('ngOnInit for: ',this.player.rfid,this._elementRef);
  }
}
