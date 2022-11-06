import {Game} from "phaser";
import Main from './game'
import LoadingScene from "./scenes/loading";

interface Window {
  sizeChanged: () => void;
  game: Phaser.Game;
}

var STATIC: Window = {} as any;

window.onload = () => {
  STATIC.game = new Game({
    type: Phaser.AUTO,
    title: "loose cannon",
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#304858',
    physics: {
      default: 'arcade',
      arcade: {
        debug: false,
      },
    },
    scene: [ LoadingScene, Main ]
  });
};


const sizeChanged = () => {
  if (STATIC.game.isBooted) {
    setTimeout(() => {
      STATIC.game.scale.resize(window.innerWidth, window.innerHeight);
      STATIC.game.canvas.setAttribute(
        'style',
        `display: block; width: ${window.innerWidth}px; height: ${window.innerHeight}px;`,
      );
    }, 100);
  }
};

window.onresize = () => sizeChanged();