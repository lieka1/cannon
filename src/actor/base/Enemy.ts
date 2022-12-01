import { Physics } from "phaser";
import Main from "../../game";
import { BuildingZindex } from "../../manager/BuildingManager";
import { EnemyManager } from "../../manager/EnemyManager";

export enum EnemyArmor {
    normal = 0, // normal armor
    more_on_fire = 1 << 0,
    less_on_fire = 1 << 1,
}

export interface EnemyDefine {
    name: string;
    idle_anim: string;
    run_anim: string;
    size: { width: number; height: number };
    speedRange: { base: number; range: number }; // movement speed range
    scale?: number;
    health: number; // enemy health
    armor?: EnemyArmor; // enemy armor, default normal
    gold: number; // killed golds
    damage: { attackSpeed: number; attackDamage: number };
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

    moveingCollider: Physics.Arcade.Collider[] = [];

    reachTargetTime?: number;
    targetGate: number;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        define: EnemyDefine,
        target: Phaser.GameObjects.Rectangle,
        targetPos: { x: number; y: number },
        target1: Phaser.GameObjects.Rectangle,
        targetPos1: { x: number; y: number },
        targetIndex: number
    ) {
        //@ts-ignore
        super(scene, x, y);

        this.targetGate = targetIndex;

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

        this.moveingCollider.push(
            scene.physics.add.overlap(this, target, (e: Enemy, _: any) => {
                e.moveingCollider.forEach((e) => {
                    this.scene.physics.world.removeCollider(e);
                });

                delete e.moveingCollider;

                e.arrived = true;
                e.play(e.define.idle_anim);
                e.setImmovable();
                e.setVelocity(0);

                this.reachTargetTime = Date.now();
            })
        );

        this.moveingCollider.push(
            scene.physics.add.overlap(this, target1, (e: Enemy, _: any) => {
                e.frontArrived = true;
            })
        );

        this.setDepth(BuildingZindex.BuildingMax);
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
        enemys.enemys.forEach((e) => {
            if (e)
                this.colliders.push(enemys.scene.physics.add.collider(this, e));
        });
    }

    dealDamage() {
        if (this.reachTargetTime !== undefined) {
            let s = this.scene as Main;

            let damageTimes =
                (Date.now() - this.reachTargetTime) /
                this.define.damage.attackSpeed;

            s.Gates.dealGateDamage(
                this.targetGate,
                damageTimes * this.define.damage.attackDamage
            );

            this.reachTargetTime += this.define.damage.attackSpeed * damageTimes;
        }
    }

    removeCollider(scene: Phaser.Scene) {
        this.colliders.forEach((e) => {
            scene.physics.world.removeCollider(e);
        });
    }

    update() {
        this.checkFlip();
    }
}
