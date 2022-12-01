import Main from "../../game";
import { PLAYER_Z_INDEX } from "../../player";
import { Ui } from "../../ui";
import { Building, MenuBuildingInfo } from "../base/building";
import { Fixer } from "../soilder/fixer";
import { MenuHover } from "../ui/MenuHover";
import { MenuImageButton } from "../ui/MenuImageButton";

class TavernInfo extends MenuBuildingInfo {
    parent: Tavern;

    constructor(scene: Ui, parent: Tavern) {
        super(scene, "tavern");

        this.parent = parent;

        // fixer
        let newBtn = new MenuImageButton(
            scene,
            () => {
                new Fixer(scene.mainScene, this.parent.x, this.parent.y);

                this.onClose();
            },
            0,
            this.buildHeight + 64,
            64,
            64,
            {
                texture: "enemy",
                frame: "knight_m_idle_anim_f0",
            }
        );
        this.menuWindow.addItem(newBtn);

        this.menuWindow.addEventItem(
            new MenuHover(
                scene,
                newBtn,
                "A fixer\nFixer will fix castle gate which is damaged\nRequire 100 golds"
            )
        );
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

export class Tavern extends Building {
    lastUpdate: number = Date.now();

    constructor(scene: Main, x: number, y: number) {
        super(scene, x, y, "building_tavern", {
            name: "house",
        });
    }

    getBuildingInfo(scene: Ui): MenuBuildingInfo {
        return new TavernInfo(scene, this);
    }

    getCurrentLevelDefine() {
        return GoldMineDefine[0];
    }

    update(): void {}
}
