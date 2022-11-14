import { Bullet, BulletDefine } from "../base/bullet";
import Enemy from "../base/Enemy";
import { BasicCannon } from "../cannon/BasicCannon";

const BasicBulletDefine: BulletDefine = {
    name: "basic bullet",
    texture: "basic_bullet",
    mov_speed: 300,
};

export class BasicBullet extends Bullet {
    constructor(
        scene: Phaser.Scene,
        target: Enemy,
        parent: BasicCannon,
        x: number,
        y: number
    ) {
        super(scene, target, parent, x, y, BasicBulletDefine);

        scene.physics.moveTo(
            this,
            target.x,
            target.y,
            BasicBulletDefine.mov_speed
        );
    }

    getParent(): BasicCannon {
        return this.fromCannon;
    }

    hit(enemy: Enemy): void {
        enemy.hp -= this.getParent().getLevelDefine().damage;
    }

    finished(): boolean {
        if (this.y > 1000) {
            console.log(this);
        }

        return this.y > this.enemy.targetPos.y;
    }
}