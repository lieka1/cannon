import { Scene } from "phaser";
import Enemy, { EnemyDefine } from "./base/Enemy";
import { EnemyPortal } from "./Portal";

const BigDemonDefine: EnemyDefine = {
    name: "bigDemon",
    idle_anim: "big_demon_idle",
    run_anim: "big_demon_run",
    size: { width: 10, height: 30 },
};

export class BigDemon extends Enemy {

    constructor(
        scene: Phaser.Scene,
        map: Phaser.Tilemaps.TilemapLayer,
        portal: EnemyPortal
    ) {
        super(scene, portal.x, portal.y, BigDemonDefine);

        this.body.velocity.set(100, 100);
    
        scene.physics.add.collider(this, map);
    }
}
