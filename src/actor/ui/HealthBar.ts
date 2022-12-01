import { MenuBase } from "./MenuBase";
import { MenuText } from "./MenuText";

interface HealthBarConfig {
    name?: string;
    showNum?: boolean;
}

function initHealthbarConfig(c?: HealthBarConfig) {
    if (!c) {
        c = {};
    }

    if (c.showNum === undefined) {
        c.showNum = false;
    }

    return c;
}

export class HealthBar extends MenuBase {
    lastUpdateHp: number;
    lastUpdateTotalHp: number;
    lastUpdatePercentHp: number;

    x: number;
    y: number;
    width: number;
    height: number;

    bar: Phaser.GameObjects.Graphics;
    config: HealthBarConfig;

    nameTxt?: MenuText;
    healthTxt?: MenuText;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        height: number,
        config?: HealthBarConfig
    ) {
        super();

        this.config = initHealthbarConfig(config);

        if (this.config.name) {
            this.nameTxt = new MenuText(scene, x, y - 2, this.config.name, {
                fontSize: height + "px",
                origin: [1, 0],
            });
        }

        if (this.config.showNum) {
            this.healthTxt = new MenuText(scene, x + width, y - 2, this.config.name, {
                fontSize: "",
                origin: [0, 0],
            });
        }

        this.bar = new Phaser.GameObjects.Graphics(scene);

        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.lastUpdatePercentHp = 1;

        this.draw();

        scene.add.existing(this.bar);
    }

    draw() {
        this.bar.clear();

        //  BG
        this.bar.fillStyle(0x000000);
        this.bar.fillRect(this.x, this.y, this.width, this.height);

        //  Health
        this.bar.fillStyle(0xffffff);
        this.bar.fillRect(
            this.x + 2,
            this.y + 2,
            this.width - 4,
            this.height - 4
        );

        if (this.lastUpdatePercentHp < 0.3) {
            this.bar.fillStyle(0xff0000);
        } else {
            this.bar.fillStyle(0x00ff00);
        }

        var d = Math.floor(this.lastUpdatePercentHp * (this.width - 4));

        this.bar.fillRect(this.x + 2, this.y + 2, d, this.height - 4);

        if (this.healthTxt) {
            this.healthTxt.setText(
                `${Math.round(this.lastUpdateHp)}/${Math.round(this.lastUpdateTotalHp)}`
            );
        }
    }

    destroy(): void {
        this.bar.destroy();
        if (this.nameTxt) {
            this.nameTxt.destroy();
        }
        if(this.healthTxt) {
            this.healthTxt.destroy();
        }
    }

    updatePercent(current: number, total: number) {
        let p = current / total;
        if (
            Math.abs(p - this.lastUpdatePercentHp) > 0.2 ||
            current !== this.lastUpdateHp ||
            total !== this.lastUpdateTotalHp
        ) {
            this.lastUpdatePercentHp = p;
            this.lastUpdateHp = current;
            this.lastUpdateTotalHp = total;
            this.draw();
        }
    }
}
