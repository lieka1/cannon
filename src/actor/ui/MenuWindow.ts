import { Ui } from "../../ui";
import { MenuBackground } from "./MenuBackground";
import { MenuBase } from "./MenuBase";
import { MenuButton } from "./MenuButton";
import { MenuImageButton } from "./MenuImageButton";
import { MenuTextButton } from "./MenuTextButton";

export interface MenuWindowConfig {
    headerHeight?: number;
    buttonWidth?: number;
}

export class MenuWindow {
    items: MenuBase[] = [];
    config: MenuWindowConfig;

    constructor(
        scene: Ui,
        x: number,
        y: number,
        width: number,
        height: number,
        onMenuClose: () => void,
        config?: MenuWindowConfig
    ) {
        this.config = this.initConfig(config);
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
            new MenuTextButton(
                scene,
                onMenuClose,
                x,
                y,
                this.config.buttonWidth,
                this.config.headerHeight,
                "X"
            )
        );
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

    destroy() {
        this.items.forEach((e) => {
            e.destroy();
        });
    }
}
