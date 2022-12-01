import { Ui } from "../../ui";
import { MenuBackground } from "./MenuBackground";
import { MenuBase, MenuBaseUpdatable } from "./MenuBase";
import { MenuButton } from "./MenuButton";
import { MenuImageButton } from "./MenuImageButton";
import { MenuTextButton } from "./MenuTextButton";

export interface MenuWindowConfig {
    headerHeight?: number;
    buttonWidth?: number;
}

export class MenuWindow {
    items: MenuBase[] = [];
    eventItems: MenuBaseUpdatable[] = [];
    config: MenuWindowConfig;
    scene: Ui;

    x: number;
    y: number;
    width: number;
    height: number;

    constructor(
        scene: Ui,
        x: number,
        y: number,
        width: number,
        height: number,
        onMenuClose: () => void,
        config?: MenuWindowConfig
    ) {
        this.scene = scene;
        this.config = this.initConfig(config);

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        // render background
        this.items.push(
            new MenuBackground(scene, x, y, width, height, 0, 0xb0)
        );
        // header
        this.items.push(
            new MenuBackground(
                scene,
                x,
                y,
                width,
                this.config.headerHeight,
                0,
                0xa0
            )
        );

        this.items.push(
            new MenuTextButton(scene, onMenuClose, x, y, "X", {
                size: {
                    width: this.config.buttonWidth,
                    height: this.config.headerHeight,
                },
            })
        );

        this.scene.addWindow(this);
    }

    private initConfig(c: MenuWindowConfig) {
        if (!c) {
            c = {};
        }

        if (!c.headerHeight) {
            c.headerHeight = 20;
        }

        if (!c.buttonWidth) {
            c.buttonWidth = 40;
        }

        return c;
    }

    addItem(i: MenuBase) {
        this.items.push(i);
    }

    addEventItem(i: MenuBaseUpdatable) {
        this.addItem(i);
        this.eventItems.push(i);
    }

    destroy() {
        this.items.forEach((e) => {
            e.destroy();
        });
        this.scene.removeWindow(this);
    }

    update() {
        this.eventItems.forEach((e) => {
            e.update(this.scene.curserPos.x, this.scene.curserPos.y);
        });
    }
}
