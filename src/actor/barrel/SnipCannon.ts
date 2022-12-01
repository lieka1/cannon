// snip cannon should stop working if player is not aroud for a long time
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

const SnipCannonDefine: CannonDefine = {
    levelDefine: [{ damage: 2, attackSpeed: 500, attackRange: 500, upgrade: {
        golds: 10,
    } }],
    name: "Snip Barrel",
    texture: { name: "cannon_barrel_img", frame: "cannon_snip_barrel_1" },
    shotAnim: "snip_barrel_shot",
    price: 1,
};

export class SnipCannonBarrel extends CannonBarrel {
    constructor(scene: Phaser.Scene, parent: CannonBase) {
        super(scene, parent, SnipCannonDefine);

        this.setDepth(BuildingZindex.topFloorItem)
    }

    buildBullet(enemy: Enemy): Bullet {
        return new BasicBullet(this.scene, enemy, this, this.x, this.y);
    }

    buildMenu(scene: Ui, menu: MenuBuildingInfo,startPos: number): void {
        menu.menuWindow.addItem(new MenuText(scene, 0, startPos, formatBarrelStatus(this)))
    }
}
