import Main from "../../game";
import { CastleScene } from "../../manager/MapManager";

export class CastleStair extends Phaser.GameObjects.Rectangle {
    stairName: string;
    floor1: CastleScene;
    floor2: CastleScene;
    lastChangeFloor: number = 0;

    constructor(
        scene: Main,
        x: number,
        y: number,
        width: number,
        height: number,
        floor1: CastleScene,
        floor2: CastleScene
    ) {
        super(scene, x + width / 2, y + height / 2, width, height);

        scene.physics.add.existing(this);

        this.floor1 = floor1;
        this.floor2 = floor2;
    }

    canChange() {
        if (this.floor1 === this.floor2) return true;

        return Date.now() - this.lastChangeFloor > 1000;
    }

    getOther(f: CastleScene) {
        this.lastChangeFloor = Date.now();

        if (f === this.floor1) {
            return this.floor2;
        }

        return this.floor1;
    }
}
