import { Scene } from "phaser";
import { Ui } from "../../ui";
import { MenuText, TextConfig } from "./MenuText";
import { MenuButton, MenuButtonConfig } from "./MenuButton";

export type MenuTextButtonConfig = MenuButtonConfig & {
    txConf?: TextConfig;
};

export class MenuTextButton extends MenuButton {
    graphics: Phaser.GameObjects.Graphics;
    x: number;
    y: number;
    width: number;
    height: number;

    child: Phaser.GameObjects.GameObject;
    txt: MenuText;

    constructor(
        scene: Ui,
        onPress: () => void,
        x: number,
        y: number,
        width: number,
        height: number,
        text: string,
        config?: MenuTextButtonConfig
    ) {
        super(scene, onPress, x, y, width, height, config);

        config = this.initTextConfig(config);

        this.txt = new MenuText(
            scene,
            x + width / 2,
            y + height / 2,
            text,
            config.txConf
        );
    }

    initTextConfig(c: MenuTextButtonConfig) {
        if (!c) {
            c = {};
        }

        if (!c.txConf) {
            c.txConf = {
                origin: [0.5, 0.5],
            };
        }

        return c;
    }

    destroy() {
        super.destroy();
        this.txt.destroy();
    }
}
