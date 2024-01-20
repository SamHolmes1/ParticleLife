import { QuadTree, Box, Point } from "js-quadtree";
import { makeRandomMatrix } from "./lib/makeRandomMatrix";

//Canvas Constants
const canvas = <HTMLCanvasElement>document.getElementById("particles");
const ctx = canvas.getContext("2d");

//Constants
const PARTICLE_COUNT: number = 1000;
const COLOUR_COUNT: number = 4;
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
      new Point(
        Math.random() * CANVAS_BOUNDS.w,
        Math.random() * CANVAS_BOUNDS.h,
        { vx: 0, vy: 0, colour: Math.floor(Math.random() * COLOUR_COUNT) }
      )
    );
  }
}
