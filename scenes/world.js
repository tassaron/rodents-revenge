import { WorldGrid } from "../worldgrid.js";
import { Cat } from "../cat.js";
import { Dpad } from "../dpad.js";

export class WorldScene {
    constructor(game) {
        this.game = game;
        this.grid = new WorldGrid(game);
        this.dpad = new Dpad(this.grid, game.ctx.canvas.width / 2, this.grid.height);
    }

    update(ratio, keyboard, mouse) {
        if (this.grid.cheeseCollected == this.game.level + 1) {
            this.game.level++;
            this.grid = new WorldGrid(this.game);
            this.dpad.grid = this.grid;
        }
        this.grid.update(ratio, keyboard, mouse);
        this.dpad.update(ratio, keyboard, mouse);
    }

    draw(ctx, drawSprite) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        this.grid.draw(ctx, drawSprite);
        this.dpad.draw(ctx, drawSprite);
    }
}

