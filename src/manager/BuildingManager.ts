import { Building } from "../actor/base/building";
import Main from "../game";
import { Ui } from "../ui";
import { getMountIDByPos, getMountPosById } from "./CannonManager";
import { CastleScene } from "./MapManager";

export const BuildingZindex = {
    outside: 10,
    firstFloor: 10,
    firstFloorInterior: 15,
    SecondFloor: 20,
    SecondFloorInterior: 25,
    topFloor: 30,
    topFloorItem: 40,
    BuildingMax: 400,
};

export class BuildingManager {
    GroundOutsideMountPos: Map<number, Building> = new Map();
    GroundInsideMountPos: Map<number, Building> = new Map();
    SecMountPos: Map<number, Building> = new Map();

    GroundOutSideBuilding: Building[] = [];
    GroundInsideBuilding: Building[] = [];
    SecondBuildin: Building[] = [];
    scene: Main;

    lastStaire: CastleScene = -1;

    hasGoldRefinery: boolean = false;
    secondFloorBottomY: number;

    constructor(scene: Main) {
        this.scene = scene;

        let mapTar = scene.Map.map.getObjectLayer("map_target");

        let sec_floor = mapTar.objects.filter(
            (e) =>
                e.name.substring(0, "sec_building_place".length) ===
                "sec_building_place"
        );

        let outside = mapTar.objects.find(
            (e) => e.name === "ground_outside_place"
        );

        let ground_inside = mapTar.objects.filter(
            (e) =>
                e.name.substring(0, "ground_building_place".length) ===
                "ground_building_place"
        );

        sec_floor.forEach((e) => {
            for (var i = e.x + 16; i < e.x + e.width; i += 16) {
                for (var j = e.y + 16; j < e.y + e.height; j += 16) {
                    this.SecMountPos.set(getMountIDByPos(i, j), undefined);
                }
            }
        });

        for (var i = outside.x + 16; i < outside.x + outside.width; i += 16) {
            for (
                var j = outside.y + 16;
                j < outside.y + outside.height;
                j += 16
            ) {
                this.GroundOutsideMountPos.set(
                    getMountIDByPos(i, j),
                    undefined
                );
            }
        }

        ground_inside.forEach((e) => {
            for (var i = e.x + 16; i < e.x + e.width; i += 16) {
                for (var j = e.y + 16; j < e.y + e.height; j += 16) {
                    this.GroundInsideMountPos.set(
                        getMountIDByPos(i, j),
                        undefined
                    );
                }
            }
        });

        let bottoml = mapTar.objects.find(
            (e) => e.name === "sec_building_place_2"
        );

        this.secondFloorBottomY = bottoml.y;
    }

    getMountPosByScene(s: CastleScene) {
        if (s === CastleScene.first) {
            return () => {
                return this.GroundInsideMountPos;
            };
        } else if (s === CastleScene.second) {
            return () => {
                return this.SecMountPos;
            };
        } else {
            return undefined;
        }
    }

    addBuilding(b: Building, mount: CastleScene) {
        let m: Map<number, Building>;

        switch (mount) {
            case CastleScene.firstOutSide:
                m = this.GroundOutsideMountPos;
                break;
            case CastleScene.second:
                m = this.SecMountPos;
                break;

            default:
                throw "invalid floor";
        }

        let xSize = b.width / 32;
        let ySize = b.height / 32;
        let x = b.x;
        let y = b.y;

        for (let i = 0; i < xSize; i++) {
            for (let j = 0; j < ySize; j++) {
                let r1 = m.set(getMountIDByPos(x, y + j * 16), b);
                let r2 = m.set(getMountIDByPos(x, y - j * 16), b);
                let r3 = m.set(getMountIDByPos(x + i * 16, y), b);
                let r4 = m.set(getMountIDByPos(x - i * 16, y), b);
                let r5 = m.set(getMountIDByPos(x + i * 16, y + j * 16), b);
                let r6 = m.set(getMountIDByPos(x - i * 16, y - j * 16), b);
                let r7 = m.set(getMountIDByPos(x + i * 16, y - j * 16), b);
                let r8 = m.set(getMountIDByPos(x - i * 16, y + j * 16), b);

                if (r1 && r2 && r3 && r4 && r5 && r6 && r7 && r8) {
                    continue;
                } else {
                    return false;
                }
            }
        }

        b.setDepth(BuildingZindex.outside);

        this.GroundOutSideBuilding.push(b);
    }

    addOutsideBuiding(b: Building) {
        this.addBuilding(b, CastleScene.firstOutSide);
    }

    hideCastleFloor(s: CastleScene) {
        switch (s) {
            case CastleScene.first:
                this.SecMountPos;
        }
    }

    update() {
        // get player position
        let s = this.scene;
        let p = this.scene.Map.playerCastleFloor;

        if (this.lastStaire !== s.Map.playerCastleFloor) {
            this.lastStaire = s.Map.playerCastleFloor;

            switch (this.lastStaire) {
                case CastleScene.second:
            }
        }

        switch (p) {
            case CastleScene.firstOutSide:
                this.scene.physics.collide(
                    this.scene.player,
                    this.GroundOutSideBuilding
                );
                break;
        }

        this.GroundOutSideBuilding.forEach((e) => {
            e.update();
        });
    }
}
