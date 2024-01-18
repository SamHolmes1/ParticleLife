export class Particle {
  x: number;
  y: number;
  colour: number;
  vx: number;
  vy: number;

  constructor(
    x: number,
    y: number,
    colour: number = Math.floor(Math.random() * 6)
  ) {
    this.x = x;
    this.y = y;
    this.colour = colour;
    this.vx = 0;
    this.vy = 0;
  }
}

export class Rectangle {
  x: number;
  y: number;
  w: number;
  h: number;
  divided: boolean;

  constructor(x: number, y: number, canvasWidth: number, canvasHeight: number) {
    this.x = x;
    this.y = y;
    this.w = canvasWidth;
    this.h = canvasHeight;
    this.divided = false;
  }

  contains(point: Particle): boolean {
    return (
      point.x >= this.x - this.w &&
      point.x <= this.x + this.w &&
      point.y >= this.y - this.h &&
      point.y <= this.y + this.h
    );
  }

  intersects(range: Rectangle) {
    return !(
      range.x - range.w > this.x + this.w ||
      range.x + range.w < this.x - this.w ||
      range.y - range.h > this.y + this.h ||
      range.y + range.h < this.y - this.h
    );
  }
}

export class QuadTree {
  bounds: Rectangle;
  points: Array<Particle>;
  capacity: number;
  topLeft?: QuadTree;
  topRight?: QuadTree;
  bottomLeft?: QuadTree;
  bottomRight?: QuadTree;

  constructor(
    bounds: Rectangle,
    capacity: number,
    points: Array<Particle> = []
  ) {
    this.bounds = bounds;
    this.capacity = capacity;
    this.points = points;
  }

  subdivide() {
    if (this.bounds.divided) {
      return;
    } else {
      const topLeftBounds = new Rectangle(
        this.bounds.x,
        this.bounds.y,
        this.bounds.w / 2,
        this.bounds.h / 2
      );

      const topRightBounds = new Rectangle(
        this.bounds.x + this.bounds.w / 2,
        this.bounds.y,
        this.bounds.w / 2,
        this.bounds.h / 2
      );
      const bottomRightBounds = new Rectangle(
        this.bounds.x + this.bounds.w / 2,
        this.bounds.y + this.bounds.h / 2,
        this.bounds.w / 2,
        this.bounds.h / 2
      );
      const bottomLeftBounds = new Rectangle(
        this.bounds.x,
        this.bounds.y + this.bounds.h / 2,
        this.bounds.w / 2,
        this.bounds.h / 2
      );

      this.topLeft = new QuadTree(topLeftBounds, this.capacity);
      this.topRight = new QuadTree(topRightBounds, this.capacity);
      this.bottomLeft = new QuadTree(bottomLeftBounds, this.capacity);
      this.bottomRight = new QuadTree(bottomRightBounds, this.capacity);

      this.bounds.divided = true;
    }
  }

  insert(point: Particle): boolean {
    if (!this.bounds.contains(point)) {
      return false;
    }

    if (this.points.length < this.capacity) {
      this.points.push(point);
      return true;
    } else {
      if (!this.bounds.divided) {
        this.subdivide();
      }

      //Prototype checking for the smallest array
      // const arrayOfBounds: Array<QuadTree | undefined> = [
      //   this.topLeft,
      //   this.topRight,
      //   this.bottomLeft,
      //   this.bottomRight,
      // ];
      // arrayOfBounds.reduce((previous, current) => {
      //   return previous?.capacity < current?.capacity ? previous : current;
      // });

      if (this.topLeft?.insert(point)) {
        return true;
      } else if (this.topRight?.insert(point)) {
        return true;
      } else if (this.bottomLeft?.insert(point)) {
        return true;
      } else if (this.bottomRight?.insert(point)) {
        return true;
      }
    }
    return false;
  }
  query(range: Rectangle, foundParticles?: Array<Particle>): Array<Particle> {
    if (!foundParticles) {
      foundParticles = [];
    }
    if (!this.bounds.intersects(range)) {
      return foundParticles;
    } else {
      for (let p of this.points) {
        if (range.contains(p)) {
          foundParticles.push(p);
        }
      }
      if (this.bounds.divided) {
        this.topLeft?.query(range, foundParticles);
        this.topRight?.query(range, foundParticles);
        this.bottomLeft?.query(range, foundParticles);
        this.bottomRight?.query(range, foundParticles);
      }
    }
    console.log(foundParticles);
    return foundParticles;
  }

  show(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    ctx?.beginPath();
    ctx!.strokeStyle = "red";
    ctx?.rect(this.bounds.x, this.bounds.y, this.bounds.w, this.bounds.h);

    if (this.bounds.divided) {
      this.bottomLeft?.show(canvas);
      this.bottomRight?.show(canvas);
      this.topLeft?.show(canvas);
      this.topRight?.show(canvas);
    }
    ctx?.stroke();
    for (let i = 0; i < this.points.length; i++) {
      ctx?.beginPath();
      ctx!.strokeStyle = "white";
      ctx?.arc(this.points[i].x, this.points[i].y, 3, 0, 2 * Math.PI);
      ctx?.stroke();
    }
  }
}
