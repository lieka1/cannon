import { Scene } from "phaser";
import Enemy, { EnemyDefine } from "../base/Enemy";
import { EnemyPortal } from "./Portal";

const ZombieDefine: EnemyDefine = {
    name: "Zombie",
    idle_anim: "zombie_idle",
    run_anim: "zombie_run",
    size: { width: 10, height: 30 },
    speedRange: { base: 100, range: 30 },
    health: 10,
    gold: 10,
    damage: {
        attackSpeed: 500,
        attackDamage: 5,
    },
};

export class Zombie extends Enemy {
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
            ZombieDefine,
            target,
            targetPos,
            target1,
            targetPos1,
            targetIndex
        );
    }
}
