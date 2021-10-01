import { WorldScene } from "./world.js";
import { Button } from "../button.js";

export class MenuScene {
    constructor(game) {
        this.button = new StartButton(game, game.ctx.canvas.width / 2 - 288, game.ctx.canvas.height / 2 - 32);
        this.world = new WorldScene(game);
        this.game = game;
    }

    update(ratio, keyboard, mouse) {
        let changeScene = function(self) {
            self.game.changeScene(self.world);
        }
        this.button.update(ratio, keyboard, mouse, changeScene, this);
    }

    draw(ctx, drawSprite) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        this.world.draw(ctx, drawSprite);
        this.game.darkenCanvas(ctx);
        ctx.fillStyle = "#fff";
        let text = "Rodent's Revenge";
        ctx.fillText(text, this.button.x + (this.button.width/2) - (ctx.measureText(text).width/2), this.button.y - 28);
        this.button.draw(ctx, drawSprite);
    }
}

class StartButton extends Button {
    constructor(game, x, y) {
        let outline = "rgba(255, 255, 255, 1.0)";
        let colour = "rgba(55, 95, 145, 1.0)";
        super(x, y, 576, 96, "PLAY", outline, colour);
        this.game = game;
    }
}