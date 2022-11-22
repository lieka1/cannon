import { Scene } from "phaser";
import Enemy, { EnemyDefine } from "../base/Enemy";
import { EnemyPortal } from "./Portal";

const ChortDefine: EnemyDefine = {
    name: "Chort",
    idle_anim: "chort_idle",
    run_anim: "chort_run",
    size: { width: 10, height: 30 },
    speedRange: { base: 100, range: 30 },
    health: 1,
};

export class Chort extends Enemy {
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
            ChortDefine,
            target,
            targetPos,
            target1,
            targetPos1
        );
    }
}
