import { Physics } from "phaser";
import { BulletManager } from "../../manager/BulletManager";
import { Ui } from "../../ui";
import { MenuBuildingInfo } from "../ui/extends/MenuBuildingInfo";
import { MenuImageButton } from "../ui/MenuImageButton";
import { MenuText } from "../ui/MenuText";
import { MenuWindow } from "../ui/MenuWindow";
import { Actor } from "./actor";
import { Building } from "./building";
import { Bullet } from "./bullet";
import Enemy from "./Enemy";

export interface CannonLevel {
    damage: number; // single shot damage
    attackSpeed: number; // attack speed, attack in ms
    attackRange: number; // range of attacking
}

export interface CannonDefine {
    levelDefine: CannonLevel[]; // cannon level
    name: string; // cannon name
    texture: { name: string; frame?: number }; // cannon static texture
    shotAnim: string; // cannon shotting animation
    price: number; // buying price
}

class CannonBaseMenu extends MenuBuildingInfo {
    menuWindow: MenuWindow;
    parent: CannonBase;

    constructor(scene: Ui, selected: CannonBase) {
        super();

        this.parent = selected;
        // config widnow size
        let windowWidth = 800;
        let windowHeight = 600;

        let windowScale = scene.game.scale;

        if (windowScale.height < 800) {
            windowHeight = windowScale.height / 2;
        }

        if (windowScale.width < 1000) {
            windowWidth = windowScale.width / 2;
        }

        this.menuWindow = new MenuWindow(
            scene,
            0,
            0,
            windowWidth,
            windowHeight,
            () =>{
                this.onClose && this.onClose();
            }
        );

        let lastItemHeight = this.menuWindow.config.headerHeight;

        let addTxt = new MenuText(
            scene,
            0,
            lastItemHeight,
            `${this.parent.name}: `
        );
        // add name info
        this.menuWindow.addItem(addTxt);

        lastItemHeight += addTxt.height;

        addTxt = new MenuText(scene, 0, lastItemHeight, "select upgrade");
        // add update info
        this.menuWindow.addItem(addTxt);

        lastItemHeight += addTxt.height;

        new MenuImageButton(
            scene,
            () => {
                console.log("selected");
            },
            0,
            lastItemHeight + 64 / 2,
            32,
            32,
            "cannon_basic"
        );
    }

    private getLastItem() {
        this.menuWindow.items[this.menuWindow.items.length - 1];
    }

    destroy() {
        this.menuWindow.destroy();
    }
}

export class CannonBarrel extends Physics.Arcade.Sprite {
    protected define: CannonDefine;
    protected level: number = 0; // cannon level
    lastShot: number = 0; // last shot time
    target?: Enemy;

    constructor(scene: Phaser.Scene, parent: CannonBase, define: CannonDefine) {
        super(
            scene,
            parent.x,
            parent.y,
            define.texture.name,
            define.texture.frame
        );
    }

    setTarget(target: Enemy, time: number) {
        if (
            Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y) <
            this.getLevelDefine().attackRange
        ) {
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

            this.anims.play(this.define.shotAnim);

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
}

export class CannonBase extends Building {
    barrel?: CannonBarrel;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "cannon_base", {
            name: "cannon base",
        });

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setImmovable();

        this.getBody().velocity.limit(0);

        this.getBody().setCollideWorldBounds(true);

        this.setInteractive();

        // this.on("pointer")
    }

    protected getBody(): Physics.Arcade.Body {
        return this.body as Physics.Arcade.Body;
    }

    getBarrel() {
        return this.barrel;
    }

    upgradeBarrel(barrel: CannonBarrel) {
        this.barrel = barrel;
    }

    hide() {
        if (this.barrel) {
            this.barrel.setVisible(false);
        }
        this.setVisible(false);
    }

    show() {
        if (this.barrel) {
            this.barrel.setVisible(true);
        }
        this.setVisible(true);
    }

    getBuildingInfo(scene: Ui): MenuBuildingInfo {
        return new CannonBaseMenu(scene, this)
    }
}
