import { Physics } from "phaser";
import { BulletManager } from "../../manager/BulletManager";
import { Actor } from "./actor";
import { Bullet } from "./bullet";
import Enemy from "./Enemy";

export interface CannonLevel {
    damage: number; // single shot damage
    attackSpeed: number; // attack speed, attack in ms
    attackRange: number; // range of attacking
}

export interface CannonDefine {
    levelDefine: CannonLevel[]; // cannon level
    name: string; // cannon name
    texture: { name: string; frame?: number }; // cannon static texture
    shotAnim: string; // cannon shotting animation
    price: number; // buying price
}

export class CannonBase extends Physics.Arcade.Sprite {
    protected define: CannonDefine;
    protected level: number = 0; // cannon level
    lastShot: number = 0; // last shot time
    target?: Enemy;

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

    hasTarget(): boolean {
        if (this.target) {
            return this.target.hp > 0;
        }
        return false;
    }

    startShoot(target: Enemy) {
        this.target = target;
    }

    getLevelDefine() {
        return this.define.levelDefine[this.level];
    }

    setTarget(target: Enemy, time: number) {
        if (
            Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y) <
            this.getLevelDefine().attackRange
        ) {
            this.target = target;
            this.lastShot = time;
        }
    }

    buildBullet(enemy: Enemy): Bullet {
        // virtual function
        throw "build bullet should be override"
    }

    shot(time: number, m: BulletManager) {
        if (
            time - this.lastShot >
            this.getLevelDefine().attackSpeed
        ) {
            m.addNew(this.buildBullet(this.target));

            this.lastShot = time;
        }
    }
}
