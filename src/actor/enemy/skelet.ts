import { Scene } from "phaser";
import Enemy, { EnemyDefine } from "../base/Enemy";
import { EnemyPortal } from "./Portal";

const SkeletDefine: EnemyDefine = {
    name: "Skelet",
    idle_anim: "skelet_idle",
    run_anim: "skelet_run",
    size: { width: 10, height: 30 },
    speedRange: { base: 100, range: 30 },
    health: 1,
};

export class Skelet extends Enemy {
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
            SkeletDefine,
            target,
            targetPos,
            target1,
            targetPos1
        );
    }
}