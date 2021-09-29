/*
* A grid that stores every tile of the game world, including the player tile
*/
import { Grid } from './grid.js';
import { Thing } from './thing.js';

export class WorldGrid extends Grid {
    constructor() {
        super(0, 38, 23, 23, 38, Floor);
        this.resetWorld();
    }

    resetWorld() {
        // Fills the worldgrid with initial gamestate
    }
}

class Floor extends Thing {
    constructor(x, y) {
        super(x, y, 38, 38, 'planks');
    }
}