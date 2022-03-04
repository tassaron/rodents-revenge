import { ClickableThing } from "./thing.js";

export class Button extends ClickableThing {
    constructor(x, y, w, h, text, outline="#000", colour="#fff") {
        super(x, y, w, h);
        this.text = text;
        this.outline = outline;
        this.colour = colour;
    }

    draw(ctx, drawSprite) {
        ctx.fillStyle = this.outline;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.colour;
        ctx.fillRect(this.x + 2, this.y + 2, this.width - 4, this.height - 4);
        ctx.fillStyle = this.outline;
        ctx.font = "1rem var(--arcade-font)";
        ctx.fillText(this.text, this.x + ((this.width / 2) - (ctx.measureText(this.text).width / 2)), this.y + this.height / 2 + 8);
    }
}