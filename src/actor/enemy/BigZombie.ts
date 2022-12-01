import { Scene } from "phaser";
import Enemy, { EnemyDefine } from "../base/Enemy";
import { EnemyPortal } from "./Portal";

const BigZombieDefine: EnemyDefine = {
    name: "bigDemon",
    idle_anim: "big_zombie_idle",
    run_anim: "big_zombie_run",
    size: { width: 10, height: 30 },
    speedRange: { base: 100, range: 30 },
    health: 1000,
    gold: 100,
    damage: {
        attackSpeed: 500,
        attackDamage: 5,
    }};

export class BigZombie extends Enemy {
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
            BigZombieDefine,
            target,
            targetPos,
            target1,
            targetPos1,
            targetIndex
            );
    }
}
