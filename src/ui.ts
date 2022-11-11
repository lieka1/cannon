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
    bottomHeight: number = 70;
    itemCount: number = 5;
    itemPadding: number = 5;
    sideColor = 0x993300;

    frames: Phaser.GameObjects.Rectangle[];

    constructor() {
        super({ key: "UIScene", active: true });

        this.frames = [];

    }

    rerender() {
        // remove old frames
        this.frames.forEach((e) => {
            e.destroy();
        });

        this.frames = [];

        if (this.score) {
            this.score.destroy();
        }

        this.score = new Text(this, 20, 20, "Fps: 0, objs: 0");
        const totalHeight = this.game.scale.height;
        const itemSizeHalf = this.bottomHeight / 2;
        const totalLen = this.bottomHeight * this.itemCount;
        const leftMargin = (this.game.scale.width - totalLen) / 2;
        const paddingHalf = this.itemPadding / 2;

        for (let i = 0; i < this.itemCount; i++) {
            //background
            this.frames.push(
                this.add.rectangle(
                    leftMargin + i * this.bottomHeight,
                    totalHeight - itemSizeHalf - paddingHalf,
                    this.bottomHeight,
                    this.bottomHeight + this.itemPadding,
                    0,
                    0xa0
                )
            );

            // right side
            this.frames.push(
                this.add.rectangle(
                    leftMargin +
                        i * this.bottomHeight +
                        itemSizeHalf -
                        paddingHalf,
                    totalHeight - itemSizeHalf,
                    this.itemPadding,
                    this.bottomHeight,
                    this.sideColor
                )
            );

            // bottom side
            this.frames.push(
                this.add.rectangle(
                    leftMargin + i * this.bottomHeight,
                    totalHeight - paddingHalf,
                    this.bottomHeight,
                    this.itemPadding,
                    this.sideColor
                )
            );

            // top side
            this.frames.push(
                this.add.rectangle(
                    leftMargin + i * this.bottomHeight,
                    totalHeight - this.bottomHeight - paddingHalf,
                    this.bottomHeight,
                    this.itemPadding,
                    this.sideColor
                )
            );
        }

        this.frames.push(
            this.add.rectangle(
                leftMargin - itemSizeHalf,
                totalHeight - itemSizeHalf - paddingHalf,
                this.itemPadding,
                this.bottomHeight,
                this.sideColor
            )
        );
    }

    create(): void {
        // handle resize
        this.scale.addListener("resize", this.rerender, this);
    }

    update(time: number, _: number): void {
        if (time - this.lastUpdate > 1000) {
            let s = this.game.scene.getScene("main") as Main;

            let objCount = 0;
            if (s.Enemys != undefined) {
                objCount = s.Enemys.data.length;
            }

            this.score.setText(
                `Fps ${Math.round(this.game.loop.actualFps)}, objs: ${objCount}`
            );

            this.lastUpdate = time;
        }
    }
}
