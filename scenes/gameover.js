import { MenuScene } from "./menu.js";

export class GameOverScene {
    constructor(game) {
        this.game = game;
        game.game_over = true;

        // If embedded on Rainey Arcade, integrate with the send_score_button
        const send_score_button = document.getElementById("send_score_button");
        if (send_score_button) {
            function sendScore(e) {
                send_score(
                    document.getElementById("game_title").dataset.filename,
                    game.score,
                    send_score_button.dataset.csrfToken,
                );
                e.currentTarget.setAttribute("style", "display: none;");
                e.stopPropagation();
                send_score_button.removeEventListener("click", this)
            }
            send_score_button.setAttribute("style", "z-index: 100; display: block; left: 50%; top: 50%; transform: translate(-50%);");
            send_score_button.addEventListener("click", sendScore);
        }
    }

    update(ratio, keyboard, mouse) {
        this.game.allowUserInput = false;
        this.game.prevScene.update(ratio, keyboard, mouse);
        this.game.allowUserInput = true;
        if (mouse.leftClick) {
            this.game.game_over = false;
            this.game.level = 1;
            this.game.score = 0;
            this.game.changeScene(new MenuScene(this.game));
        }
    }

    draw(ctx, drawSprite) {
        this.game.prevScene.draw(ctx, drawSprite);
        this.game.darkenCanvas(ctx);
        ctx.fillStyle = "#000";
        ctx.fillRect(ctx.canvas.width / 4, (ctx.canvas.height / 3) - ctx.canvas.height / 6, ctx.canvas.width / 2, ctx.canvas.height / 4);
        ctx.fillStyle = "#800000";
        ctx.fillRect((ctx.canvas.width / 4) + 2, ((ctx.canvas.height / 3) - ctx.canvas.height / 6) + 2, (ctx.canvas.width / 2) - 4, (ctx.canvas.height / 4) - 4);
        ctx.font = "36pt Sans";
        ctx.fillStyle = "#fff";
        ctx.fillText("Game Over", ctx.canvas.width / 2 - 132, ctx.canvas.height / 3 - 32);
        ctx.font = "16pt Sans";
        ctx.fillText("tap or click to restart", ctx.canvas.width / 2 - 92, ctx.canvas.height / 3 + 22);
    }
}