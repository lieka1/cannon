import { Physics } from "phaser";
import { Actor } from "./actor";
import Enemy from "./Enemy";

export interface CannonLevel {
    damage: number; // single shot damage
    attackSpeed: number; // attack speed, attack in ms
    attackRange: number;
}

export interface CannonDefine {
    levelDefine: CannonLevel[]; // cannon level
    name: string; // cannon name
    texture: {name: string, frame?: number}; // cannon static texture
    shotAnim: string; // cannon shotting animation
    price: number; // buying price
}

export class CannonBase extends Physics.Arcade.Sprite {
    protected define: CannonDefine;
    protected level: number; // cannon level

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        define: CannonDefine
    ) {
        super(scene, x, y, define.texture.name, define.texture.frame);
        this.define = define;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.setImmovable();

        this.getBody().velocity.limit(0);

        this.getBody().setCollideWorldBounds(true);
    }

    protected getBody(): Physics.Arcade.Body {
        return this.body as Physics.Arcade.Body;
    }

    shot(target: Enemy) {
    }

}
