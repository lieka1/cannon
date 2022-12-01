import { Scene } from "phaser";
import Enemy, { EnemyDefine } from "../base/Enemy";
import { EnemyPortal } from "./Portal";

const TinyZomieDefine: EnemyDefine = {
    name: "TinyZomie",
    idle_anim: "tiny_zombie_idle",
    run_anim: "tiny_zombie_run",
    size: { width: 5, height: 5 },
    speedRange: { base: 50, range: 10 },
    health: 1,
    gold: 1,
    damage: {
        attackSpeed: 2000,
        attackDamage: 1,
    }};

export class TinyZomie extends Enemy {
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
            TinyZomieDefine,
            target,
            targetPos,
            target1,
            targetPos1,
            targetIndex
        );
    }
}
