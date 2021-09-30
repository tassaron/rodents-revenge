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
        this.cooldown = 50.0;
        this.resetWorld();
    }

    resetWorld() {
        // Fills the worldgrid with initial gamestate
        this.playerPos = [11, 11];
        this.catPos = [[3, 3]];
        this._grid[11][11] = new Mouse(this.xAt(11), this.yAt(11));
        this._grid[3][3] = new Cat(0, this.xAt(3), this.yAt(3));
        this._grid[3][4] = new Crate(this.xAt(4), this.yAt(3));
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

    moveCat(x, y) {
        let cat = this._grid[y][x];
        if (cat.state == 'sitting' || cat.state == 'sat' || [x, y] == this.playerPos) {
            this.catPos.splice(cat.i, 1);
            return
        }
        let neighbours;
        // special-case for top and bottom y-coords because we can't index undefined
        if (y == 0) {
            neighbours = [
                this._grid[y+1][x], null, this._grid[y][x+1], this._grid[y][x-1],
                this._grid[y+1][x+1], this._grid[y+1][x-1], null, null
            ]
        } else if (y == this.rows - 1) {
            neighbours = [
                null, this._grid[y-1][x], this._grid[y][x+1], this._grid[y][x-1],
                null, null, this._grid[y-1][x+1], this._grid[y-1][x-1]
            ]
        } else {
            // 99% case. some will be undefined if x==0 or x==this.cols-1
            neighbours = [
                this._grid[y+1][x], this._grid[y-1][x], this._grid[y][x+1], this._grid[y][x-1],
                this._grid[y+1][x+1], this._grid[y+1][x-1], this._grid[y-1][x+1], this._grid[y-1][x-1]
            ]
        }
        let walkable = neighbours.map((cell) => cell instanceof Floor || cell instanceof Mouse);
        let directions = {
            "upleft": walkable[7],
            "up": walkable[1],
            "upright": walkable[6],
            "left": walkable[3],
            "right": walkable[2],
            "downleft": walkable[5],
            "down": walkable[0],
            "downright": walkable[4]
        }
        let xPref; let yPref;
        let options=[];
        if (this.playerPos[0] > x) {xPref=1} else if (this.playerPos[0] < x) {xPref=-1} else {xPref=0;}
        if (this.playerPos[1] > y) {yPref=1} else if (this.playerPos[1] < y) {yPref=-1} else {yPref=0;}
        cat.facing = xPref;
        if (xPref == -1) {
            if (yPref == 1 && directions.downleft) {options.push([y+1, x-1])}
            if (yPref == -1 && directions.upleft) {options.push([y-1, x-1])}
            if (directions.left && options.length == 0) {options.push([y, x-1])}
        } else if (xPref == 1) {
            if (yPref == 1 && directions.downright) {options.push([y+1, x+1])}
            if (yPref == -1 && directions.upright) {options.push([y-1, x+1])}
            if (directions.right && options.length == 0) {options.push([y, x+1])}
        } else {
            if (yPref == -1) {
                if (directions.up) {options.push([y-1, x])}
            } else if (yPref == 1) {
                if (directions.down) {options.push([y+1, x])}
            }
        }
        let option = options[0];
        if (options.length == 0 || cat.idleCooldown > 0.0) {
            cat.state = 'idle';
            cat.startingWalk = 0;
            if (xPref == -1) {
                if (directions.left) {options.push([y, x-1])}
            } else if (xPref == 1) {
                if (directions.right) {options.push([y, x+1])}
            } else {
                if (yPref == -1) {
                    if (directions.upleft) {options.push([y-1, x-1])}
                    if (directions.upright) {options.push([y-1, x+1])}
                } else if (yPref == 1) {
                    if (directions.downleft) {options.push([y+1, x-1])}
                    if (directions.downright) {options.push([y+1, x+1])}
                } else {
                    if (directions.up) {options.push([y-1, x])}
                    if (directions.down) {options.push([y+1, x])}
                }
            }
            if (yPref == -1) {
                if (directions.up) {options.push([y-1, x])}
            } else if (xPref == 1) {
                if (directions.down) {options.push([y+1, x])}
            } else {
                if (xPref == -1) {
                    if (directions.downleft) {options.push([y+1, x-1])}
                    if (directions.upleft) {options.push([y-1, x-1])}
                } else if (xPref == 1) {
                    if (directions.upright) {options.push([y-1, x+1])}
                    if (directions.downright) {options.push([y+1, x+1])}
                } else {
                    if (directions.left) {options.push([y, x-1])}
                    if (directions.right) {options.push([y, x+1])}
                }
            }
            option = options[Math.floor(Math.random()*options.length)]
        } else {
            //console.log([option[1], option[0]])
            //console.log(this.playerPos)
            //console.log(`going to ${option[1]}, ${option[0]}`);
            if (cat.startingWalk == 2) {
                cat.state = 'walking';
            } else {
                cat.startingWalk++;
            }
        }
        if (options.length == 0) {
            // we can't go straight towards the target, nor a secondary direction
            // time to give up and move randomly
            if (directions.up) {options.push([y-1, x])}
            if (directions.down) {options.push([y+1, x])}
            if (directions.left) {options.push([y, x-1])}
            if (directions.right) {options.push([y, x+1])}
            if (directions.downleft) {options.push([y+1, x-1])}
            if (directions.downright) {options.push([y+1, x+1])}
            if (directions.upleft) {options.push([y-1, x-1])}
            if (directions.upright) {options.push([y-1, x+1])}
            if (options.length == 0) {
                cat.state = 'sitting';
                return
            }
            option = options[Math.floor(Math.random()*options.length)]
        }
        let tile = this._grid[option[0]][option[1]];
        this._grid[option[0]][option[1]] = cat;
        if (tile instanceof Mouse) {
            this._grid[y][x] = new Floor(this.xAt(x), this.yAt(y));
            this.game.gameOver();
        } else {
            this._grid[y][x] = tile;
            tile.x = this.xAt(x);
            tile.y = this.yAt(y);
        }
        cat.x = this.xAt(option[1]);
        cat.y = this.yAt(option[0]);
        this.catPos[cat.i] = [option[1], option[0]];
    }

    update(ratio, keyboard, mouse) {
        if (!this.game.game_over) {
            this.cooldown -= ratio;
            if (this.cooldown < 0.0) {
                for (let coords of this.catPos) {
                    this.moveCat(coords[0], coords[1]);
                }
                this.cooldown = 50.0;
            }
        }
        super.update(ratio, keyboard, mouse);
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