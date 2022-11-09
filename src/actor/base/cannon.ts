import { Physics } from "phaser";
import { Actor } from "./actor";

export interface CannonLevel {
    damage: number; // single shot damage
    attackSpeed: number; // attack speed, attack in ms
}

export interface CannonDefine {
    levelDefine: CannonLevel[]; // cannon level
    name: string; // cannon name
    texture: string; // cannon static texture
    shotSprite: string; // shot bullet sprite
    shotAnim: string; // cannon shotting animation
    price: number; // buying price
    onShot: (enemy: Actor) => void; // on shot hit
}

export class CannonBase extends Physics.Arcade.Image {
    protected define: CannonDefine;
    protected level: number; // cannon level

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        define: CannonDefine
    ) {
        super(scene, x, y, define.texture);
        this.define = define;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.getBody().setCollideWorldBounds(true);
    }

    protected getBody(): Physics.Arcade.Body {
        return this.body as Physics.Arcade.Body;
    }

 
}
