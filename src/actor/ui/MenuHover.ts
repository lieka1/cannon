import { Ui } from "../../ui";
import { MenuBase, MenuBaseUpdatable } from "./MenuBase";
import { MenuButton } from "./MenuButton";
import { MenuText } from "./MenuText";

export interface MenuPopupConfig {
    backgroundColor?: number;
    backgroundAlpha?: number;
    radius?: number;
    borderWidth?: number;
    color?: number;
    alpha?: number;
}

class MenuHoverPopup extends MenuBase {
    graphics: Phaser.GameObjects.Graphics;
    config: MenuPopupConfig;
    width: number;
    height: number;
    text: MenuText;

    constructor(scene: Ui, txt: MenuText, config?: MenuPopupConfig) {
        super();

        this.text = txt;
        let newX = this.text.x - this.text.width / 2;
        let newY = this.text.y - this.text.height / 2;

        if (newX < 0) {
            newX = 0;
        }

        this.text.setPosition(newX, newY, 1000);

        this.config = this.initConfig(config);

        this.graphics = scene.add.graphics();

        this.width = txt.width;
        this.height = txt.height;

        // render boundary
        this.graphics.lineStyle(
            this.config.borderWidth,
            this.config.color,
            this.config.alpha
        );

        this.graphics.strokeRoundedRect(
            txt.x,
            txt.y,
            txt.width,
            txt.height,
            this.config.radius
        );

        // render inside
        this.graphics.fillStyle(
            this.config.backgroundColor,
            this.config.backgroundAlpha
        );

        this.graphics.fillRoundedRect(
            txt.x,
            txt.y,
            txt.width,
            txt.height,
            this.config.radius
        );

        this.graphics.setInteractive({
            hitArea: this.graphics,
            hitAreaCallback: (
                hitArea: any,
                x: number,
                y: number,
                gameObject: Phaser.GameObjects.GameObject
            ) => {
                return (
                    this.graphics.x <= x &&
                    this.graphics.x + this.width >= x &&
                    this.graphics.y <= y &&
                    this.graphics.y + this.height >= y
                );
            },
        });

        // this.graphics.on("pointerover", () => {
        //     this.renderHighlightInside();
        // });

        this.graphics.on("pointerout", () => {
            this.graphics.setVisible(false);
        });
    }

    initConfig(c: MenuPopupConfig) {
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

        return c;
    }

    show() {
        this.graphics.setVisible(true);
        this.text.setVisible(true);
    }

    hide() {
        this.graphics.setVisible(false);
        this.text.setVisible(false);
    }

    destroy(): void {
        this.graphics.destroy();
        this.text.destroy();
    }
}

export class MenuHover extends MenuBaseUpdatable {
    overlay: MenuHoverPopup;
    parent: MenuButton;
    scene: Ui;
    str: string;

    constructor(scene: Ui, parent: MenuButton, txt: string) {
        super();

        this.scene = scene;
        this.str = txt;
        this.parent = parent;
    }

    update(cursorx: number, cursory: number) {
        let show = false;
        if (
            this.parent.x < cursorx &&
            this.parent.x + this.parent.width > cursorx
        ) {
            if (
                this.parent.y < cursory &&
                this.parent.y + this.parent.height > cursory
            ) {
                if (this.overlay) {
                    this.overlay.show();
                } else {
                    this.overlay = new MenuHoverPopup(
                        this.scene,
                        new MenuText(
                            this.scene,
                            this.parent.x + this.parent.width / 2,
                            this.parent.y - this.parent.height / 2,
                            this.str
                        )
                    );
                }
                show = true;
            }
        }

        if (!show && this.overlay) {
            this.overlay.hide();
        }
    }

    destroy(): void {
        if (this.overlay) {
            this.overlay.destroy();
        }
    }
}
