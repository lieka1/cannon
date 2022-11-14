import { Ui } from "../../ui";

export interface MenuButtonConfig {
    lineWidth?: number;
    alpha?: number;
    radius?: number;
    color?: number;
    backgroundColor?: number;
    backgroundAlpha?: number;
}

export class MenuButton {
    graphics: Phaser.GameObjects.Graphics;

    constructor(
        sence: Ui,
        onPress: () => void,
        x: number,
        y: number,
        width: number,
        height: number,
        config?: MenuButtonConfig
    ) {
        config = this.initConfig(config);

        this.graphics = sence.add.graphics();

        this.graphics.lineStyle(config.lineWidth, config.color, config.alpha);

        //  32px radius on the corners
        this.graphics.strokeRoundedRect(x, y, width, height, config.radius);

        this.graphics.fillStyle(config.backgroundColor, config.backgroundAlpha);

        this.graphics.fillRoundedRect(x, y, width, height, config.radius);
    }

    initConfig(c: MenuButtonConfig) {
        if (!c) {
            c = {};
        }

        if (!c.lineWidth) {
            c.lineWidth = 2;
        }

        if (!c.alpha) {
            c.alpha = 1;
        }

        if (!c.radius) {
            c.radius = 5;
        }

        if (!c.color) {
            c.color = 0x993300;
        }

        if (!c.backgroundAlpha) {
            c.backgroundAlpha = 0xa0;
        }

        if (!c.backgroundColor) {
            c.backgroundColor = 0;
        }

        return c;
    }

    destroy() {
        this.graphics.destroy();
    }
}
