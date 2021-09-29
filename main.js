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
ctx.font = "48pt Sans";
ctx.fillStyle = "#fff";
ctx.fillText("loading", (canvas.width / 2) - (ctx.measureText("loading").width / 2), (canvas.height / 2) - (canvas.height / 6));
let preloaded = 0;

let sprites = {
    "cat": new Image(),
    "mouse": new Image(),
    "planks": new Image(),
    "crate": new Image(),
    "input": new Image()
}

const drawSprite = {
    "cat_idle": function(i, x, y) {ctx.drawImage(sprites.cat, 42 + (42 * i), 0, 38, 30, x, y + 4, 38, 30)},
    "cat_sit": function(i, x, y) {ctx.drawImage(sprites.cat, i == 0 ? 0 : 42 * 3, 0, 38, 30, x, y + 4, 38, 30)},
    "cat_walk": function(i, x, y) {ctx.drawImage(sprites.cat, 44 * i, 35, 40, 30, x, y + 4, 40, 30)},
    "mouse": function(x, y) {ctx.drawImage(sprites.mouse, x, y)},
    "planks": function(x, y) {ctx.drawImage(sprites.planks, x, y)},
    "crate": function(x, y) {ctx.drawImage(sprites.crate, x, y)},
    "dpad_left": function(x, y) {ctx.drawImage(sprites.input, 0, 90, 90, 100, x, y, 90, 100)},
    "dpad_down": function(x, y) {ctx.drawImage(sprites.input, 90, 90, 90, 100, x, y, 90, 100)}
}

function preload_success() {
    preloaded += 1;
    if (preloaded == Object.keys(sprites).length) {
        addEventListeners(canvas);
        game = new Game(ctx);
        loop();
    }
}

sprites.cat.addEventListener("load", preload_success)
sprites.cat.src = "assets/cat.png";
sprites.mouse.addEventListener("load", preload_success)
sprites.mouse.src = "assets/mouse.png";
sprites.planks.addEventListener("load", preload_success)
sprites.planks.src = "assets/planks.png";
sprites.crate.addEventListener("load", preload_success)
sprites.crate.src = "assets/crate.png";
sprites.input.addEventListener("load", preload_success)
sprites.input.src = "assets/input.png";


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