import { QuadTree, Rectangle, Particle } from "./QuadTree";

const canvas = <HTMLCanvasElement>document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");

const bounds = new Rectangle(0, 0, canvas.width, canvas.height);
const myTree = new QuadTree(bounds, 1);

function start() {
  for (let i = 0; i < 200; i++) {
    myTree.insert(
      new Particle(Math.random() * canvas.width, Math.random() * canvas.height)
    );
  }
}

canvas.addEventListener("click", (event) => {
  ctx?.clearRect(0, 0, canvas.width, canvas.height);
  myTree.insert(
    new Particle(
      event.clientX - canvas.getBoundingClientRect().left,
      event.clientY - canvas.getBoundingClientRect().top
    )
  );
  requestAnimationFrame(drawBoundaries);
});

function drawBoundaries() {
  myTree.show(canvas);

  const foundBounds = new Rectangle(400, 400, 100, 100);
  const found = myTree.query(foundBounds);
  ctx?.beginPath();
  ctx!.strokeStyle = "green";
  ctx?.rect(foundBounds.x, foundBounds.y, foundBounds.w, foundBounds.h);
  ctx?.stroke();

  for (let i = 0; i < found.length; i++) {
    ctx?.beginPath();
    ctx!.strokeStyle = "green";
    ctx?.arc(found[i].x, found[i].y, 3, 0, 2 * Math.PI);
    ctx?.stroke();
  }
}

start();
drawBoundaries();
