import { Game } from "phaser";
import Main from "./game";

interface Window {
    sizeChanged: () => void;
    game: Phaser.Game;
}

var STATIC: Window = {} as any;

window.onload = () => {
    let i = document.getElementById("loading");
    if (i) i.remove();

    STATIC.game = new Game({
        type: Phaser.AUTO,
        title: "loose cannon",
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: "#304858",
        physics: {
            default: "arcade",
            arcade: {
                debug: true,
            },
        },
        scene: [Main],
    });
};

const sizeChanged = () => {
    if (STATIC.game.isBooted) {
        setTimeout(() => {
            STATIC.game.scale.resize(window.innerWidth, window.innerHeight);
            STATIC.game.canvas.setAttribute(
                "style",
                `display: block; width: ${window.innerWidth}px; height: ${window.innerHeight}px;`
            );
        }, 100);
    }
};

window.onresize = () => sizeChanged();
