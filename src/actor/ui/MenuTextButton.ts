import { Scene } from "phaser";
import { Ui } from "../../ui";
import { MenuText, TextConfig } from "./MenuText";
import { ALIGNTRIGHT_FLAG, MenuButton, MenuButtonConfig } from "./MenuButton";

export type MenuTextButtonConfig = MenuButtonConfig & {
    txConf?: TextConfig;
    size?: { width: number; height: number };
};

function initTextConfig(c: MenuTextButtonConfig) {
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
        text: string,
        config?: MenuTextButtonConfig
    ) {
        config = initTextConfig(config);
        let newTxt;
        let alignRight = false;
        let configHasSize = true;

        // if x start by right side
        if ((x & ALIGNTRIGHT_FLAG) === ALIGNTRIGHT_FLAG) {
            x = x ^ ALIGNTRIGHT_FLAG;
            alignRight = true;
        }

        if (!config.size) {
            newTxt = new MenuText(scene, x, y, text, config.txConf);

            newTxt.setPosition(newTxt.x - newTxt.width, newTxt.y - (newTxt.height / 2));

            config.size = { width: newTxt.width, height: newTxt.height };

            configHasSize = false;
        }

        if (alignRight) {
            if (configHasSize) {
                x = x - config.size.width;
            } else {
                x = x - newTxt.width;
            }

            y = y - config.size.height / 2;
        }

        super(
            scene,
            onPress,
            x,
            y,
            config.size.width,
            config.size.height,
            config
        );

        if (newTxt) {
            this.txt = newTxt;

            this.txt.setPosition(
                newTxt.x + newTxt.width / 2,
                newTxt.y + newTxt.height / 2
            );
            this.txt.setDepth(10000);
        } else {
            this.txt = new MenuText(
                scene,
                x + this.width / 2,
                y + this.height / 2,
                text,
                config.txConf
            );
        }
    }

    destroy() {
        super.destroy();
        this.txt.destroy();
    }
}
