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
        this.playerPos = [11, 11];
        this._grid[11][11] = new Mouse(this.x+(this.gridsize*11), this.y+(this.gridsize*10));
    }

    moveMouseLeft() {
        if (this.playerPos[0] == 0) {return}
        let mouse = this._grid[this.playerPos[1]][this.playerPos[0]];
        let tile = this._grid[this.playerPos[1]][this.playerPos[0]-1];
        this._grid[this.playerPos[1]][this.playerPos[0]] = tile;
        this._grid[this.playerPos[1]][this.playerPos[0]-1] = mouse;
        this.playerPos[0] -= 1;
        tile.x += this.gridsize;
        mouse.x -= this.gridsize;
    }

    moveMouseRight() {
        if (this.playerPos[0] == 22) {return}
        let mouse = this._grid[this.playerPos[1]][this.playerPos[0]];
        let tile = this._grid[this.playerPos[1]][this.playerPos[0]+1];
        this._grid[this.playerPos[1]][this.playerPos[0]] = tile;
        this._grid[this.playerPos[1]][this.playerPos[0]+1] = mouse;
        this.playerPos[0] += 1;
        tile.x -= this.gridsize;
        mouse.x += this.gridsize;
    }

    moveMouseDown() {
        if (this.playerPos[1] == 22) {return}
        let mouse = this._grid[this.playerPos[1]][this.playerPos[0]];
        let tile = this._grid[this.playerPos[1]+1][this.playerPos[0]];
        this._grid[this.playerPos[1]][this.playerPos[0]] = tile;
        this._grid[this.playerPos[1]+1][this.playerPos[0]] = mouse;
        this.playerPos[1] += 1;
        tile.y -= this.gridsize;
        mouse.y += this.gridsize;
    }

    moveMouseUp() {
        if (this.playerPos[1] == 0) {return}
        let mouse = this._grid[this.playerPos[1]][this.playerPos[0]];
        let tile = this._grid[this.playerPos[1]-1][this.playerPos[0]];
        this._grid[this.playerPos[1]][this.playerPos[0]] = tile;
        this._grid[this.playerPos[1]-1][this.playerPos[0]] = mouse;
        this.playerPos[1] -= 1;
        tile.y += this.gridsize;
        mouse.y -= this.gridsize;
    }
}

class Floor extends Thing {
    constructor(x, y) {
        super(x, y, 38, 38, 'planks');
    }
}

class Mouse extends Thing {
    constructor(x, y) {
        super(x, y, 38, 38, 'mouse');
    }

    draw(ctx, drawSprite) {
        drawSprite.planks(this.x, this.y);
        super.draw(ctx, drawSprite);
    }
}