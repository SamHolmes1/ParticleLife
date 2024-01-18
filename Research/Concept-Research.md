# Periodic boundary conditions

# Spatial partitioning

[Sources]\
http://gameprogrammingpatterns.com/spatial-partition.html

In essence, the rendering environment(canvas) is split up into grids of depth n.Visually, you can think of it like a matrix [1:[[][]] 2:[[][]] 3:[[][]]], the normal representation is some kind of tree structure but a custom grid implementation can work.

Instead of checking every particle against every other particle you only check a particle against other particles within the same cell of the grid. So, with Tom Mohrs implementation, this would mean instead of using a nested for loop, you would loop through each cell within the grid.
