import { Physics } from "phaser";

export class EnemyPortal extends Physics.Arcade.Sprite {
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        revert: boolean,
        color: string
    ) {
        super(scene, x, y, "background_portal_" + color);

        scene.add.existing(this);

        this.anims.play("portal_" + color + "_run");

        if (revert) {
            this.scaleX = -1;
        }
    }
}
