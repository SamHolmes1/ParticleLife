# ParticleLife

This project aims to recreate the original clusters generative art piece created by [Jeffrey Ventrella](https://www.ventrella.com/Clusters/) and then further expanded on by [Tom Mohr](https://particle-life.com).

## Running a local development version

1. Run `npm install` in the Particle-life folder to install dependencies
2. Run `npm run tauri dev` to install Tauri's dependencies and then open a window with the application.

## Modifying the simulation

The main constants within `src/main.ts` are PARTICLE_COUNT, COLOUR_COUNT and DELTA_TIME which control the ammount of particles, How many different colours of particle there are, and the speed of the simulation respectivley.

## Creating a build

Simply run `npm run tauri build`.  
This will create a windows binary in `/src-tauri/target/release`. Currently there are no User interface controls on this branch, to reset the simulation you can use `Ctrl-r` to reset the simulation.
