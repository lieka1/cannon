import { Physics } from "phaser";
import { Ui } from "../../ui";
import { MenuBuildingInfo } from "../ui/extends/MenuBuildingInfo";
import { MenuBase } from "../ui/MenuBase";

export interface buildingConfig {
    name: string;
}

export class Building extends Physics.Arcade.Image {
    name: string;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string,
        config: buildingConfig
    ) {
        super(scene, x, y, texture);

        this.name = config.name;
    }

    getBuildingInfo(scene: Ui): MenuBuildingInfo {
        throw "getBuildingInfo shoule be overload"
    }
}
