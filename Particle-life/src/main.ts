import { QuadTree, Box, Point } from "js-quadtree";
import { makeRandomMatrix } from "./lib/makeRandomMatrix";

//Canvas Constants
const canvas = <HTMLCanvasElement>document.getElementById("particles");
const ctx = canvas.getContext("2d");

//Constants
const PARTICLE_COUNT: number = 1000;
const COLOUR_COUNT: number = 5;
const DELTA_TIME: number = 0.02;
const rMax: number = 0.1;
const FORCE_FACTOR: number = 20;
const FRICTION_HALFLIFE: number = 0.04;
const FRICTION_FACTOR: number = Math.pow(0.5, DELTA_TIME / FRICTION_HALFLIFE);
const ATTRACTION_MATRIX: Array<Array<number>> = makeRandomMatrix(COLOUR_COUNT);
const CANVAS_BOUNDS: Box = new Box(0, 0, canvas.width, canvas.height);
const particleTree = new QuadTree(CANVAS_BOUNDS);

function populateTree() {
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particleTree.insert(
      new Point(Math.random(), Math.random(), {
        vx: 0,
        vy: 0,
        colour: Math.floor(Math.random() * COLOUR_COUNT),
      })
    );
  }
}

function updateTree(updatedParticles: Array<Point>) {
  for (let i = 0; i < updatedParticles.length; i++) {
    particleTree.insert(updatedParticles[i]);
  }
}

function force(r, a) {
  const beta = 0.3;
  if (r < beta) {
    return r / beta - 1;
  } else if (beta < r && r < 1) {
    return a * (1 - Math.abs(2 * r - 1 - beta) / (1 - beta));
  } else {
    return 0;
  }
}

function updateParticles(allParticles: Array<Point>): Array<Point> {
  return allParticles;
}

function frame() {
  const allParticles = updateParticles(particleTree.query(CANVAS_BOUNDS));

  ctx!.fillStyle = "black";
  ctx?.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < allParticles.length; i++) {
    ctx?.beginPath();

    let screenX = allParticles[i].x * canvas.width;
    let screenY = allParticles[i].y * canvas.height;
    ctx?.arc(screenX, screenY, 2, 0, 2 * Math.PI);
    ctx!.fillStyle = `hsl(${
      360 * (allParticles[i].data.colour / COLOUR_COUNT)
    }, 100%,50%)`;
    ctx?.fill();
  }

  particleTree.clear();
  updateTree(allParticles);
}

populateTree();
requestAnimationFrame(frame);
