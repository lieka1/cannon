// basic cannon will distory itself after 100 shots
import { CannonBarrel, CannonDefine } from "../base/barrel";
import { Bullet } from "../base/bullet";
import { CannonBase } from "../base/cannon";
import Enemy from "../base/Enemy";
import { BasicBullet } from "../bullet/BasicBullet";

const BasicCannonDefine: CannonDefine = {
    levelDefine: [{ damage: 1, attackSpeed: 500, attackRange: 500 }],
    name: "basic",
    texture: { name: "cannon_basic_barrel", frame: 0 },
    shotAnim: "cannon_basic_shoot_anim",
    price: 1,
};

export class BasicCannonBarrel extends CannonBarrel {
    constructor(scene: Phaser.Scene, parent: CannonBase) {
        super(scene, parent, BasicCannonDefine);
    }

    buildBullet(enemy: Enemy): Bullet {
        return new BasicBullet(this.scene, enemy, this, this.x, this.y);
    }
}
