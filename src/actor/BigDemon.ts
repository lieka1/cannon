import { Scene } from "phaser";
import Enemy, { EnemyDefine } from "./base/Enemy";
import { EnemyPortal } from "./Portal";

const BigDemonDefine: EnemyDefine = {
    name: "bigDemon",
    idle_anim: "big_demon_idle",
    run_anim: "big_demon_run",
    size: { width: 10, height: 30 },
    speedRange: { base: 100, range: 30 },
};

export class BigDemon extends Enemy {
    constructor(
        scene: Phaser.Scene,
        map: Phaser.Tilemaps.TilemapLayer,
        portal: EnemyPortal,
        target: Phaser.GameObjects.Rectangle,
        targetPos: { x: number; y: number },
        target1: Phaser.GameObjects.Rectangle,
        targetPos1: { x: number; y: number }
    ) {
        super(
            scene,
            map,
            portal.x,
            portal.y,
            BigDemonDefine,
            target,
            targetPos,
            target1,
            targetPos1
        );
    }
}
