import { Ui } from "../../ui";

class MenuImage extends Phaser.GameObjects.Image {
    constructor(scene: Ui, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
    }
}
