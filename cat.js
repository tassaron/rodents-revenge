import { AnimatedThing, Thing } from "./thing.js";

export class Cat extends Thing {
    constructor(i, x, y) {
        super(x, y, 38, 38);
        this.i = i;
        this.states = {
            "idle": new IdleCat(this),
            "sitting": new SittingCat(this),
            "sat": new SatCat(this),
            "walking": new WalkingCat(this),
            "cheese": new Cheese(this)
        }
        this.state = "idle";
        this.prevState = "walking";
        this.cooldown = 0.0;
        this.startingWalk = 0;
        this.facing = 1;
    }

    update(ratio, keyboard, mouse) {
        this.states[this.state].update(ratio, keyboard, mouse);
        if (this.state == "cheese") {return}
        if (this.state == "idle" && this.prevState != "idle") {
            if (this.cooldown == 0.0) {
                this.cooldown = 120.0;
            } else {
                this.cooldown -= ratio;
            }
            if (this.cooldown <= 0.0) {
                this.prevState = "idle";
            }
        } else if (this.state != "idle") {
            this.prevState = this.state;
        }

        if (this.state == "sat") {
            if (this.cooldown > 0.0) {
                this.cooldown -= ratio;
            } else {
                this.state = "cheese";
            }
        }

        if (this.state == "sitting" && this.states["sitting"].loops > 0) {
            this.state = "sat";
            this.cooldown = 90.0 + ratio;
            this.states[this.state].update(ratio, keyboard, mouse);
        }
    }

    draw(ctx, drawSprite) {
        drawSprite.planks(this.x, this.y);
        this.states[this.state].draw(ctx, drawSprite);
    }
}

class AnimatedState extends AnimatedThing {
    constructor(cat, src, frames, timing) {
        super(cat.x, cat.y, 38, 38, src, frames, timing);
        this.cat = cat;
    }

    update(ratio, keyboard, mouse) {
        this.x = this.cat.x;
        this.y = this.cat.y;
        super.update(ratio, keyboard, mouse);
    }
}

class IdleCat extends AnimatedState {
    constructor(cat) {
        super(cat, "cat_idle_r", 2, 50);
    }

    update(ratio, keyboard, mouse) {
        if (this.cat.facing == 1) {
            this.src = "cat_idle_r";
        } else {
            this.src = "cat_idle";
        }
        super.update(ratio, keyboard, mouse);
    }
}

class SittingCat extends AnimatedState {
    constructor(cat) {
        super(cat, "cat_sit", 2, 50);
    }
}

class WalkingCat extends AnimatedState {
    constructor(cat) {
        super(cat, "cat_walk_r", 6, 10);
    }

    update(ratio, keyboard, mouse) {
        if (this.cat.facing == 1) {
            this.src = "cat_walk_r";
        } else {
            this.src = "cat_walk";
        }
        super.update(ratio, keyboard, mouse);
    }
}


class SatCat extends Thing {
    constructor(cat) {
        super(cat.x, cat.y, 38, 38, "cat_sit");
        this.cat = cat;
    }

    draw(ctx, drawSprite) {
        drawSprite.cat_sit(2, this.x, this.y);
    }

    update(ratio, keyboard, mouse) {
        this.x = this.cat.x;
        this.y = this.cat.y;
        super.update(ratio, keyboard, mouse);
    }
}

class Cheese extends Thing {
    constructor(cat) {
        super(cat.x, cat.y, 38, 38, "cheese");
        this.cat = cat;
    }

    update(ratio, keyboard, mouse) {
        this.x = this.cat.x;
        this.y = this.cat.y;
    }
}