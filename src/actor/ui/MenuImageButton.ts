import { Scene } from "phaser";
import { Ui } from "../../ui";
import { Text } from "../base/text";
import { MenuButton, MenuButtonConfig } from "./MenuButton";
import { MenuPopup } from "./MenuPopup";

export type MenuImageButtonConfig = MenuButtonConfig & {
    onHover?: ()=> MenuPopup;
}

export class MenuTextButton extends MenuButton {
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
        text: string,
        config?: MenuImageButtonConfig
    ) {
        super(scene, onPress, x, y, width, height, config);

        this.texture = new Phaser.GameObjects.Image(scene,x,y,text);
    }

    destroy() {
        super.destroy();
        this.texture.destroy();
    }
}
