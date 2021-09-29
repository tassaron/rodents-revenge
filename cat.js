import { AnimatedThing, Thing } from "./thing.js";

export class Cat extends Thing {
    constructor(x, y) {
        super(x, y, 38, 38);
        this.states = {
            "idle": new IdleCat(x, y),
            "sitting": new SittingCat(x, y),
            "sat": new SatCat(x, y),
            "walking": new WalkingCat(x, y)
        }
        this.state = "idle";
    }

    update(ratio, keyboard, mouse) {
        this.states[this.state].update(ratio, keyboard, mouse);
        if (mouse.leftClick && this.collides(mouse)) {
            this.state = "sitting";
        }
        if (this.state == "sitting" && this.states["sitting"].loops > 0) {
            this.state = "sat";
        }
    }

    draw(ctx, drawSprite) {
        this.states[this.state].draw(ctx, drawSprite);
    }
}

class IdleCat extends AnimatedThing {
    constructor(x, y) {
        super(x, y, 38, 38, "cat_idle", 2, 50);
    }
}

class SittingCat extends AnimatedThing {
    constructor(x, y) {
        super(x, y, 38, 38, "cat_sit", 2, 50);
    }
}

class SatCat extends Thing {
    constructor(x, y) {
        super(x, y, 38, 38, "cat_sit");
    }

    draw(ctx, drawSprite) {
        drawSprite.cat_sit(2, this.x, this.y);
    }
}

class WalkingCat extends AnimatedThing {
    constructor(x, y) {
        super(x, y, 38, 38, "cat_walk", 6, 10);
    }
}