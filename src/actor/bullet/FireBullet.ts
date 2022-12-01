import { CannonBarrel } from "../base/barrel";
import { Bullet, BulletDefine } from "../base/bullet";
import Enemy from "../base/Enemy";
import { BasicCannonBarrel } from "../barrel/BasicBarrel";

const BasicBulletDefine: BulletDefine = {
    name: "fire bullet",
    texture: "fire_bullet",
    size: 30,
    mov_speed: 300,
};

export class BasicBullet extends Bullet {
    constructor(
        scene: Phaser.Scene,
        target: Enemy,
        parent: CannonBarrel,
        x: number,
        y: number,
        scale: number = 1,
    ) {
        super(scene, target, parent, x, y, BasicBulletDefine);

        this.setScale(scale);

        scene.physics.moveTo(
            this,
            target.x,
            target.y,
            BasicBulletDefine.mov_speed
        );
    }

    getParent(): BasicCannonBarrel {
        return this.fromCannon;
    }

    hit(enemy: Enemy): void {
        enemy.hp -= this.getParent().getLevelDefine().damage;
    }

    finished(): boolean {
        return this.y > this.enemy.targetPos.y;
    }
}
