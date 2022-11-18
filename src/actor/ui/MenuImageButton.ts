import { Scene } from "phaser";
import { Ui } from "../../ui";
import { MenuText } from "./MenuText";
import { MenuButton, MenuButtonConfig } from "./MenuButton";
import { MenuPopup } from "./MenuPopup";

export type MenuImageButtonConfig = MenuButtonConfig & {
    onHover?: () => MenuPopup;
};

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
        texture: string,
        config?: MenuImageButtonConfig
    ) {
        super(scene, onPress, x, y, width, height, config);

        this.texture = scene.add.image(x + width / 2, y + height / 2, texture);
    }

    destroy() {
        super.destroy();
        this.texture.destroy();
    }
}
