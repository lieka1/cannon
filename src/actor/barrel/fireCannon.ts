
// fire cannon need water to cooldown// basic cannon will distory itself after 100 shots
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

const FireCannonDefine: CannonDefine = {
    levelDefine: [{ damage: 5, attackSpeed: 500, attackRange: 500, upgrade: {
        golds: 10,
    } }],
    name: "Fire Cannon",
    texture: { name: "cannon_barrel_img", frame: "cannon_fire_barrel_1" },
    shotAnim: "fire_barrel_shot",
    price: 1,
};

export class FireCannonBarrel extends CannonBarrel {
    constructor(scene: Phaser.Scene, parent: CannonBase) {
        super(scene, parent, FireCannonDefine);

        this.setDepth(BuildingZindex.topFloorItem)
    }

    buildBullet(enemy: Enemy): Bullet {
        return new BasicBullet(this.scene, enemy, this, this.x, this.y);
    }

    buildMenu(scene: Ui, menu: MenuBuildingInfo,startPos: number): void {
        menu.menuWindow.addItem(new MenuText(scene, 0, startPos, formatBarrelStatus(this)))
    }
}
