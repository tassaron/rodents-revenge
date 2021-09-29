/*
* A grid that stores every tile of the game world, including the player tile
*/
import { Grid } from './grid.js';
import { Thing } from './thing.js';
import { Cat } from './cat.js';

export class WorldGrid extends Grid {
    constructor(game) {
        super(0, 38, 23, 23, 38, Floor);
        this.game = game;
        this.resetWorld();
    }

    resetWorld() {
        // Fills the worldgrid with initial gamestate
        this.playerPos = [11, 11];
        this._grid[11][11] = new Mouse(this.xAt(11), this.yAt(11));
        this._grid[3][3] = new Cat(this.xAt(3), this.yAt(3));
        this._grid[6][6] = new Crate(this.xAt(6), this.yAt(6));
        this._grid[9][6] = new Crate(this.xAt(6), this.yAt(9));
        this._grid[9][7] = new Crate(this.xAt(7), this.yAt(9));
        this._grid[9][8] = new Crate(this.xAt(8), this.yAt(9));
        this._grid[9][9] = new Crate(this.xAt(9), this.yAt(9));
    }

    xAt(coord) {
        return this.x+(this.gridsize*coord)
    }

    yAt(coord) {
        return this.y+(this.gridsize*(coord-1))
    }

    moveMouseLeft() {
        if (this.playerPos[0] == 0) {return}
        let tile = this._grid[this.playerPos[1]][this.playerPos[0]-1];
        let mouse = this._grid[this.playerPos[1]][this.playerPos[0]];
        if (tile instanceof Floor) {
            this._grid[this.playerPos[1]][this.playerPos[0]] = tile;
            this._grid[this.playerPos[1]][this.playerPos[0]-1] = mouse;
            this.playerPos[0] -= 1;
            tile.x += this.gridsize;
            mouse.x -= this.gridsize;
        } else if (tile instanceof Cat) {
            this.game.gameOver();
        } else if (tile instanceof Crate) {
            // search leftward for more crates
            let floortile;
            let x;
            for (x = this.playerPos[0] - 1; x > -1; x--) {
                floortile = this._grid[this.playerPos[1]][x];
                if (floortile instanceof Crate) {continue} else {break}
            }
            // floortile should now be a floor tile, or else we can't move
            if (floortile instanceof Crate) {return}
            this._grid[this.playerPos[1]][x] = tile;
            this._grid[this.playerPos[1]][this.playerPos[0]-1] = mouse;
            this._grid[this.playerPos[1]][this.playerPos[0]] = floortile;
            this.playerPos[0] -= 1;
            tile.x = this.gridsize * x;
            floortile.x = mouse.x;
            mouse.x -= this.gridsize;
        }
    }

    moveMouseRight() {
        if (this.playerPos[0] == this.cols - 1) {return}
        let mouse = this._grid[this.playerPos[1]][this.playerPos[0]];
        let tile = this._grid[this.playerPos[1]][this.playerPos[0]+1];
        if (tile instanceof Floor) {
            this._grid[this.playerPos[1]][this.playerPos[0]] = tile;
            this._grid[this.playerPos[1]][this.playerPos[0]+1] = mouse;
            this.playerPos[0] += 1;
            tile.x -= this.gridsize;
            mouse.x += this.gridsize;
        } else if (tile instanceof Cat) {
            this.game.gameOver();
        } else if (tile instanceof Crate) {
            // search rightward for more crates
            let floortile;
            let x;
            for (x = this.playerPos[0] + 1; x < this.cols; x++) {
                floortile = this._grid[this.playerPos[1]][x];
                if (floortile instanceof Crate) {continue} else {break}
            }
            // floortile should now be a floor tile, or else we can't move
            if (floortile instanceof Crate) {return}
            this._grid[this.playerPos[1]][x] = tile;
            this._grid[this.playerPos[1]][this.playerPos[0]+1] = mouse;
            this._grid[this.playerPos[1]][this.playerPos[0]] = floortile;
            this.playerPos[0] += 1;
            tile.x = this.gridsize * x;
            floortile.x = mouse.x;
            mouse.x += this.gridsize;
        }
    }

    moveMouseDown() {
        if (this.playerPos[1] == this.rows - 1) {return}
        let mouse = this._grid[this.playerPos[1]][this.playerPos[0]];
        let tile = this._grid[this.playerPos[1]+1][this.playerPos[0]];
        if (tile instanceof Floor) {
            this._grid[this.playerPos[1]][this.playerPos[0]] = tile;
            this._grid[this.playerPos[1]+1][this.playerPos[0]] = mouse;
            this.playerPos[1] += 1;
            tile.y -= this.gridsize;
            mouse.y += this.gridsize;
        } else if (tile instanceof Cat) {
            this.game.gameOver();
        } else if (tile instanceof Crate) {
            // search downward for more crates
            let floortile;
            let y;
            for (y = this.playerPos[1] + 1; y < this.rows; y++) {
                floortile = this._grid[y][this.playerPos[0]];
                if (floortile instanceof Crate) {continue} else {break}
            }
            // floortile should now be a floor tile, or else we can't move
            if (floortile instanceof Crate) {return}
            this._grid[y][this.playerPos[0]] = tile;
            this._grid[this.playerPos[1]+1][this.playerPos[0]] = mouse;
            this._grid[this.playerPos[1]][this.playerPos[0]] = floortile;
            this.playerPos[1] += 1;
            tile.y = this.gridsize * y;
            floortile.y = mouse.y;
            mouse.y += this.gridsize;
        }
    }

    moveMouseUp() {
        if (this.playerPos[1] == 0) {return}
        let mouse = this._grid[this.playerPos[1]][this.playerPos[0]];
        let tile = this._grid[this.playerPos[1]-1][this.playerPos[0]];
        if (tile instanceof Floor) {
            this._grid[this.playerPos[1]][this.playerPos[0]] = tile;
            this._grid[this.playerPos[1]-1][this.playerPos[0]] = mouse;
            this.playerPos[1] -= 1;
            tile.y += this.gridsize;
            mouse.y -= this.gridsize;
        } else if (tile instanceof Cat) {
            this.game.gameOver();
        } else if (tile instanceof Crate) {
            // search upward for more crates
            let floortile;
            let y;
            for (y = this.playerPos[1] - 1; y > -1; y--) {
                floortile = this._grid[y][this.playerPos[0]];
                if (floortile instanceof Crate) {continue} else {break}
            }
            // floortile should now be a floor tile, or else we can't move
            if (floortile instanceof Crate) {return}
            this._grid[y][this.playerPos[0]] = tile;
            this._grid[this.playerPos[1]-1][this.playerPos[0]] = mouse;
            this._grid[this.playerPos[1]][this.playerPos[0]] = floortile;
            this.playerPos[1] -= 1;
            tile.y = this.gridsize * y;
            floortile.y = mouse.y;
            mouse.y -= this.gridsize;
        }
    }
}

class Floor extends Thing {
    constructor(x, y) {
        super(x, y, 38, 38, 'planks');
    }
}

class Crate extends Thing {
    constructor(x, y) {
        super(x, y, 38, 38, 'crate');
    }
}

class Wall extends Thing {
    constructor(x, y) {
        super(x, y, 38, 38);
    }

    draw(ctx, drawSprite) {
        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y, this.width, this.height);
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