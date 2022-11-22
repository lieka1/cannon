import { Physics } from "phaser";
import { BulletManager } from "../../manager/BulletManager";
import { Bullet } from "./bullet";
import { CannonBase } from "./cannon";
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

export class CannonBarrel extends Physics.Arcade.Sprite {
    protected define: CannonDefine;
    protected level: number = 0; // cannon level
    lastShot: number = 0; // last shot time
    target?: Enemy;
    targetAngle: number;

    constructor(scene: Phaser.Scene, parent: CannonBase, define: CannonDefine) {
        super(
            scene,
            parent.x,
            parent.y,
            define.texture.name,
            define.texture.frame
        );

        scene.add.existing(this);

        this.setOrigin(0.5, 0.4);

        this.define = define;
    }

    setTarget(target: Enemy, time: number) {

        if (
            Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y) <
            this.getLevelDefine().attackRange
        ) {
            this.targetAngle = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y)
            this.target = target;
            this.lastShot = time;
        }
    }

    getLevelDefine() {
        return this.define.levelDefine[this.level];
    }

    shot(time: number, m: BulletManager) {
        if (time - this.lastShot > this.getLevelDefine().attackSpeed) {
            m.addNew(this.buildBullet(this.target));

            this.anims.play(this.define.shotAnim);

            this.setOrigin(0.5, 0.4);

            this.lastShot = time;
        }
    }

    buildBullet(enemy: Enemy): Bullet {
        // virtual function
        throw "build bullet should be override";
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
}