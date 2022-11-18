import { Ui } from "../../ui";
import { MenuBase } from "./MenuBase";

export interface MenuButtonConfig {
    borderWidth?: number;
    alpha?: number;
    radius?: number;
    color?: number;
    backgroundColor?: number;
    backgroundAlpha?: number;
    highLightBackgroundColor?: number;
    highLightBackgroundAlpha?: number;
}

export class MenuButton extends MenuBase {
    graphics: Phaser.GameObjects.Graphics;
    highLightgraphics: Phaser.GameObjects.Graphics;

    x: number;
    y: number;
    width: number;
    height: number;

    child: Phaser.GameObjects.GameObject;

    config: MenuButtonConfig;

    constructor(
        sence: Ui,
        onPress: () => void,
        x: number,
        y: number,
        width: number,
        height: number,
        config?: MenuButtonConfig
    ) {
        super();
        this.config = this.initConfig(config);

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.graphics = sence.add.graphics();

        // render boundary
        this.graphics.lineStyle(
            this.config.borderWidth,
            this.config.color,
            this.config.alpha
        );

        this.graphics.strokeRoundedRect(
            x,
            y,
            width,
            height,
            this.config.radius
        );

        // render inside
        this.graphics.fillStyle(
            this.config.backgroundColor,
            this.config.backgroundAlpha
        );

        this.graphics.fillRoundedRect(
            this.x,
            this.y,
            this.width,
            this.height,
            this.config.radius
        );

        // highlight graphics
        this.highLightgraphics = sence.add.graphics();

        this.highLightgraphics.fillStyle(
            this.config.highLightBackgroundColor,
            this.config.highLightBackgroundAlpha
        );

        this.highLightgraphics.fillRoundedRect(
            this.x,
            this.y,
            this.width,
            this.height,
            this.config.radius
        );

        this.renderInside();

        this.graphics.setInteractive({
            hitArea: this.graphics,
            hitAreaCallback: (
                hitArea: any,
                x: number,
                y: number,
                gameObject: Phaser.GameObjects.GameObject
            ) => {
                return (
                    this.x <= x &&
                    this.x + this.width >= x &&
                    this.y <= y &&
                    this.y + this.height >= y
                );
            },
        });

        this.graphics.on("pointerup", () => {
            onPress();
        });

        this.graphics.on("pointerover", () => {
            this.renderHighlightInside();
        });

        this.graphics.on("pointerout", () => {
            this.renderInside();
        });
    }

    renderInside() {
        this.highLightgraphics.visible = false;
    }

    renderHighlightInside() {
        this.highLightgraphics.visible = true;
    }

    initConfig(c: MenuButtonConfig) {
        if (!c) {
            c = {};
        }

        if (!c.borderWidth) {
            c.borderWidth = 2;
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

        if (!c.highLightBackgroundColor) {
            c.highLightBackgroundColor = 0;
        }

        if (!c.highLightBackgroundAlpha) {
            c.highLightBackgroundAlpha = 0xb0;
        }

        return c;
    }

    destroy() {
        this.graphics.destroy();
        this.highLightgraphics.destroy();
    }
}
