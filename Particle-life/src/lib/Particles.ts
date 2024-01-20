export class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  colour: number;
  constructor(x: number, y: number, vx: number, vy: number, colour: number) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.colour = colour;
  }
}
