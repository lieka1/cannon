import { Scene } from "phaser";
import Enemy, { EnemyDefine } from "../base/Enemy";
import { EnemyPortal } from "./Portal";

const IceZombieDefine: EnemyDefine = {
    name: "IceZombie",
    idle_anim: "ice_zombie_idle",
    run_anim: "ice_zombie_run",
    size: { width: 10, height: 30 },
    speedRange: { base: 100, range: 30 },
    health: 1,
};

export class IceZombie extends Enemy {
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
            IceZombieDefine,
            target,
            targetPos,
            target1,
            targetPos1
        );
    }
}
