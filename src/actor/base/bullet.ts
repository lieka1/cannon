import { Physics } from "phaser";
import { CannonBase } from "./cannon";
import Enemy from "./Enemy";

interface pos2d {
    x: number;
    y: number;
}

export interface BulletDefine {
    name: string;
    texture: string;
    mov_speed: number;
}

export interface BulletTarget {
    target: Enemy;
    targetPos: pos2d;
}

export class Bullet extends Physics.Arcade.Image {
    define: BulletDefine;
    enemy: BulletTarget;
    id: number;
    parent: CannonBase;

    constructor(
        scene: Phaser.Scene,
        enemy: Enemy,
        parent: CannonBase,
        x: number,
        y: number,
        define: BulletDefine
    ) {
        super(scene, x, y, define.texture);

        scene.physics.add.existing(this);

        this.parent = parent;
        this.enemy = {
            target: enemy,
            targetPos: { x: enemy.x, y: enemy.y },
        };
    }

    setId(id: number) {
        this.id = id;
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
