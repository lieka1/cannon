import { Scene } from "phaser";
import Enemy, { EnemyDefine } from "../base/Enemy";
import { EnemyPortal } from "./Portal";

const GoblinDefine: EnemyDefine = {
    name: "Goblin",
    idle_anim: "goblin_idle",
    run_anim: "goblin_run",
    size: { width: 10, height: 30 },
    speedRange: { base: 40, range: 20 },
    health: 100,
    gold: 100,
    damage: {
        attackSpeed: 500,
        attackDamage: 5,
    }};

export class Goblin extends Enemy {
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
            GoblinDefine,
            target,
            targetPos,
            target1,
            targetPos1,
            targetIndex
        );
    }
}
