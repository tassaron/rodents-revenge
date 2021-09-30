/*
* A grid that stores every tile of the game world, including the player tile
*/
import { Grid } from './grid.js';
import { Thing } from './thing.js';
import { Cat } from './cat.js';

export class WorldGrid extends Grid {
    constructor(game) {
        super(0, 38, 24, 22, 38, Floor);
        this.game = game;
        this.cooldown = 50.0;
        this.resetWorld();
        this.cheesePos = [];
    }

    resetWorld() {
        // Fills the worldgrid with initial gamestate
        this.playerPos = [11, 11];
        this.catPos = [[2, 2], [21, 11]];
        this._grid[11][11] = new Mouse(this.xAt(11), this.yAt(11));
        this._grid[2][2] = new Cat(0, this.xAt(2), this.yAt(2));
        this._grid[11][21] = new Cat(1, this.xAt(21), this.yAt(11));
        for (let y=3; y<this.rows-3; y++) {
            for (let x=3; x<this.cols-3; x++) {
                if (y > 6 && y < this.rows-6 && x > 6 && x < this.cols-6) {continue}
                this._grid[y][x] = new Crate(this.xAt(x), this.yAt(y));
            }
        }
        let wallSpawns = this.game.level * 2;
        for (let i = 0; i < wallSpawns; i++) {
            let y = Math.floor(Math.random()*this.rows);
            let x = Math.floor(Math.random()*this.cols);
            this._grid[y][x] = new Wall(this.xAt(x), this.yAt(y));
        }
    }

    xAt(coord) {
        return this.x+(this.gridsize*coord)
    }

    yAt(coord) {
        return this.y+(this.gridsize*(coord-1))
    }

    moveMouseLeft() {
        this.moveMouseHori(-1);
    }

    moveMouseRight() {
        this.moveMouseHori(1);
    }

    moveMouseUp() {
        this.moveMouseVert(-1);
    }

    moveMouseDown() {
        this.moveMouseVert(1);
    }

    moveMouseHori(movement) {
        if (this.playerPos[0] == (movement == 1 ? this.cols-1 : 0)) {return}
        let crate = this._grid[this.playerPos[1]][this.playerPos[0]+movement];
        let mouse = this._grid[this.playerPos[1]][this.playerPos[0]];
        if (crate instanceof Floor) {
            this._grid[this.playerPos[1]][this.playerPos[0]] = crate;
            this._grid[this.playerPos[1]][this.playerPos[0]+movement] = mouse;
            this.playerPos[0] += movement;
            crate.x -= movement*this.gridsize;
            mouse.x += movement*this.gridsize;
        } else if (crate instanceof Cat) {
            if (crate.state == "cheese") {
                this.game.score += 100 * this.game.level;
                this._grid[this.playerPos[1]][this.playerPos[0]+movement] = new Floor(this.xAt(this.playerPos[0]+movement), this.yAt(this.playerPos[1]));
                this.moveMouseHori(movement);
                return
            } else {
                this.game.gameOver();
            }
        } else if (crate instanceof Crate) {
            // search horizontally for more crates
            let floortile;
            let x;
            let catx;
            let r;
            function search(self, x) {
                floortile = self._grid[self.playerPos[1]][x];
                if (floortile instanceof Crate) {
                    return true;
                } else if (floortile instanceof Cat) {
                    if (catx === undefined) {
                        catx = x;
                    }
                    return true;
                } else {
                    return false;
                }
            }
            if (movement == 1) {
                for (x = this.playerPos[0] + 1; x < this.cols; x++) {
                    r = search(this, x);
                    if (r) {continue} else {break}
                }
            } else {
                for (x = this.playerPos[0] - 1; x > -1; x--) {
                    r = search(this, x);
                    if (r) {continue} else {break}
                }
            }
            // if floortile is not Floor by this point, then we can't move
            if (!(floortile instanceof Floor)) {return}
            if (catx !== undefined) {
                let cat = this._grid[this.playerPos[1]][catx];
                this._grid[this.playerPos[1]][catx] = crate;
                this._grid[this.playerPos[1]][x] = cat;
                crate.x = this.gridsize * catx;
                cat.x = this.gridsize * x;
                this.catPos[cat.i] = [x, this.playerPos[1]];
            } else {
                this._grid[this.playerPos[1]][x] = crate;
                crate.x = this.gridsize * x;
            }
            this._grid[this.playerPos[1]][this.playerPos[0]+movement] = mouse;
            this._grid[this.playerPos[1]][this.playerPos[0]] = floortile;
            this.playerPos[0] += movement;
            floortile.x = mouse.x;
            mouse.x += movement*this.gridsize;
        }
    }

    moveMouseVert(movement) {
        if (this.playerPos[1] == (movement == 1 ? this.rows - 1 : 0)) {return}
        let mouse = this._grid[this.playerPos[1]][this.playerPos[0]];
        let crate = this._grid[this.playerPos[1]+movement][this.playerPos[0]];
        if (crate instanceof Floor) {
            this._grid[this.playerPos[1]][this.playerPos[0]] = crate;
            this._grid[this.playerPos[1]+movement][this.playerPos[0]] = mouse;
            this.playerPos[1] += movement;
            crate.y -= movement*this.gridsize;
            mouse.y += movement*this.gridsize;
        } else if (crate instanceof Cat) {
            if (crate.state == "cheese") {
                this.game.score += 100 * this.game.level;
                this._grid[this.playerPos[1]+movement][this.playerPos[0]] = new Floor(this.xAt(this.playerPos[0]), this.yAt(this.playerPos[1]+movement));
                this.moveMouseVert(movement);
                return
            } else {
                this.game.gameOver();
            }
        } else if (crate instanceof Crate) {
            // search vertically for more crates
            let floortile;
            let y;
            let caty;
            let r;
            function search(self, y) {
                floortile = self._grid[y][self.playerPos[0]];
                if (floortile instanceof Crate) {
                    return true;
                } else if (floortile instanceof Cat) {
                    if (caty === undefined) {
                        caty = y;
                    }
                    return true;
                } else {
                    return false;
                }
            }
            if (movement == 1) {
                for (y = this.playerPos[1] + 1; y < this.rows; y++) {
                    r = search(this, y);
                    if (r) {continue} else {break}
                }
            } else {
                for (y = this.playerPos[1] - 1; y > -1; y--) {
                    r = search(this, y);
                    if (r) {continue} else {break}
                }
            }
            // if floortile is not Floor by this point, then we can't move
            if (!(floortile instanceof Floor)) {return}
            if (caty !== undefined) {
                let cat = this._grid[caty][this.playerPos[0]];
                this._grid[caty][this.playerPos[0]] = crate;
                this._grid[y][this.playerPos[0]] = cat;
                crate.y = this.gridsize * caty;
                cat.y = this.gridsize * y;
                this.catPos[cat.i] = [this.playerPos[0], y];
            } else {
                this._grid[y][this.playerPos[0]] = crate;
                crate.y = this.gridsize * y;
            }
            this._grid[this.playerPos[1]+movement][this.playerPos[0]] = mouse;
            this._grid[this.playerPos[1]][this.playerPos[0]] = floortile;
            this.playerPos[1] += movement;
            floortile.y = mouse.y;
            mouse.y += movement*this.gridsize;
        }
    }

    moveCat(x, y) {
        let cat = this._grid[y][x];
        if (cat.state == 'sitting' || cat.state == 'sat' || [x, y] == this.playerPos) {
            return
        }
        if (cat.state == 'cheese') {
            this.cheesePos.push(this.catPos.splice(cat.i, 1));
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
                for (let i = 0; i < this.catPos.length; i++) {
                    this.moveCat(...this.catPos[i]);
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
        ctx.fillStyle = "rgba(217, 160, 102, 0.5)";
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