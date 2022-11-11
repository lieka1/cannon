// basic cannon will distory itself after 100 shots
import { Bullet } from "../base/bullet";
import { CannonBase, CannonDefine } from "../base/cannon";
import Enemy from "../base/Enemy";
import { BasicBullet } from "../bullet/BasicBullet";

const BasicCannonDefine: CannonDefine = {
    levelDefine: [{ damage: 1, attackSpeed: 500, attackRange: 500 }],
    name: "basic",
    texture: { name: "cannon_base", frame: 0 },
    shotAnim: "canon_base_anim",
    price: 1,
};

export class BasicCannon extends CannonBase {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, BasicCannonDefine);
    }

    buildBullet(enemy: Enemy): Bullet {
        return new BasicBullet(this.scene, enemy, this, this.x, this.y);
    }
}
