import { Box, QuadTree } from "js-quadtree";
import { makeRandomMatrix } from "./lib/makeRandomMatrix";

//Canvas Constants
const canvas = <HTMLCanvasElement>document.getElementById("particles");
const ctx = canvas.getContext("2d");
const particleTree = new QuadTree(new Box(0, 0, canvas.width, canvas.height));
console.log(particleTree);
//Constants
const PARTICLE_COUNT: number = 1000;
const DELTA_TIME: number = 0.02;
const FRICTION_HALFLIFE: number = 0.04;
const rMax: number = 0.1;
const COLOUR_COUNT: number = 10;
const ATTRACTION_MATRIX: Array<Array<number>> = makeRandomMatrix(COLOUR_COUNT);
const FORCE_FACTOR: number = 7;
const FRICTION_FACTOR: number = Math.pow(0.5, DELTA_TIME / FRICTION_HALFLIFE);

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
}

function force(r: number, a: number) {
  const beta = 0.3;
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

    for (let j = 0; j < PARTICLE_COUNT; j++) {
      if (j === i) continue;
      const rx = positionsX[j] - positionsX[i];
      const ry = positionsY[j] - positionsY[i];
      const r = Math.hypot(rx, ry);
      if (r > 0 && r < rMax) {
        const f = force(r / rMax, ATTRACTION_MATRIX[colours[i]][colours[j]]);
        totalForceX += (rx / r) * f;
        totalForceY += (ry / r) * f;
      }
    }

    totalForceX *= rMax * FORCE_FACTOR;
    totalForceY *= rMax * FORCE_FACTOR;

    velocitiesX[i] *= FRICTION_FACTOR;
    velocitiesY[i] *= FRICTION_FACTOR;

    velocitiesX[i] += totalForceX * DELTA_TIME;
    velocitiesY[i] += totalForceY * DELTA_TIME;

    if (positionsX[i] <= 0.01 || positionsX[i] >= 0.99) {
      velocitiesX[i] *= -1;
    }
    if (positionsY[i] <= 0.01 || positionsY[i] >= 0.99) {
      velocitiesY[i] *= -1;
    }
  }
  //update pos
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positionsX[i] += velocitiesX[i] * DELTA_TIME;
    positionsY[i] += velocitiesY[i] * DELTA_TIME;
  }
}

function frame() {
  updateParticles();

  ctx!.fillStyle = "black";
  ctx?.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    ctx?.beginPath();
    let screenX = positionsX[i] * canvas.width;
    let screenY = positionsY[i] * canvas.height;

    ctx?.arc(screenX, screenY, 2, 0, 2 * Math.PI);
    ctx!.fillStyle = `hsl(${360 * (colours[i] / COLOUR_COUNT)}, 100%,50%)`;
    ctx?.fill();
  }
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
