import { Scene } from "phaser";
import Enemy, { EnemyDefine } from "../base/Enemy";
import { EnemyPortal } from "./Portal";

const SwampyDefine: EnemyDefine = {
    name: "Swampy",
    idle_anim: "swampy_idle",
    run_anim: "swampy_run",
    size: { width: 10, height: 30 },
    speedRange: { base: 100, range: 30 },
    health: 5,
    gold: 5,
    damage: {
        attackSpeed: 500,
        attackDamage: 5,
    }};

export class Swampy extends Enemy {
    constructor(
        scene: Phaser.Scene,
        portal: EnemyPortal,
        target: Phaser.GameObjects.Rectangle,
        targetPos: { x: number; y: number },
        target1: Phaser.GameObjects.Rectangle,
        targetPos1: { x: number; y: number },
        targetIndex: number
    ) {
        super(
            scene,
            portal.x,
            portal.y,
            SwampyDefine,
            target,
            targetPos,
            target1,
            targetPos1,
            targetIndex
        );
    }
}
