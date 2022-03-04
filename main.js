"use strict"
import { addEventListeners, keyboard, mouse } from "./ui.js";
import { Game } from "./game.js";
/*
*  Create the canvas
*/
const gamediv = document.getElementById("game");
const canvas = document.createElement("canvas");
gamediv.appendChild(canvas);
canvas.width = gamediv.offsetWidth; canvas.height = gamediv.offsetHeight;
const ctx = canvas.getContext("2d");
let game;

/*
*  Preload assets
*/
ctx.fillStyle = "#000";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.font = "3rem var(--arcade-font)";
ctx.fillStyle = "#fff";
ctx.fillText("loading", (canvas.width / 2) - (ctx.measureText("loading").width / 2), (canvas.height / 2) - (canvas.height / 6));
let preloaded = 0;

let sprites = {
    "cat": new Image(),
    "mouse": new Image(),
    "cheese": new Image(),
    "planks": new Image(),
    "crate": new Image(),
    "input": new Image()
}

const drawSprite = {
    "cat_idle": function(i, x, y) {ctx.drawImage(sprites.cat, 42 + (42 * i), 0, 38, 30, x, y + 4, 38, 30)},
    "cat_idle_r": function(i, x, y) {
        ctx.save()
        ctx.translate(x+38,y);
        ctx.scale(-1, 1);
        this.cat_idle(i, 0, 0);
        ctx.restore();
    },
    "cat_sit": function(i, x, y) {ctx.drawImage(sprites.cat, i == 0 ? 0 : 42 * 3, 0, 38, 30, x, y + 4, 38, 30)},
    "cat_walk": function(i, x, y, offset=4) {ctx.drawImage(sprites.cat, offset + (44 * i), 35, 44, 30, x, y + 4, 42, 30)},
    "cat_walk_r": function(i, x, y) {
            ctx.save()
            ctx.translate(x+42,y);
            ctx.scale(-1, 1);
            this.cat_walk(i, 0, 0, 0);
            ctx.restore();
        },
    "mouse": function(x, y) {ctx.drawImage(sprites.mouse, x, y)},
    "cheese": function(x, y) {ctx.drawImage(sprites.cheese, x, y)},
    "planks": function(x, y) {ctx.drawImage(sprites.planks, x, y)},
    "crate": function(x, y) {ctx.drawImage(sprites.crate, x, y)},
    "dpad_left": function(x, y) {ctx.drawImage(sprites.input, 0, 90, 90, 100, x, y, 90, 100)},
    "dpad_down": function(x, y) {ctx.drawImage(sprites.input, 90, 90, 90, 100, x, y, 90, 100)},
    "dpad_right": function(x, y) {ctx.drawImage(sprites.input, 180, 90, 97, 100, x, y, 97, 100)},
    "dpad_up": function(x, y) {ctx.drawImage(sprites.input, 90, 0, 100, 100, x, y, 100, 100)}
}

function preload_success() {
    preloaded += 1;
    if (preloaded == Object.keys(sprites).length) {
        addEventListeners(canvas);
        game = new Game(ctx);
        loop();
    }
}

let prefix = String(document.location).indexOf("://rainey.tech/");
if (prefix != -1 && prefix < 6) {
    // http://rainey.tech or https://rainey.tech
    prefix = "/static/client/rainey_arcade/js/rodents-revenge/assets/";
} else {
    prefix = "assets/";
}
sprites.cat.addEventListener("load", preload_success)
sprites.cat.src = prefix + "cat.png";
sprites.mouse.addEventListener("load", preload_success)
sprites.mouse.src = prefix + "mouse.png";
sprites.cheese.addEventListener("load", preload_success)
sprites.cheese.src = prefix + "cheese.png";
sprites.planks.addEventListener("load", preload_success)
sprites.planks.src = prefix + "planks.png";
sprites.crate.addEventListener("load", preload_success)
sprites.crate.src = prefix + "crate.png";
sprites.input.addEventListener("load", preload_success)
sprites.input.src = prefix + "input.png";


function pauseGame() {
    if (!game.game_over) {
        game.paused = !game.paused;
    }
}

function loop() {
    game.update(keyboard, mouse);
    game.draw(ctx, drawSprite);
    requestAnimationFrame(loop);
}
document.getElementById("pause_button").addEventListener('click', pauseGame, false);