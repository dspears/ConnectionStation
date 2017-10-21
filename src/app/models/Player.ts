
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
  vectorX: number;
  vectorY: number;
  velocity: number;
  width: number;
  height: number;
  color: string;
  containerHeight: number;
  containerWidth: number;


  constructor(name:string, pstring:string, rfid:string) {
    this.containerWidth = 0;
    this.containerHeight = 0;
    this.name = name;
    this.pstring = pstring;
    this.rfid = rfid;
    this.width = 230;
    this.height = 80;
    this.resetPosition();
    this.resetVelocity();
    this.resetVectors();
    this.resetColor();
  }

  setBoundingBox(width,height) {
    this.containerWidth = width;
    this.containerHeight = height;
  }

  move() {
    // Check for bounding box
    if (this.x<0 &&  this.vectorX < 0) {
      this.vectorX = -1 * this.vectorX;
    }
    if (this.x+this.width >= this.containerWidth && this.vectorX > 0) {
      this.vectorX = -1 * this.vectorX;
    }
    if (this.y<0 &&  this.vectorY < 0) {
      this.vectorY = -1 * this.vectorY;
    }
    if (this.y+this.height >= this.containerHeight && this.vectorY > 0) {
      this.vectorY = -1 * this.vectorY;
    }
    // Now move
    this.x += this.vectorX;
    this.y += this.vectorY;
  }

  resetPosition() {
    this.x = Math.floor(Math.random() * (this.containerWidth / 2) + this.containerWidth / 4);
    this.y = Math.floor(Math.random() * (this.containerHeight / 2) + this.containerHeight / 4);
  }

  resetVelocity() {
    this.velocity = Math.random()*3;
  }

  resetVectors() {
    this.vectorX = (Math.random()+0.5)*this.velocity * (Math.random() > 0.5 ? 1 : -1);
    this.vectorY = (Math.random()+0.5)*this.velocity * (Math.random() > 0.5 ? 1 : -1);
  }

  resetColor() {
    this.color = this.getRandomColor();
  }

  getRandomColor() {
    var hexChars = "ABCDEF9";
    var colorStr = "";
    for (var idx = 0; idx < 6; idx++) {
      colorStr += hexChars.charAt(Math.floor(Math.random() * hexChars.length));
    }
    return '#'+colorStr;
  }

}
