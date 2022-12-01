import { Scene } from "phaser";
import Enemy, { EnemyArmor, EnemyDefine } from "../base/Enemy";
import { EnemyPortal } from "./Portal";

const MuddyDefine: EnemyDefine = {
    name: "Muddy",
    idle_anim: "muddy_idle",
    run_anim: "muddy_run",
    size: { width: 10, height: 30 },
    speedRange: { base: 100, range: 30 },
    health: 5,
    gold: 10,
    armor: EnemyArmor.less_on_fire,
    damage: {
        attackSpeed: 500,
        attackDamage: 5,
    }};

export class Muddy extends Enemy {
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
            MuddyDefine,
            target,
            targetPos,
            target1,
            targetPos1,
            targetIndex
        );
    }
}
