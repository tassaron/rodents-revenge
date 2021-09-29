/*
*  On-screen arrow keys for use by a touchscreen
*/
import { ClickableThing, Thing } from "./thing.js";

export class Dpad extends Thing {
    constructor(grid, x, y) {
        super(x, y, 277, 186);
        this.grid = grid;
        this.left = new ClickableThing(this.x - this.width / 2, this.y + 90, 90, 100, 'dpad_left');
        this.down = new ClickableThing(this.x - this.width / 2 + 90, this.y + 90, 90, 100, 'dpad_down');
        this.right = new ClickableThing(this.x - this.width / 2 + 180, this.y + 90, 97, 100, 'dpad_right');
        this.up = new ClickableThing(this.x - this.width / 2 + 90, this.y, 100, 100, 'dpad_up');
        this.left.delay = 10.0; this.down.delay = 10.0; this.right.delay = 10.0; this.up.delay = 10.0;
    }

    update(ratio, keyboard, mouse) {
        if (keyboard.left && this.left.cooldown == 0.0) {
            this.leftPressed(this);
            this.left.cooldown = 10.0;
        } else if (keyboard.down && this.down.cooldown == 0.0) {
            this.downPressed(this);
            this.down.cooldown = 10.0;
        } else if (keyboard.right && this.right.cooldown == 0.0) {
            this.rightPressed(this);
            this.right.cooldown = 10.0;
        } else if (keyboard.up && this.up.cooldown == 0.0) {
            this.upPressed(this);
            this.up.cooldown = 10.0;
        }
        this.left.update(ratio, keyboard, mouse, this.leftPressed, this);
        this.down.update(ratio, keyboard, mouse, this.downPressed, this);
        this.right.update(ratio, keyboard, mouse, this.rightPressed, this);
        this.up.update(ratio, keyboard, mouse, this.upPressed, this);
    }

    draw(ctx, drawSprite) {
        this.left.draw(ctx, drawSprite);
        this.down.draw(ctx, drawSprite);
        this.right.draw(ctx, drawSprite);
        this.up.draw(ctx, drawSprite);
    }

    leftPressed(self) {
        self.grid.moveMouseLeft();
    }

    downPressed(self) {
        self.grid.moveMouseDown();
    }

    rightPressed(self) {
        self.grid.moveMouseRight();
    }

    upPressed(self) {
        self.grid.moveMouseUp();
    }
}