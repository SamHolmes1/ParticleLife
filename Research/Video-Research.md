# Particle Life/ Clusters

Originally created by Jeffrey Ventrella in around 2018. He in turn was inspired by Lynn Margulis.

The original video here describes the basic concept: https://vimeo.com/222974687

He doesn't really go into depth but basic premise is this:

Given three types of particles, Red Green and Blue, we can describe the relationship between them in terms of attraction and repulsion

Red is attracted to blue\
Blue is repulsed by Red\
Green is attracted to Green

You can repeat this for as many unique particles as you want.

# Video 1 - The code behind Particle Life

[Source] \
https://www.youtube.com/watch?v=scvuli-zcRc - The code behind Particle Life by Tom Mohr

Each particle has three properties: \
colour(Integer) represented by C \
position(Real Vector) represented by X  
and velocity(Real Vector) represented by Ẋ(with a little dot on top to denote it as a time derivative of the position).

[Force Function] \
The core part of the simulation is the force function, which describes the strength of the attraction between two particles. \
It takes two values: \
The distance between the two particles as a vector (calculated by subtracting their coordinates) represented by r\
The attraction factor (calculated by inputting both particle colours into an attraction matrix) represented by a

So the force function looks like this: F(r, a);

## Force

[Math] \
The function outputs a force value from -1 to 1.
We can use a random value from 0 to 1 and define it as $\beta$. This denotes the range at which we want to check our attraction matrix.

$$
F(r, a) = \begin{cases}
\hspace{1.2em} \frac{r}{b} - 1, \hspace{5.1em} r < \beta \\
a \cdot (1 - \frac {2r - 1 - \beta} {1 - \beta}), \hspace{2em} \beta < r < 1 \\
\hspace{1.3em} 0, \hspace{6.8em} otherwise
\end{cases}
$$

or:

```js
function force(r, a) {
  const beta = 0.5;
  if (r < beta) {
    return r / b - 1;
  } else if (beta < r && r < 1) {
    return (a * (1 - (2 * r - 1 - beta))) / 1 - beta;
  } else {
    return 0;
  }
}
```

### Magnitude

When calculating the magnitude of the force, it needs to be in the direction of the other particle.
Because the force function expects distance values to be from 0 to 1, we must also normalize the input vector.
\
i = the particle\
j = all other particles\
$\ddot x$ = acceleration\
$\frac{\stackrel{\rightarrow}{r}}{r}$ = direction\
$^rmax$ = the radius at which particle interactions can occur

Our new function looks like this

$$
\ddot x =\ ^rmax \sum_{j} \frac{\stackrel{\rightarrow}{r}}{r} F(\frac{r}{^rmax},a)
$$

### Friction & Time

In the simulation, we have to take in to account time in order to calculate the new positions of particles based on velocity. For this we can use $\Delta t$ and add it to the velocity and positions

We can also introduce a friction half-life, which describes how much time should pass when half of the velocity is lost

Velocoties: $\dot Xi \leftarrow (\frac 12)^{\Delta t/^thalf} \dot Xi + \ddot Xi\Delta t$

Positions: $\dot Xi \leftarrow Xi + \dot Xi \Delta t$

## Variables

This is the final list of variables that are needed

$N \in \mathbb{N}$ Number of particles\
$M \in \mathbb{N}$ Number of colours\
$D \in \mathbb{N}$ Number of dimensions\
$C^i \in \mathbb{Z}^M$ Colours\
$X^i \in \mathbb{R}^D$ Positions\
$\dot X^i \in \mathbb{R}^D$ Velocities\
$A \in [-1,1]^{d \times d}$ Attraction matrix\
$^thalf \geq 0$ Friction half time\
$\Delta t$ Time step\
$^rmax > 0$ maximum radius

# Video 2 - Create Artificial Life From Simple Rules - Particle Life

[Source]\
https://www.youtube.com/watch?v=0Kx4Y9TVMGg&t=579s - Create Artificial Life From Simple Rules - Particle Life

His implementation relies on objects that are created with a factory function and then stored into a single array.

```js
particles = [];
const particle = (x, y, c) => {
  return { x: x, y: y, velocityX: 0, velocityY: 0, colour: c };
};
```

In the creation of particles, he seperates them out by colour.

```js
const create = (number, colour) => {
  group = [];
  for (let i = 0; i < number; i++) {
    group.push(
      // Generate a particle within the bounds of a 500 x 500 canvas
      particle(Math.random() * 400 + 50, Math.random() * 400 + 50, colour)
    );
    particles.push(group[i]);
  }
  return group;
};
```

## Distance

In order to calculate the distance between particles, he is using the pythagorean Theorem:

$$
C = \sqrt{a^2 + b^2}
$$

I'm unsure how performant this is, Will have to test. He also uses a nested for loop in order to generate new positions based on velocity.

Instead of a force function, he defines a rule function that iterates over two sets of

With this approach, you can see that even in his c++ implementation, it's super slow. Either that or there is no smoothing effect or use of $\Delta t$ which I think is essential.

# Notes

- In this example, if you were to do boundaries so that the canvas edges are the walls, you would want to check the coordinates after they were normalized, to make life easier

## Colour matrix

Instead of a dynamically generated attraction matrix, one that has an initial state would be better, from there it can be changed with a ui.

## Performance

Since i'm using Tauri for this project, it is well worth trying to hand this computation off to rust and then send it back to the front end.

Space partitioning is a must for this project as currently, Tom mohrs implementation is very slow as we're doing 1000 \* 1000 iterations per frame, way too much.

At first I considered an object oriented approach, but I don't think would be memory efficient. I really like the array approach, where each particle is stored as an index, and it is essembled when it's rendered.
