// basic cannon will distory itself after 100 shots
import { CannonBase, CannonDefine } from "./base/cannon";

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
}
