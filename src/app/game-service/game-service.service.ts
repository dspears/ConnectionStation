import { Injectable } from '@angular/core';

@Injectable()
export class GameServiceService {
  private users = [
    { name: "Peter", rfid: 'rf98764', pstring: 'web development1' },
    { name: "Shina", rfid: 'rf789012', pstring: 'web development2' },
    { name: "Tim", rfid: 'rf643216', pstring: 'web development3' },
    { name: "Dave", rfid: 'rf123456', pstring: 'web development4' },
    { name: "Test", rfid: 'rfabcdef', pstring: 'web development5' },
  ];

  constructor() {
  }

  public getUsers() {
    return [];
    //return this.users;
  }

}
