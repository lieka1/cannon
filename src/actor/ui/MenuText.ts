import { GameObjects, Scene } from "phaser";

export interface TextConfig {
    fontSize?: string;
    color?: string;
    stroke?: string;
    strokeWidth?: number;
    origin?: [number, number];
}

const initTextConfig = (c?: TextConfig) => {
    if (!c) {
        c = {};
    }

    if (!c.color) {
        c.color = "#fff";
    }

    if (!c.fontSize) {
        c.fontSize = "calc(100vw / 50)";
    }

    if (!c.stroke) {
        c.stroke = "#000";
    }

    if (!c.strokeWidth) {
        c.strokeWidth = 4;
    }

    if (!c.origin) {
        c.origin = [0, 0];
    }

    return c;
};

export class MenuText extends GameObjects.Text {
    constructor(
        scene: Scene,
        x: number,
        y: number,
        text: string,
        config?: TextConfig
    ) {
        config = initTextConfig(config);

        super(scene, x, y, text, {
            fontSize: config.fontSize,
            color: config.color,
            stroke: config.stroke,
            strokeThickness: config.strokeWidth,
        });

        this.setOrigin(config.origin[0], config.origin[1]);

        scene.add.existing(this);
    }
}

export class MenuTextUpdatable extends MenuText {
    cbUpdate: () => void;

    constructor(
        scene: Scene,
        x: number,
        y: number,
        text: string,
        cb: () => void,
        config?: TextConfig
    ) {
        super(scene, x, y, text, config);
        this.cbUpdate = cb;
    }

    update() {
        this.cbUpdate();
    }
}
