---
layout: page
title: Blobs
---
<canvas id="boids"></canvas> 

<script src="\scripts\boids.js"> </script>

<div style="text-align:center;">
    <button class="button button3" onclick="togglePredator()">Add Predator</button>
</div>

&nbsp;
&nbsp;
&nbsp;

Blobs is an implementation of [Boids](https://en.wikipedia.org/wiki/Boids), an artifical life algorithm developed by [Craig Reynolds](http://www.red3d.com/cwr/index.html) that stimulates the natural flocking behavior of birds.

The blobs follow three simple rules.

1. Coherence - Each blob flies towards each other gradually, forming a cohesive flock.
2. Alignment - Each blob tries to match the velocity of the boids around it.
3. Seperation - The blobs will try to avoid running into each other, and if they get too close then they gradually steer away from each other. 


This project is largely inspired by [Ben Eater](https://eater.net/) who has also implemented this algorithm on his site. You can view his demo [here](https://eater.net/boids).

You can view the source code of this project here.
