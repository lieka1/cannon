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
    scale?: number;
    health?: number; // enemy health, default 100
    armor?: EnemyArmor; // enemy armor, default normal
}

export default class Enemy extends Physics.Arcade.Sprite {
    define: EnemyDefine;
    protected hp = 100;
    id: number;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        define: EnemyDefine
    ) {
        //@ts-ignore
        super(scene, x, y);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.getBody().setCollideWorldBounds(true);

        this.define = define;

        this.anims.play(define.idle_anim);

        this.body.setSize(define.size.width, define.size.height);
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
