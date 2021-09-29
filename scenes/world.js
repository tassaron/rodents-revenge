import { WorldGrid } from "../worldgrid.js";
import { Cat } from "../cat.js";

export class WorldScene {
    constructor(game) {
        this.game = game;
        //this.grid = new WorldGrid();
        this.test = new Cat(1, 1);
    }

    update(ratio, keyboard, mouse) {
        //this.grid.update(ratio, keyboard, mouse);
        this.test.update(ratio, keyboard, mouse);
    }

    draw(ctx, drawSprite) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        //this.grid.draw(ctx, drawSprite);
        this.test.draw(ctx, drawSprite);
    }
}

