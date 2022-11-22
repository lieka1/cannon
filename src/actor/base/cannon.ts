import { Physics } from "phaser";
import { BulletManager } from "../../manager/BulletManager";
import { Ui } from "../../ui";
import { BasicCannonBarrel } from "../barrel/BasicBarrel";
import { MenuBuildingInfo } from "../ui/extends/MenuBuildingInfo";
import { MenuImageButton } from "../ui/MenuImageButton";
import { MenuText } from "../ui/MenuText";
import { MenuWindow } from "../ui/MenuWindow";
import { Actor } from "./actor";
import { CannonBarrel } from "./barrel";
import { Building } from "./building";
import { Bullet } from "./bullet";
import Enemy from "./Enemy";

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
            () => {
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

        if (this.parent.barrel === undefined) {
            addTxt = new MenuText(scene, 0, lastItemHeight, "select upgrade");
            // add update info
            this.menuWindow.addItem(addTxt);

            lastItemHeight += addTxt.height;

            let newBtn = new MenuImageButton(
                scene,
                () => {
                    this.parent.upgradeBarrel(
                        new BasicCannonBarrel(scene.mainScene, this.parent)
                    );
                    
                    this.onClose();
                },
                0,
                lastItemHeight + 64 / 2,
                32,
                32,
                "cannon_basic_barrel"
            );

            this.menuWindow.addItem(newBtn);
        }
    }

    private getLastItem() {
        this.menuWindow.items[this.menuWindow.items.length - 1];
    }

    destroy() {
        this.menuWindow.destroy();
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
        return new CannonBaseMenu(scene, this);
    }
}
