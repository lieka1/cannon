import { Scene } from "phaser";
import { Ui } from "../../ui";
import { MenuText } from "./MenuText";
import { MenuButton, MenuButtonConfig } from "./MenuButton";

export type MenuImageButtonConfig = MenuButtonConfig & {
    resize?: boolean;
};

const initMenuImageButtonConfig = (c?: MenuImageButtonConfig) =>{ 
    if (!c) {
        c=  {}
    }

    if (!c.resize) { 
        c.resize = false;
    }

    return c;
}

export interface ImageConfig {
    texture: string;
    frame?: number | string;
}

export class MenuImageButton extends MenuButton {
    graphics: Phaser.GameObjects.Graphics;
    x: number;
    y: number;
    width: number;
    height: number;

    child: Phaser.GameObjects.GameObject;
    texture: Phaser.GameObjects.Image;

    constructor(
        scene: Ui,
        onPress: () => void,
        x: number,
        y: number,
        width: number,
        height: number,
        texture: ImageConfig,
        config?: MenuImageButtonConfig
    ) {
        super(scene, onPress, x, y, width, height, config);

        config = initMenuImageButtonConfig(config);

        this.texture = scene.add.image(
            x + width / 2,
            y + height / 2,
            texture.texture,
            texture.frame
        );

        if (config.resize) {
            this.texture.setScale(
                width / this.texture.width,
                height / this.texture.height
            );
        }
    }

    destroy() {
        super.destroy();
        this.texture.destroy();
    }
}
