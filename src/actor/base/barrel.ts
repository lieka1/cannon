import { Physics, Scene } from "phaser";
import Main from "../../game";
import { BulletManager } from "../../manager/BulletManager";
import { Ui } from "../../ui";
import { MenuWindow } from "../ui/MenuWindow";
import { MenuBuildingInfo } from "./building";
import { Bullet } from "./bullet";
import { CannonBase } from "./cannon";
import Enemy from "./Enemy";

export interface CannonUpdateRequire {
    golds: number;
    builder?: (scene: Scene, parent: CannonBase) => CannonBarrel;
}

export interface CannonLevel {
    damage: number; // single shot damage
    attackSpeed: number; // attack speed, attack in ms
    attackRange: number; // range of attacking
    upgrade?: CannonUpdateRequire;
}

export interface CannonDefine {
    levelDefine: CannonLevel[]; // cannon level
    name: string; // cannon name
    texture: { name: string; frame?: number | string }; // cannon static texture
    shotAnim: string; // cannon shotting animation
    price: number; // buying price
}

export function formatBarrelStatus(b: CannonBarrel) {
    return `
    --- ${b.define.name} ---

    Level: ${b.level}
    Attack Speed: ${b.getLevelDefine().attackSpeed}
    Attack Range: ${b.getLevelDefine().attackRange}
    Attack Damage: ${b.getLevelDefine().damage}
    Golds to Upgrade: ${b.getLevelDefine().upgrade.golds}
    `;
}

export class CannonBarrel extends Physics.Arcade.Sprite {
    define: CannonDefine;
    level: number = 0; // cannon level
    lastShot: number = 0; // last shot time
    target?: Enemy;
    targetAngle: number;
    parent: CannonBase;

    constructor(scene: Phaser.Scene, parent: CannonBase, define: CannonDefine) {
        super(
            scene,
            parent.x,
            parent.y,
            define.texture.name,
            define.texture.frame
        );

        scene.add.existing(this);

        this.setOrigin(0.5, 0.4);

        this.define = define;
        this.parent = parent;
    }

    tryUpdate(): boolean {
        let s = this.scene as Main;

        if (!this.canUpdate()) {
            return false;
        }

        if (s.gold.use(this.getLevelDefine().upgrade.golds)) {
            if (this.getLevelDefine().upgrade.builder) {
                this.parent.upgradeBarrel(
                    this.getLevelDefine().upgrade.builder(
                        this.scene,
                        this.parent
                    )
                );
            } else {
                this.level += 1;
            }

            return true;
        }

        return false;
    }

    canUpdate() {
        if (
            this.level < this.define.levelDefine.length &&
            this.getLevelDefine().upgrade
        ) {
            return true;
        }
        return false;
    }

    setTarget(target: Enemy, time: number) {
        if (
            Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y) <
            this.getLevelDefine().attackRange
        ) {
            this.targetAngle = Phaser.Math.Angle.Between(
                this.x,
                this.y,
                target.x,
                target.y
            );
            this.target = target;
            this.lastShot = time;
        }
    }

    getLevelDefine() {
        return this.define.levelDefine[this.level];
    }

    shot(time: number, m: BulletManager) {
        if (time - this.lastShot > this.getLevelDefine().attackSpeed) {
            m.addNew(this.buildBullet(this.target));

            this.anims.play({
                key: this.define.shotAnim,
                yoyo: true,
            });

            this.setOrigin(0.5, 0.4);

            this.lastShot = time;
        }
    }

    buildBullet(enemy: Enemy): Bullet {
        // virtual function
        throw "build bullet should be override";
    }

    hasTarget(): boolean {
        if (this.target) {
            return this.target.hp > 0;
        }
        return false;
    }

    startShoot(target: Enemy) {
        this.target = target;
    }

    buildMenu(scene: Ui, menu: MenuBuildingInfo, startPos: number) {
        throw "CannonBarrel.buildMenu should be overload";
    }
}
