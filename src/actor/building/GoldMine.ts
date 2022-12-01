import Main from "../../game";
import { Ui } from "../../ui";
import { Building, MenuBuildingInfo } from "../base/building";
import { MenuText, MenuTextUpdatable } from "../ui/MenuText";

class GoldMineInfo extends MenuBuildingInfo {
    parent: GoldMine;
    infoTxt: MenuTextUpdatable;

    constructor(scene: Ui, mine: GoldMine) {
        super(scene, "gold mine");

        this.parent = mine;
        this.infoTxt = new MenuTextUpdatable(
            this.menuWindow.scene,
            0,
            this.buildHeight,
            this.buildMenuText(),
            () => {
                this.infoTxt.setText(this.buildMenuText());
            }
        );

        this.menuWindow.addEventItem(this.infoTxt);
    }

    buildMenuText() {
        let currentLevel = this.parent.getCurrentLevelDefine();
        return `
        --- gold mine ---
        total mined: ${this.parent.totalEarned}
        gold pre second: ${
            (1000 / currentLevel.goldAddInterval) * currentLevel.goldAddNum
        }
        `;
    }

    destroy(): void {
        super.destroy();
    }
}

const GoldMineDefine = [
    {
        goldAddInterval: 1000,
        goldAddNum: 1,
    },
];

export class GoldMine extends Building {
    lastUpdate: number = Date.now();
    totalEarned: number = 0;
    level: number = 0;
    scene: Main;

    constructor(scene: Main, x: number, y: number) {
        super(scene, x, y, "building_gold_mine", { name: "gold mine" });
    }

    getBuildingInfo(scene: Ui): MenuBuildingInfo {
        return new GoldMineInfo(scene, this);
    }

    getCurrentLevelDefine() {
        return GoldMineDefine[this.level];
    }

    update(): void {
        if (
            Date.now() - this.lastUpdate >
            GoldMineDefine[this.level].goldAddInterval
        ) {
            let s = this.scene as Main;
            let hasRefinery = s.Building.hasGoldRefinery ? 2 : 1;

            let addNum = Math.round(
                (Date.now() - this.lastUpdate) /
                    this.getCurrentLevelDefine().goldAddInterval
            );

            s.gold.get(
                addNum * this.getCurrentLevelDefine().goldAddNum * hasRefinery
            );

            this.totalEarned +=
                addNum * this.getCurrentLevelDefine().goldAddNum;

            this.lastUpdate =
                this.lastUpdate +
                addNum * this.getCurrentLevelDefine().goldAddInterval;
        }
    }
}
