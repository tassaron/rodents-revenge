import { WorldGrid } from "../worldgrid.js";
import { Cat } from "../cat.js";
import { Dpad } from "../dpad.js";

export class WorldScene {
    constructor(game) {
        this.game = game;
        this.grid = new WorldGrid(game);
        this.dpad = new Dpad(this.grid, game.ctx.canvas.width / 2, this.grid.height);
        this.scoreDisplay = new ScoreDisplay(
            game, game.ctx.canvas.width / 2 - this.dpad.width, this.grid.height + 48, "score",
        );
        this.hiscoreDisplay = new ScoreDisplay(
            game, game.ctx.canvas.width / 2 - this.dpad.width, this.grid.height + 104, "high_score", "Best: ", "1.75rem var(--arcade-font)"
        );
        this.levelDisplay = new ScoreDisplay(
            game, game.ctx.canvas.width / 2 + this.dpad.width, this.grid.height + 48, "level", "Level: "
        );
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
        this.scoreDisplay.draw(ctx);
        this.hiscoreDisplay.draw(ctx);
        this.levelDisplay.draw(ctx);
    }
}

class ScoreDisplay {
    constructor(game, x, y, variable, label="Score: ", font="2.25rem var(--arcade-font)", colour="#fff") {
        this.game = game;
        this.variable = variable;
        this.x = x;
        this.y = y;
        this.font = font;
        this.label = label;
        this.colour = colour;
    }

    draw(ctx) {
        ctx.font = this.font;
        ctx.fillStyle = this.colour;
        let text = `${this.label}${this.game[this.variable]}`;
        ctx.fillText(text, this.x - (ctx.measureText(text).width/2), this.y);
    }
}