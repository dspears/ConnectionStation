
export class Player {
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
  rfid?: string | null;
  name?: string | null;
  pstring?: string | null;


  constructor(x:number, y:number, name:string, pstring:string, rfid:string) {
    this.x = x;
    this.y = y;
    this.name = name;
    this.pstring = pstring;
    this.rfid = rfid;
  }

}
