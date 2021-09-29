import { WorldGrid } from "../worldgrid.js";
import { Cat } from "../cat.js";
import { Dpad } from "../dpad.js";

export class WorldScene {
    constructor(game) {
        this.game = game;
        this.grid = new WorldGrid();
        this.grid._grid[0][0] = new Cat(1, 1);
        this.dpad = new Dpad(game, game.ctx.canvas.width / 2, this.grid.height);
    }

    update(ratio, keyboard, mouse) {
        this.grid.update(ratio, keyboard, mouse);
        this.dpad.update(ratio, keyboard, mouse);
    }

    draw(ctx, drawSprite) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        this.grid.draw(ctx, drawSprite);
        this.dpad.draw(ctx, drawSprite);
    }
}

