/*
* A grid that stores every tile of the game world, including the player tile
*/
import { Grid } from './grid.js';

export class WorldGrid extends Grid {
    constructor() {
        super(0, 38, 23, 23, 38);
        this.resetWorld();
    }

    resetWorld() {
        // Fills the worldgrid with initial gamestate
    }
}