/*
*  On-screen arrow keys for use by a touchscreen
*/
import { ClickableThing, Thing } from "./thing.js";

export class Dpad extends Thing {
    constructor(game, x, y) {
        super(x, y, 277, 186);
        this.game = game;
        this.left = new ClickableThing(this.x - this.width / 2, this.y + 90, 90, 100, 'dpad_left');
        this.down = new ClickableThing(this.x - this.width / 2 + 90, this.y + 90, 90, 100, 'dpad_down');
    }

    update(ratio, keyboard, mouse) {
        this.left.update(ratio, keyboard, mouse, this.leftPressed, this);
        this.down.update(ratio, keyboard, mouse, this.downPressed, this);
    }

    draw(ctx, drawSprite) {
        this.left.draw(ctx, drawSprite);
        this.down.draw(ctx, drawSprite);
    }

    leftPressed(self) {
        self.game.gameOver();
    }

    downPressed(self) {
        self.game.gameOver();
    }
}