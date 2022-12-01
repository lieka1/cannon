import { Physics } from "phaser";
import { BulletManager } from "../../manager/BulletManager";
import { Ui } from "../../ui";
import { BasicCannonBarrel } from "../barrel/BasicBarrel";
import { FireCannonBarrel } from "../barrel/fireCannon";
import { OilCannonBarrel } from "../barrel/OilBarrel";
import { ScatterCannonBarrel } from "../barrel/ScatterBarrel";
import { SnipCannonBarrel } from "../barrel/SnipCannon";
import { WaterCannonBarrel } from "../barrel/WaterBarrel";
import { ALIGNTRIGHT_FLAG } from "../ui/MenuButton";
import { MenuHover } from "../ui/MenuHover";
import { MenuImageButton } from "../ui/MenuImageButton";
import { MenuText } from "../ui/MenuText";
import { MenuTextButton } from "../ui/MenuTextButton";
import { MenuWindow } from "../ui/MenuWindow";
import { CannonBarrel } from "./barrel";
import { Building, MenuBuildingInfo } from "./building";
import { Bullet } from "./bullet";
import Enemy from "./Enemy";

class CannonBaseMenu extends MenuBuildingInfo {
    parent: CannonBase;

    constructor(scene: Ui, selected: CannonBase) {
        super(scene, "cannon");

        this.parent = selected;

        let removeBtn = new MenuTextButton(
            scene,
            () => {
                this.parent.destroy();
                this.destroy();
                this.onClose && this.onClose();
            },
            ALIGNTRIGHT_FLAG | (this.menuWindow.x + this.menuWindow.width),
            this.buildHeight + 10,
            "remove"
        );

        this.menuWindow.addItem(removeBtn);

        this.buildHeight += removeBtn.height + 20;

        if (this.parent.barrel === undefined) {
            let addTxt = new MenuText(
                scene,
                0,
                this.buildHeight,
                "select upgrade"
            );
            // add update info
            this.menuWindow.addItem(addTxt);

            this.buildHeight += addTxt.height;

            // basic barrel
            let newBtn = new MenuImageButton(
                scene,
                () => {
                    this.parent.upgradeBarrel(
                        new BasicCannonBarrel(scene.mainScene, this.parent)
                    );

                    this.onClose();
                },
                0,
                this.buildHeight + 64 / 2,
                32,
                32,
                { texture: "cannon_barrel_img", frame: "cannon_basic_barrel_1" }
            );

            this.menuWindow.addItem(newBtn);

            this.menuWindow.addEventItem(
                new MenuHover(scene, newBtn, "A basic cannon")
            );

            // fire barrel
            newBtn = new MenuImageButton(
                scene,
                () => {
                    this.parent.upgradeBarrel(
                        new FireCannonBarrel(scene.mainScene, this.parent)
                    );

                    this.onClose();
                },
                32 + 32 / 2,
                this.buildHeight + 64 / 2,
                32,
                32,
                { texture: "cannon_barrel_img", frame: "cannon_fire_barrel_1" }
            );

            this.menuWindow.addItem(newBtn);

            this.menuWindow.addEventItem(
                new MenuHover(
                    scene,
                    newBtn,
                    "A fire cannon,\ndeal fire damage every second"
                )
            );

            // water barrel
            newBtn = new MenuImageButton(
                scene,
                () => {
                    this.parent.upgradeBarrel(
                        new WaterCannonBarrel(scene.mainScene, this.parent)
                    );

                    this.onClose();
                },
                (32 + 32 / 2) * 2,
                this.buildHeight + 64 / 2,
                32,
                32,
                { texture: "cannon_barrel_img", frame: "cannon_water_barrel_1" }
            );

            this.menuWindow.addItem(newBtn);

            this.menuWindow.addEventItem(
                new MenuHover(
                    scene,
                    newBtn,
                    "A water cannon,\nadd wet buff to enemy"
                )
            );

            // oil barrel
            newBtn = new MenuImageButton(
                scene,
                () => {
                    this.parent.upgradeBarrel(
                        new OilCannonBarrel(scene.mainScene, this.parent)
                    );

                    this.onClose();
                },
                (32 + 32 / 2) * 3,
                this.buildHeight + 64 / 2,
                32,
                32,
                { texture: "cannon_barrel_img", frame: "cannon_oil_barrel_1" }
            );

            this.menuWindow.addItem(newBtn);

            this.menuWindow.addEventItem(
                new MenuHover(
                    scene,
                    newBtn,
                    "A water cannon,\nadd oil buff to enemy"
                )
            );
            // scatter barrel
            newBtn = new MenuImageButton(
                scene,
                () => {
                    this.parent.upgradeBarrel(
                        new ScatterCannonBarrel(scene.mainScene, this.parent)
                    );

                    this.onClose();
                },
                (32 + 32 / 2) * 4,
                this.buildHeight + 64 / 2,
                32,
                32,
                {
                    texture: "cannon_barrel_img",
                    frame: "cannon_scatter_barrel_1",
                }
            );

            this.menuWindow.addItem(newBtn);

            this.menuWindow.addEventItem(
                new MenuHover(
                    scene,
                    newBtn,
                    "A scatter cannon,\nattack multiple enemy at same time"
                )
            );

            // snip barrel
            newBtn = new MenuImageButton(
                scene,
                () => {
                    this.parent.upgradeBarrel(
                        new SnipCannonBarrel(scene.mainScene, this.parent)
                    );

                    this.onClose();
                },
                (32 + 32 / 2) * 5,
                this.buildHeight + 64 / 2,
                32,
                32,
                { texture: "cannon_barrel_img", frame: "cannon_snip_barrel_1" }
            );

            this.menuWindow.addItem(newBtn);

            this.menuWindow.addEventItem(
                new MenuHover(
                    scene,
                    newBtn,
                    "A snip cannon,\nattack most hp enemy in range"
                )
            );
        } else {
            // render barrel menu
            this.parent.barrel.buildMenu(
                scene,
                this,
                this.buildHeight
            );
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

        this.setInteractive();
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

    destroy(): void {
        if (this.barrel) {
            this.barrel.destroy();
        }

        super.destroy();
    }
}
