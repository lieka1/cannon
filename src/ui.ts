import { Text } from "./actor/base/text";
import Main from "./game";

export enum ScoreOperations {
    INCREASE,
    DECREASE,
    SET_VALUE,
}

export class Ui extends Phaser.Scene {
    private score!: Text;
    lastUpdate: number = 0;

    constructor() {
        super({ key: "UIScene", active: true });
    }

    create(): void {
        this.score = new Text(this, 20, 20, "Fps: 0, objs: 0");
    }

    update(time: number, _: number): void {
        if (time - this.lastUpdate > 1000) {
            let s = this.game.scene.getScene("main") as Main;
            
            let objCount = 0;
            if (s.Enemys != undefined) {
                objCount = s.Enemys.data.length;
            }

            this.score.setText(
                `Fps ${this.game.loop.actualFps}, objs: ${objCount}`
            );

            this.lastUpdate = time;
        }
    }
}
