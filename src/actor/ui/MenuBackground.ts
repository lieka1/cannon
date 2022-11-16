import { Ui } from "../../ui";

export class MenuBackground {
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
            x,
            y,
            width,
            height,
            radis
        );

        this.highLightgraphics.setVisible(true);
    }

    setPosition(x:number, y: number,z: number) {
        this.highLightgraphics.setPosition(x, y, z)
    }

    setVisiable(visable: boolean) {
        this.highLightgraphics.setVisible(visable);
    }

    destroy() {
        this.highLightgraphics.destroy();
    }
}
