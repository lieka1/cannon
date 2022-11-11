import { Physics } from "phaser";
import { EnemyManager } from "../../manager/EnemyManager";
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
    health: number; // enemy health, default 100
    armor?: EnemyArmor; // enemy armor, default normal
}

export default class Enemy extends Physics.Arcade.Sprite {
    define: EnemyDefine;
    hp: number;
    speed: number;
    id: number;
    
    target: Phaser.GameObjects.Rectangle; // target gate
    targetPos: { x: number; y: number }; // target gate pos

    target1: Phaser.GameObjects.Rectangle; // target gate
    targetPos1: { x: number; y: number }; // target gate pos
    frontArrived: boolean = false; // arrive the front

    colliding: boolean = false;
    arrived: boolean = false; // object get to the target
    colliders: Physics.Arcade.Collider[] = [];

    constructor(
        scene: Phaser.Scene,
        map: Phaser.Tilemaps.TilemapLayer,
        x: number,
        y: number,
        define: EnemyDefine,
        target: Phaser.GameObjects.Rectangle,
        targetPos: { x: number; y: number },
        target1: Phaser.GameObjects.Rectangle,
        targetPos1: { x: number; y: number }
    ) {
        //@ts-ignore
        super(scene, x, y);

        // add item
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.getBody().setCollideWorldBounds(true);

        // init feild
        this.define = define;
        this.target = target;
        this.targetPos = targetPos;
        this.target1 = target1;
        this.targetPos1 = targetPos1;
        this.speed =
            define.speedRange.base + define.speedRange.range * Math.random();
        this.hp = define.health;

        // animation
        this.anims.play(define.run_anim);

        // init physics
        this.body.setSize(define.size.width / 4, define.size.height / 4);
        this.setBounce(0);
        // init hit body
        this

        this.colliders.push(
            scene.physics.add.overlap(this, target, (e: Enemy, _: any) => {
                e.colliders.forEach((e) => {
                    this.scene.physics.world.removeCollider(e);
                });

                delete e.colliders;

                e.arrived = true;
                e.play(e.define.idle_anim);
                e.setImmovable();
                e.setVelocity(0);
            })
        );

        this.colliders.push(
            scene.physics.add.overlap(this, target1, (e: Enemy, _: any) => {
                this.frontArrived = true;
            })
        );

        // this.colliders.push(
        //     scene.physics.add.collider(this, map, (e: Enemy, _) => {
        //         if (e.body.velocity.x == 0) {
        //             e.body.velocity.y =
        //                 (e.body.velocity.y > 0 ? 1 : -1) * e.speed;
        //         }
        //         if (e.body.velocity.y == 0) {
        //             e.body.velocity.x =
        //                 (e.body.velocity.x > 0 ? 1 : -1) * e.speed;
        //         }

        //         e.colliding = true;
        //     })
        // );
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

    checkArrive() {
        if (this.arrived) {
            return;
        }
        if (this.frontArrived) {
            if (!this.colliding) {
                this.scene.physics.moveTo(
                    this,
                    this.targetPos.x,
                    this.targetPos.y,
                    this.speed
                );
            } else {
                this.colliding = false;
            }
        } else {
            if (!this.colliding) {
                this.scene.physics.moveTo(
                    this,
                    this.targetPos1.x,
                    this.targetPos1.y,
                    this.speed
                );
            } else {
                this.colliding = false;
            }
        }
    }

    checkDead(): boolean {
        if (this.hp <= 0) {
            this.destroy();
            return true;
        }

        return false;
    }

    setId(id: number) {
        this.id = id;
    }

    addCollider(enemys: EnemyManager) {
        enemys.data.forEach((e) => {
            this.colliders.push(enemys.scene.physics.add.collider(this, e));
        });
    }
}
