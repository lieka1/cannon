import { Physics } from "phaser";
import { Ui } from "../../ui";
import { MenuBase } from "../ui/MenuBase";
import { MenuText } from "../ui/MenuText";
import { MenuWindow } from "../ui/MenuWindow";

export class MenuBuildingInfo {
    buildHeight: number;
    menuWindow: MenuWindow;
    onClose: () => void;
    width: number;
    height: number;

    constructor(scene: Ui, name: string) {
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

        this.buildHeight = this.menuWindow.config.headerHeight;

        let addTxt = new MenuText(scene, 0, this.buildHeight, `${name}: `);
        // add name info
        this.menuWindow.addItem(addTxt);

        this.buildHeight += addTxt.height;
    }

    setCloseFn(onClose: () => void) {
        this.onClose = onClose;
    }

    destroy() {
        this.menuWindow.destroy();
    }
}

export interface buildingConfig {
    name: string;
    size?: { width: number; height: number };
    zIndex?: number;
    offset?: { x: number; y: number };
}

export class Building extends Physics.Arcade.Image {
    name: string;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string,
        config: buildingConfig
    ) {
        super(scene, x, y, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        if (config.size) {
            this.setSize(config.size.width, config.size.height);
        }

        if (config.zIndex) {
            this.setDepth(config.zIndex);
        }

        if (config.offset) {
            this.setOffset(config.offset.x, config.offset.y);
        }

        this.setImmovable();

        this.setInteractive();

        this.name = config.name;
    }

    getBuildingInfo(scene: Ui): MenuBuildingInfo {
        throw "getBuildingInfo shoule be overload";
    }

    update() {}
}
