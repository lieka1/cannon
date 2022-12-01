import { Physics } from "phaser";
import { BuildingZindex } from "../../manager/BuildingManager";
import { CannonBarrel } from "./barrel";
import {  CannonBase } from "./cannon";
import Enemy from "./Enemy";

interface pos2d {
    x: number;
    y: number;
}

export interface BulletDefine {
    name: string;
    texture: string;
    size: number;
    mov_speed: number;
}

export interface BulletTarget {
    target: Enemy;
    targetPos: pos2d;
}

export class Bullet extends Physics.Arcade.Image {
    define: BulletDefine;
    enemy: BulletTarget;
    bId: number;
    fromCannon: CannonBarrel;

    constructor(
        scene: Phaser.Scene,
        enemy: Enemy,
        parent: CannonBarrel,
        x: number,
        y: number,
        define: BulletDefine
    ) {
        super(scene, x, y, define.texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setSize(define.size, define.size);

        this.fromCannon = parent;

        this.enemy = {
            target: enemy,
            targetPos: { x: enemy.x, y: enemy.y },
        };
        
        this.setDepth(BuildingZindex.topFloorItem)
    }

    setId(id: number) {
        this.bId = id;
    }

    // this function will be called when bullet hit
    hit(_: Enemy) {
        throw "update function should be override";
    }

    // this function indicate bullet can be removed
    finished(): boolean {
        throw "finished function should be override";
    }
}
