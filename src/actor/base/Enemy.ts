import { Physics } from "phaser";
import { Actor } from "./actor";

export enum EnemyArmor {
    normal, // normal armor
}

export interface EnemyDefine {
    name: string;
    idle_anim: string;
    run_anim: string;
    size: { width: number; height: number };
    speedRange: { base: number; range: number }; // movement speed range
    scale?: number;
    health?: number; // enemy health, default 100
    armor?: EnemyArmor; // enemy armor, default normal
}

export default class Enemy extends Physics.Arcade.Sprite {
    define: EnemyDefine;
    protected hp = 100;
    speed: number;
    id: number;
    target: Phaser.GameObjects.Rectangle;
    targetPos: { x: number; y: number };
    colliding: boolean = false;
    arrived: boolean = false; // object get to the target
    collider: Physics.Arcade.Collider;

    constructor(
        scene: Phaser.Scene,
        map: Phaser.Tilemaps.TilemapLayer,
        x: number,
        y: number,
        define: EnemyDefine,
        target: Phaser.GameObjects.Rectangle,
        targetPos: { x: number; y: number }
    ) {
        //@ts-ignore
        super(scene, x, y);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.getBody().setCollideWorldBounds(true);

        this.define = define;

        this.anims.play(define.run_anim);

        this.body.setSize(define.size.width, define.size.height);

        this.target = target;

        this.speed =
            define.speedRange.base + define.speedRange.range * Math.random();

        this.targetPos = targetPos;
        this.body.bounce.limit(0);

        this.collider = scene.physics.add.collider(this, map, (e: Enemy, _) => {
            if (this.arrived) {
                e.scene.physics.world.removeCollider(e.collider);
                e.body.velocity.limit(0);

                return;
            }

            // add speed to item if item is slowing down
            if (e.y - e.target.y < e.speed + 10) {
                this.arrived = true;

                e.body.immovable = true;

                this.scene.physics.moveTo(
                    e,
                    e.targetPos.x,
                    e.targetPos.y,
                    e.speed
                );

                return;
            }

            if (e.body.velocity.x == 0) {
                e.body.velocity.y = e.speed;
            }
            if (e.body.velocity.y == 0) {
                e.body.velocity.x = e.speed;
            }

            e.colliding = true;
        });
    }

    public getDamage(value?: number): void {
        this.scene.tweens.add({
            targets: this,
            duration: 100,
            repeat: 3,
            yoyo: true,
            alpha: 0.5,
            onStart: () => {
                if (value) {
                    this.hp = this.hp - value;
                }
            },
            onComplete: () => {
                this.setAlpha(1);
            },
        });
    }

    public getHPValue(): number {
        return this.hp;
    }

    protected checkFlip(): void {
        if (this.body.velocity.x < 0) {
            this.scaleX = -1;
        } else {
            this.scaleX = 1;
        }
    }

    protected getBody(): Physics.Arcade.Body {
        return this.body as Physics.Arcade.Body;
    }

    setId(id: number) {
        this.id = id;
    }
}
