import { Box, QuadTree, Point, Circle } from "js-quadtree";
import { makeRandomMatrix } from "./lib/makeRandomMatrix";

//Canvas Constants
const canvas = <HTMLCanvasElement>document.getElementById("particles");
const ctx = canvas.getContext("2d");
const particleTree = new QuadTree(new Box(0, 0, 1, 1)); //The bounds of the quadtree must be normalized (0-1)
//Constants
const PARTICLE_COUNT: number = 2000;
const DELTA_TIME: number = 0.02;
const FRICTION_HALFLIFE: number = 0.04;
const rMax: number = 0.12;
const COLOUR_COUNT: number = 5;
const ATTRACTION_MATRIX: Array<Array<number>> = makeRandomMatrix(COLOUR_COUNT);
const FORCE_FACTOR: number = 12;
const FRICTION_FACTOR: number = Math.pow(0.5, DELTA_TIME / FRICTION_HALFLIFE);
const RMAX_FORCE_FACTOR: number = rMax * FORCE_FACTOR;

const colours = new Int32Array(PARTICLE_COUNT);
const positionsX = new Float32Array(PARTICLE_COUNT);
const positionsY = new Float32Array(PARTICLE_COUNT);
const velocitiesX = new Float32Array(PARTICLE_COUNT);
const velocitiesY = new Float32Array(PARTICLE_COUNT);

for (let i = 0; i < PARTICLE_COUNT; i++) {
  colours[i] = Math.floor(Math.random() * COLOUR_COUNT);
  positionsX[i] = Math.random();
  positionsY[i] = Math.random();
  velocitiesX[i] = 0;
  velocitiesY[i] = 0;
  particleTree.insert(
    new Point(positionsX[i], positionsY[i], {
      vx: velocitiesX[i],
      vy: velocitiesY[i],
      index: i,
    }),
  );
}

function force(r: number, a: number): number {
  const beta = 0.5;
  if (r < beta) {
    return r / beta - 1;
  } else if (beta < r && r < 1) {
    return a * (1 - Math.abs(2 * r - 1 - beta) / (1 - beta));
  } else {
    return 0;
  }
}

function updateParticles() {
  //update vel
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    let totalForceX = 0;
    let totalForceY = 0;

    let neighbours: Array<Point> = particleTree.query(
      new Circle(positionsX[i], positionsY[i], rMax),
    );

    //Add boundary conditions for neighbours on opposing sides of the canvas
    //TODO: add better implementation of periodic boundary conditions
    if (positionsX[i] < 0.01) {
      neighbours = [
        ...neighbours,
        ...particleTree.query(
          new Circle((positionsX[i] += 1), positionsY[i], rMax),
        ),
      ];
    } else if (positionsX[i] > 0.99) {
      neighbours = [
        ...neighbours,
        ...particleTree.query(
          new Circle((positionsX[i] -= 1), positionsY[i], rMax),
        ),
      ];
    }
    if (positionsY[i] < 0.01) {
      neighbours = [
        ...neighbours,
        ...particleTree.query(
          new Circle(positionsX[i], (positionsY[i] += 1), rMax),
        ),
      ];
    } else if (positionsY[i] > 0.99) {
      neighbours = [
        ...neighbours,
        ...particleTree.query(
          new Circle(positionsX[i], (positionsY[i] -= 1), rMax),
        ),
      ];
    }

    for (let j = 0; j < neighbours.length; j++) {
      if (j === i) continue;
      const rx = positionsX[neighbours[j].data.index] - positionsX[i];
      const ry = positionsY[neighbours[j].data.index] - positionsY[i];
      const r = Math.sqrt(rx * rx + ry * ry);
      if (r > 0 && r < rMax) {
        const f = force(
          r / rMax,
          ATTRACTION_MATRIX[colours[i]][colours[neighbours[j].data.index]],
        );
        totalForceX += (rx / r) * f;
        totalForceY += (ry / r) * f;
      }
    }

    totalForceX *= RMAX_FORCE_FACTOR;
    totalForceY *= RMAX_FORCE_FACTOR;

    velocitiesX[i] *= FRICTION_FACTOR;
    velocitiesY[i] *= FRICTION_FACTOR;

    velocitiesX[i] += totalForceX * DELTA_TIME;
    velocitiesY[i] += totalForceY * DELTA_TIME;
  }
  //update pos
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positionsX[i] += velocitiesX[i] * DELTA_TIME;
    positionsY[i] += velocitiesY[i] * DELTA_TIME;

    //Add boundary conditions
    if (positionsX[i] < 0.01) positionsX[i] += 1;
    else if (positionsX[i] > 0.99) positionsX[i] -= 1;
    if (positionsY[i] < 0.01) positionsY[i] += 1;
    else if (positionsY[i] > 0.99) positionsY[i] -= 1;
  }
}

function frame() {
  updateParticles();

  ctx!.fillStyle = "black";
  ctx?.fillRect(0, 0, canvas.width, canvas.height);

  particleTree.clear();
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particleTree.insert(
      new Point(positionsX[i], positionsY[i], {
        vx: velocitiesX[i],
        vy: velocitiesY[i],
        index: i,
      }),
    );
    ctx?.beginPath();
    let screenX = positionsX[i] * canvas.width;
    let screenY = positionsY[i] * canvas.height;

    ctx?.arc(screenX, screenY, 2, 0, 2 * Math.PI);
    ctx!.fillStyle = `hsl(${
      (360 * (colours[i] << (8 / COLOUR_COUNT))) & 0xff
    }, 100%,50%)`;
    ctx?.fill();
  }

  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
