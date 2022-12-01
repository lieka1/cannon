// basic cannon will distory itself after 100 shots
import Main from "../../game";
import { BuildingZindex } from "../../manager/BuildingManager";
import { Ui } from "../../ui";
import { CannonBarrel, CannonDefine, formatBarrelStatus } from "../base/barrel";
import { MenuBuildingInfo } from "../base/building";
import { Bullet } from "../base/bullet";
import { CannonBase } from "../base/cannon";
import Enemy from "../base/Enemy";
import { BasicBullet } from "../bullet/BasicBullet";
import { MenuText } from "../ui/MenuText";
import { MenuTextButton } from "../ui/MenuTextButton";
import { MenuWindow } from "../ui/MenuWindow";
import { AdvanceCannonBarrel } from "./AdvanceBarrel";

const BasicCannonDefine: CannonDefine = {
    levelDefine: [
        {
            damage: 1,
            attackSpeed: 1000,
            attackRange: 500,
            upgrade: {
                golds: 10,
            },
        },
        {
            damage: 2,
            attackSpeed: 1000,
            attackRange: 500,
            upgrade: {
                golds: 20,
            },
        },
        {
            damage: 4,
            attackSpeed: 1000,
            attackRange: 500,
            upgrade: {
                golds: 80,
            },
        },
        {
            damage: 8,
            attackSpeed: 1000,
            attackRange: 500,
            upgrade: {
                golds: 160,
            },
        },
        {
            damage: 16,
            attackSpeed: 1000,
            attackRange: 500,
            upgrade: {
                golds: 320,
                builder: (scene, parent) =>
                    new AdvanceCannonBarrel(scene, parent),
            },
        },
    ],
    name: "Basic Barrel",
    texture: { name: "cannon_barrel_img", frame: "cannon_basic_barrel_1" },
    shotAnim: "basic_barrel_shot",
    price: 0,
};

export class BasicCannonBarrel extends CannonBarrel {
    constructor(scene: Main, parent: CannonBase) {
        super(scene, parent, BasicCannonDefine);

        this.setDepth(BuildingZindex.topFloorItem);
    }

    buildBullet(enemy: Enemy): Bullet {
        return new BasicBullet(this.scene, enemy, this, this.x, this.y);
    }

    buildMenu(scene: Ui, menu: MenuBuildingInfo, startPos: number): void {
        let s = new MenuText(scene, 0, startPos, formatBarrelStatus(this));

        menu.menuWindow.addItem(s);

        startPos += s.height;

        if (this.canUpdate()) {
            menu.menuWindow.addItem(
                new MenuTextButton(
                    scene,
                    () => {
                        if (this.tryUpdate()) {
                            menu.onClose();
                        }
                    },
                    0,
                    startPos,
                    "update"
                )
            );
        }
    }
}
