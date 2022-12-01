// basic cannon will shot faster than orignal
import { BuildingZindex } from "../../manager/BuildingManager";
import { Ui } from "../../ui";
import { CannonBarrel, CannonDefine, formatBarrelStatus } from "../base/barrel";
import { MenuBuildingInfo } from "../base/building";
import { Bullet } from "../base/bullet";
import { CannonBase } from "../base/cannon";
import Enemy from "../base/Enemy";
import { BasicBullet } from "../bullet/BasicBullet";
import { MenuText } from "../ui/MenuText";
import { MenuWindow } from "../ui/MenuWindow";

const MortarCannonDefine: CannonDefine = {
    levelDefine: [{ damage: 30, attackSpeed: 500, attackRange: 500, upgrade: {
        golds: 10,
    } }],
    name: "Mortar Barrel",
    texture: { name: "cannon_barrel_img", frame: "cannon_mortar_barrel_1" },
    shotAnim: "mortar_barrel_shot",
    price: 1,
};

export class MortarCannonBarrel extends CannonBarrel {
    constructor(scene: Phaser.Scene, parent: CannonBase) {
        super(scene, parent, MortarCannonDefine);

        this.setDepth(BuildingZindex.topFloorItem)
    }

    buildBullet(enemy: Enemy): Bullet {
        return new BasicBullet(this.scene, enemy, this, this.x, this.y);
    }

    buildMenu(scene: Ui, menu: MenuBuildingInfo,startPos: number): void {
        menu.menuWindow.addItem(new MenuText(scene, 0, startPos, formatBarrelStatus(this)))
    }
}
