import { Scene } from "phaser";
import Enemy, { EnemyDefine } from "../base/Enemy";
import { EnemyPortal } from "./Portal";

const OgreDefine: EnemyDefine = {
    name: "Ogre",
    idle_anim: "ogre_idle",
    run_anim: "ogre_run",
    size: { width: 10, height: 30 },
    speedRange: { base: 100, range: 30 },
    health: 1,
    gold: 10,
    damage: {
        attackSpeed: 500,
        attackDamage: 5,
    }};

export class Ogre extends Enemy {
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
            OgreDefine,
            target,
            targetPos,
            target1,
            targetPos1,
            targetIndex
        );
    }
}
