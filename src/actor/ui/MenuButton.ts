import { Ui } from "../../ui";
import { MenuBase } from "./MenuBase";
import { MenuHover } from "./MenuHover";

export interface MenuButtonConfig {
    borderWidth?: number;
    alpha?: number;
    radius?: number;
    color?: number;
    backgroundColor?: number;
    backgroundAlpha?: number;
    highLightBackgroundColor?: number;
    highLightBackgroundAlpha?: number;
    zIndex?: number;
}

export const ALIGNTRIGHT_FLAG = 0b1000000000000;

export class MenuButton extends MenuBase {
    graphics: Phaser.GameObjects.Graphics;
    highLightgraphics: Phaser.GameObjects.Graphics;
    disablegraphics: Phaser.GameObjects.Graphics;

    disabled: boolean;

    x: number;
    y: number;
    width: number;
    height: number;

    child: Phaser.GameObjects.GameObject;

    config: MenuButtonConfig;

    popOver: MenuHover;

    constructor(
        scene: Ui,
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

        this.graphics = scene.add.graphics();

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
        this.highLightgraphics = scene.add.graphics();

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

        this.disablegraphics = scene.add.graphics();

        this.disablegraphics.fillStyle(0xff0000, 0xa0);

        this.disablegraphics.fillRoundedRect(
            this.x,
            this.y,
            this.width,
            this.height,
            this.config.radius
        );

        this.disablegraphics.setVisible(false);

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

        this.graphics.setPosition(
            this.graphics.x,
            this.graphics.y,
            this.config.zIndex
        );
        this.highLightgraphics.setPosition(
            this.highLightgraphics.x,
            this.highLightgraphics.y,
            this.config.zIndex
        );
        this.disablegraphics.setPosition(
            this.disablegraphics.x,
            this.disablegraphics.y,
            this.config.zIndex
        );

        this.graphics.on("pointerup", () => {
            if (!this.disabled) {
                onPress();
            }
        });

        this.graphics.on("pointerover", () => {
            if (!this.disabled) {
                this.renderHighlightInside();
            }
        });

        this.graphics.on("pointerout", () => {
            if (!this.disabled) {
                this.renderInside();
            }
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

        if (!c.zIndex) {
            c.zIndex = 0;
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
        this.disablegraphics.destroy();
    }

    disable() {
        if (!this.disabled) {
            this.disablegraphics.setVisible(true);
            this.disabled = true;
        }
    }

    enable() {
        if (this.disabled) {
            this.disablegraphics.setVisible(true);
            this.disabled = false;
        }
    }
}
