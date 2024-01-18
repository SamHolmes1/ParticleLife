const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");

const n = 50;
const dt = 0.02;
const frictionHalfLife = 0.04;
const rMax = 0.1;
const m = 7;
const matrix = makeRandomMatrix();
const forceFactor = 100;
const frictionFactor = Math.pow(0.5, dt / frictionHalfLife);

function makeRandomMatrix() {
  const rows = [];
  for (let i = 0; i < m; i++) {
    const row = [];
    for (let j = 0; j < m; j++) {
      row.push(Math.random() * 2 - 1);
    }
    rows.push(row);
  }
  return rows;
}

const colours = new Int32Array(n);
const positionsX = new Float32Array(n);
const positionsY = new Float32Array(n);
const velocitiesX = new Float32Array(n);
const velocitiesY = new Float32Array(n);
for (let i = 0; i < n; i++) {
  colours[i] = Math.floor(Math.random() * m);
  positionsX[i] = Math.random();
  positionsY[i] = Math.random();
  velocitiesX[i] = 0;
  velocitiesY[i] = 0;
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

function updateParticles() {
  //update vel
  for (let i = 0; i < n; i++) {
    let totalForceX = 0;
    let totalForceY = 0;

    for (let j = 0; j < n; j++) {
      if (j === i) continue;
      const rx = positionsX[j] - positionsX[i];
      const ry = positionsY[j] - positionsY[i];
      const r = Math.hypot(rx, ry);
      if (r > 0 && r < rMax) {
        const f = force(r / rMax, matrix[colours[i]][colours[j]]);
        totalForceX += (rx / r) * f;
        totalForceY += (ry / r) * f;
      }
    }

    totalForceX *= rMax * forceFactor;
    totalForceY *= rMax * forceFactor;

    velocitiesX[i] *= frictionFactor;
    velocitiesY[i] *= frictionFactor;

    velocitiesX[i] += totalForceX * dt;
    velocitiesY[i] += totalForceY * dt;

    //solid boundaries
    // if (positionsX[i] >= 1) {
    //   velocitiesX[i] -= 0.1;
    // }
    // if (positionsX[i] <= 0) {
    //   velocitiesX[i] *= -0.1;
    // }
    // if (positionsY[i] >= 1) {
    //   velocitiesY[i] -= 0.1;
    // }
    // if (positionsY[i] <= 0) {
    //   velocitiesY[i] *= -0.1;
    // }

    // // repeating boundaries
    // if (positionsX[i] >= 1) {
    //   console.log("rightboundary touched")
    //   positionsX[i] = 0;
    // }
    // if (positionsX[i] <= 0) {
    //   positionsX[i] = 1;
    // }
    // if (positionsY[i] >= 1) {
    //   velocitiesY[i] = 0;
    // }
    // if (positionsY[i] <= 0) {
    //   velocitiesY[i] = 1;
    // }
  }
  //update pos
  for (let i = 0; i < n; i++) {
    positionsX[i] += velocitiesX[i] * dt;
    positionsY[i] += velocitiesY[i] * dt;
  }
}

function loop() {
  //update
  updateParticles();
  //draw
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < n; i++) {
    ctx.beginPath();
    let screenX = positionsX[i] * canvas.width;
    let screenY = positionsY[i] * canvas.height;

    if (screenX > canvas.width) {
      // console.log(screenX);
    }
    if (screenY > canvas.height) {
      // console.log(screenY);
    }
    if (screenX < 0) {
      console.log("trigger");
      screenX -= forceFactor;
    }

    ctx.arc(screenX, screenY, 5, 0, 2 * Math.PI);
    ctx.fillStyle = `hsl(${360 * (colours[i] / m)}, 100%,50%)`;
    ctx.fill();
  }
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
