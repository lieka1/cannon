import { GameObjects, Scene } from "phaser";

export default class LoadingScene extends Scene {
    loadingText: GameObjects.Text;

    constructor() {
        super("loading-scene");
    }

    preload() {

    }

    create(): void {
        this.loadingText = new GameObjects.Text(
            this,
            this.game.scale.width / 2,
            this.game.scale.height * 0.4,
            "loading",
            {
                fontSize: "calc(100vw / 25)",
                color: "#fff",
                stroke: "#000",
                strokeThickness: 4,
            }
        )
            .setOrigin(0, 0)
            .setAlign("center")
            .setColor("#ff0000");

        this.add.existing(this.loadingText);

        this.loadingText.setPosition(
            this.game.scale.width / 2 - this.loadingText.width / 2,
            this.game.scale.height * 0.4
        );

        this.scene.start('main');
    }


}
