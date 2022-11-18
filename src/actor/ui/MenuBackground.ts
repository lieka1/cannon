import { Ui } from "../../ui";
import { MenuBase } from "./MenuBase";

export class MenuBackground extends MenuBase {
    highLightgraphics: Phaser.GameObjects.Graphics;

    // x: number;
    // y: number;
    // width: number;
    // height: number;

    constructor(
        sence: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        height: number,
        highLightBackgroundColor: number,
        highLightBackgroundAlpha: number,
        radis: number = 0
    ) {
        super();

        // this.x = x;
        // this.y = y;
        // this.width = width;
        // this.height = height;

        // highlight graphics
        this.highLightgraphics = sence.add.graphics();

        this.highLightgraphics.fillStyle(
            highLightBackgroundColor,
            highLightBackgroundAlpha
        );

        this.highLightgraphics.fillRoundedRect(
            -width / 2,
            -height / 2,
            width,
            height,
            radis
        );

        this.highLightgraphics.setVisible(true);

        this.highLightgraphics.setPosition(x + width / 2, y + height / 2);
    }

    setPosition(x: number, y: number, z: number) {
        this.highLightgraphics.setPosition(x, y, z);
    }

    setVisiable(visable: boolean) {
        this.highLightgraphics.setVisible(visable);
    }

    destroy() {
        this.highLightgraphics.destroy();
    }
}
