import Main from "../../game";
import { Ui } from "../../ui";
import { Building, MenuBuildingInfo } from "../base/building";

class HouseInfo extends MenuBuildingInfo {
    destroy(): void {
        super.destroy();
    }
}


export class Library extends Building {
    lastUpdate: number = Date.now();

    constructor(scene: Main, x: number, y: number) {
        super(scene, x, y, "building_library", { name: "library" });
    }

    getBuildingInfo(scene: Ui): MenuBuildingInfo {
        return new HouseInfo(scene, "room");
    }

    update(): void {}
}
