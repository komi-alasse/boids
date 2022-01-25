
let width = 150;
let height = 150;

let numberOfBoids  = 100;

// Visual range that measures how far each boid can "see".
var visualRange = 75;
var dangerZone = 90;

let boids = [];
let PREDATOR = false;
let predator;

// Responds to html button "toggle predator."
function togglePredator() { 
  PREDATOR = !PREDATOR;
  if (PREDATOR) {
      predator = {
      x: Math.random(),
      y: Math.random(),
      dx: Math.random(),
      dy: Math.random(), 
    }
  }
  else {
    predator = null
  }
}

function startBoids() {
  for (let i = 0; i < numberOfBoids; i += 1) {
    boids[boids.length] = {
      x: Math.random() * width,
      y: Math.random() * height,
      dx: Math.random() * 10 - 5,
      dy: Math.random() * 10 - 5,
      color : getColor()
    };
  }
}

function getColor() {
  return selectColor(Math.floor(Math.random() * 10), 10);
}

function distance(boid1, boid2) {
  return Math.sqrt(
    (boid1.x - boid2.x) * (boid1.x - boid2.x) +
      (boid1.y - boid2.y) * (boid1.y - boid2.y),
  );
}


function sizeCanvas() {
  const canvas = document.getElementById("boids");
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height - 100;
}


function keepInBounds(boid) {
  const margin = 175;
  
  // Controls how fast boids turn inwards from the edege of the canvas.
  let turnFactor = (boid == predator) ? 0.45 : 1;

  if (boid.x < margin) 
    boid.dx += turnFactor;
  
  if (boid.x > width - margin) 
    boid.dx -= turnFactor
  
  if (boid.y < margin) 
    boid.dy += turnFactor;
  
  if (boid.y > height - margin) 
    boid.dy -= turnFactor;
  
}

function flyTowardsCenter(boid) {
  const centeringFactor = 0.005; 

  let centerX = 0;
  let centerY = 0;
  let numNeighbors = 0;

  for (let otherBoid of boids) {
    if (distance(boid, otherBoid) < visualRange) {
      centerX += otherBoid.x;
      centerY += otherBoid.y;
      numNeighbors += 1;
    }
  }

  if (numNeighbors) {
    centerX = centerX / numNeighbors;
    centerY = centerY / numNeighbors;

    boid.dx += (centerX - boid.x) * centeringFactor;
    boid.dy += (centerY - boid.y) * centeringFactor;
  }
}

function avoidOthers(boid) {
  const minDistance = 20; 
  const avoidFactor = 0.05;
  let moveX = 0;
  let moveY = 0;
  for (let otherBoid of boids) {
    if (otherBoid !== boid) {
      if (distance(boid, otherBoid) < minDistance) {
        moveX += boid.x - otherBoid.x;
        moveY += boid.y - otherBoid.y;
      }
    }
  }

  boid.dx += moveX * avoidFactor;
  boid.dy += moveY * avoidFactor;
}


function matchVelocity(boid) {
  const matchFactor = 0.05; 
  let avgDX = 0;
  let avgDY = 0;
  let numNeighbors = 0;

  for (let otherBoid of boids) {
    if (distance(boid, otherBoid) < visualRange) {
      avgDX += otherBoid.dx;
      avgDY += otherBoid.dy;
      numNeighbors++;
    }
  }

  if (numNeighbors) {
    avgDX = avgDX / numNeighbors;
    avgDY = avgDY / numNeighbors;

    boid.dx += (avgDX - boid.dx) * matchFactor;
    boid.dy += (avgDY - boid.dy) * matchFactor;
  }
}

function limitSpeed(boid) {
  const speedLimit = 15
  const speed = Math.sqrt(boid.dx * boid.dx + boid.dy * boid.dy);
  if (speed > speedLimit) {
    boid.dx = (boid.dx / speed) * speedLimit;
    boid.dy = (boid.dy / speed) * speedLimit;
  }
}

function selectColor(number) {
  const hue = number * 137.508; // golden angle approximation
  return `hsl(${hue},50%,75%)`;
}

function drawBoid(ctx, boid) {
  ctx.beginPath();
  ctx.arc(boid.x, boid.y, (boid == predator) ? 8 : 6 , 0, Math.PI * 2, false);
  ctx.save();
  ctx.fillStyle = (boid == predator) ? "#ff0000" : boid.color ;
  ctx.fill();
  ctx.restore();
  ctx.closePath();  
}

const average = arr => arr.reduce((a,b) => a + b, 0) / arr.length;

function getXcoors(boids) {
  xs = []
  for (let boid of boids) 
    xs.push(boid.x)
  return xs;
}

function getYcoors(boids) {
  ys = []
  for (let boid of boids) 
    ys.push(boid.y)
  return ys;
}

function flyTowardsBoids(predator) {
velocityFactor = 0.00001;

  xs = getXcoors(boids);
  ys = getYcoors(boids);
  averageX = average(xs);
  averageY = average(ys);

  moveX = predator.x + averageX;
  moveY = predator.y + averageY;
  
  predator.dx += moveX * velocityFactor;
  predator.dy += moveY * velocityFactor;
}

function avoidPredator(boid) {
  const avoidFactor = 0.05;
  let moveX = 0;
  let moveY = 0; 

  if (distance(boid, predator) < dangerZone) {
    moveX += boid.x - predator.x;
    moveY += boid.y - predator.y;
  }

  boid.dx += moveX * avoidFactor;
  boid.dy += moveY * avoidFactor;
}


function animation() {
  for (let boid of boids) {
    flyTowardsCenter(boid);
    avoidOthers(boid);
    matchVelocity(boid);
    limitSpeed(boid);
    keepInBounds(boid);
    
    if (predator) {
      avoidPredator(boid)
    }

    boid.x += boid.dx;
    boid.y += boid.dy;
  }

  if (predator) {
    keepInBounds(predator);
    flyTowardsBoids(predator);
    limitSpeed(predator);
    predator.x += predator.dx;
    predator.y += predator.dy;
  }

  const context = document.getElementById("boids").getContext("2d");
  context.clearRect(0, 0, width, height);

  if (predator) 
    drawBoid(context, predator);

  for (let boid of boids) 
    drawBoid(context, boid);

  window.requestAnimationFrame(animation);
}

window.addEventListener('load', 
function() {
  window.addEventListener("resize", sizeCanvas, false);
  sizeCanvas();
  startBoids();
  window.requestAnimationFrame(animation); 
});
