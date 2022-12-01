import Main from "../../game";
import { PLAYER_Z_INDEX } from "../../player";
import { Ui } from "../../ui";
import { Building, MenuBuildingInfo } from "../base/building";
import { MenuText, MenuTextUpdatable } from "../ui/MenuText";

class GoldRefineryInfo extends MenuBuildingInfo {
    constructor(scene: Ui) {
        super(scene, "gold mine");

        this.menuWindow.addItem(
            new MenuText(
                this.menuWindow.scene,
                0,
                this.buildHeight,
                this.buildMenuText()
            )
        );
    }

    buildMenuText() {
        return `
        --- gold refinery ---
        this building can double
        gold mine perdunction
        `;
    }

    destroy(): void {
        super.destroy();
    }
}

export class GoldRefinery extends Building {
    lastUpdate: number = Date.now();
    totalEarned: number = 0;
    level: number = 0;
    scene: Main;

    constructor(scene: Main, x: number, y: number) {
        super(scene, x, y, "building_refinery", {
            name: "gold refinery",
            size: { width: 96, height: 64 },
            zIndex: PLAYER_Z_INDEX - 1,
            offset: { x: 0, y: 64 },
        });

        scene.Building.hasGoldRefinery = true;
    }

    getBuildingInfo(scene: Ui): MenuBuildingInfo {
        return new GoldRefineryInfo(scene);
    }

    update(): void {}
}
