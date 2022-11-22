import { Scene } from "phaser";
import Enemy, { EnemyDefine } from "../base/Enemy";
import { EnemyPortal } from "./Portal";

const MaskedOrcDefine: EnemyDefine = {
    name: "MaskedOrc",
    idle_anim: "masked_orc_idle",
    run_anim: "masked_orc_run",
    size: { width: 10, height: 30 },
    speedRange: { base: 100, range: 30 },
    health: 1,
};

export class MaskedOrc extends Enemy {
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
            MaskedOrcDefine,
            target,
            targetPos,
            target1,
            targetPos1
        );
    }
}
