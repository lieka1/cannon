import { CannonBase } from "../actor/base/cannon";
import Enemy from "../actor/base/Enemy";
import Main from "../game";
import { BuildingZindex } from "./BuildingManager";
import { EnemyManager } from "./EnemyManager";
import { CastleScene } from "./MapManager";

const DistanceSquared = (x1: number, y1: number, x2: number, y2: number) => {
    var dx = x1 - x2;
    var dy = y1 - y2;

    return dx * dx + dy * dy;
};

export function getMountPosById(id: number) {
    return {
        x: id & 0b0000_0000_0000_1111_1111_1111,
        y: (id & 0b1111_1111_1111_0000_0000_0000) >> 12,
    };
}

export function getMountIDByPos(x: number, y: number) {
    return (y << 12) + x;
}

export function checkRoundAvaliable(
    tar: Map<number, Object>,
    posX: number,
    posY: number,
    paddingX: number,
    paddingY: number
): { hasItem: boolean; collideEdge: boolean } {
    let hasItem = false;
    for (let i = 0; i < paddingX; i++) {
        for (let j = 0; j < paddingY; j++) {
            if (i === 0 && j === 0) {
                let r = getMountIDByPos(posX, posY);
                if (!tar.has(r)) {
                    return { hasItem: true, collideEdge: true };
                } else {
                    continue;
                }
            }

            let r1 = tar.has(getMountIDByPos(posX, posY + j * 16));
            let r2 = tar.has(getMountIDByPos(posX, posY - j * 16));
            let r3 = tar.has(getMountIDByPos(posX + i * 16, posY));
            let r4 = tar.has(getMountIDByPos(posX - i * 16, posY));
            let r5 = tar.has(getMountIDByPos(posX + i * 16, posY + j * 16));
            let r6 = tar.has(getMountIDByPos(posX - i * 16, posY - j * 16));
            let r7 = tar.has(getMountIDByPos(posX + i * 16, posY - j * 16));
            let r8 = tar.has(getMountIDByPos(posX - i * 16, posY + j * 16));

            if (r1 && r2 && r3 && r4 && r5 && r6 && r7 && r8) {
                continue;
            } else {
                return { hasItem: true, collideEdge: true };
            }
        }
    }

    for (let i = 0; i < paddingX + 1; i++) {
        for (let j = 0; j < paddingY + 1; j++) {
            let r1 = tar.get(getMountIDByPos(posX, posY + j * 16));
            let r2 = tar.get(getMountIDByPos(posX, posY - j * 16));
            let r3 = tar.get(getMountIDByPos(posX + i * 16, posY));
            let r4 = tar.get(getMountIDByPos(posX - i * 16, posY));
            let r5 = tar.get(getMountIDByPos(posX + i * 16, posY + j * 16));
            let r6 = tar.get(getMountIDByPos(posX - i * 16, posY - j * 16));
            let r7 = tar.get(getMountIDByPos(posX + i * 16, posY - j * 16));
            let r8 = tar.get(getMountIDByPos(posX - i * 16, posY + j * 16));
            if (r1 || r2 || r3 || r4 || r5 || r6 || r7 || r8) {
                hasItem = true;
            }
        }
    }

    return { hasItem: hasItem, collideEdge: false };
}

export class CannonManager {
    cannons: Array<CannonBase | undefined> = [];
    emptyPlace: number[] = [];
    scene: Main;
    lastUpdate: number;
    cannonMountPos: Map<number, CannonBase | undefined> = new Map();
    lastShow: boolean = true; // if cannon is showed in last frame

    constructor(scene: Main) {
        this.scene = scene;

        // load mount pos
        let mountLayer = this.scene.Map.map.getObjectLayer("cannon_mount");

        mountLayer.objects.forEach((e) => {
            for (var i = e.x + 16; i < e.x + e.width; i += 16) {
                this.cannonMountPos.set(getMountIDByPos(i, e.y), undefined);
            }
        });
    }

    private canMountCannon(i: number) {
        return (
            this.cannonMountPos.has(i) &&
            this.cannonMountPos.get(i) !== undefined
        );
    }

    canMount(x: number, y: number) {
        if (!this.canMountCannon(getMountIDByPos(x, y))) {
            return false;
        }
        if (!this.canMountCannon(getMountIDByPos(x, y - 16))) {
            return false;
        }
        if (!this.canMountCannon(getMountIDByPos(x - 16, y))) {
            return false;
        }
        if (!this.canMountCannon(getMountIDByPos(x - 16, y - 16))) {
            return false;
        }
        if (!this.canMountCannon(getMountIDByPos(x + 16, y + 16))) {
            return false;
        }
        if (!this.canMountCannon(getMountIDByPos(x, y + 16))) {
            return false;
        }
        if (!this.canMountCannon(getMountIDByPos(x + 16, y))) {
            return false;
        }
        if (!this.canMountCannon(getMountIDByPos(x - 16, y + 16))) {
            return false;
        }
        if (!this.canMountCannon(getMountIDByPos(x + 16, y - 16))) {
            return false;
        }

        return true;
    }

    setMountItemExist(x: number, y: number, cannonBase: CannonBase) {
        let id = getMountIDByPos(x, y);
        if (this.cannonMountPos.has(id)) {
            this.cannonMountPos.set(id, cannonBase);
        }
    }

    setMountPos(x: number, y: number, cannonBase: CannonBase) {
        this.setMountItemExist(x, y, cannonBase);
        this.setMountItemExist(x + 16, y + 16, cannonBase);
        this.setMountItemExist(x + 16, y - 16, cannonBase);
        this.setMountItemExist(x - 16, y + 16, cannonBase);
        this.setMountItemExist(x - 16, y - 16, cannonBase);
        this.setMountItemExist(x, y - 16, cannonBase);
        this.setMountItemExist(x - 16, y, cannonBase);
        this.setMountItemExist(x + 16, y, cannonBase);
        this.setMountItemExist(x, y + 16, cannonBase);
    }

    addNewCannon(x: number, y: number) {
        let b = new CannonBase(this.scene, x, y);

        if (this.emptyPlace.length < 1) {
            // add new item
            this.cannons.push(b);
        } else {
            // get empty index
            let r = this.emptyPlace.pop();
            this.cannons[r] = b;
        }

        b.setDepth(BuildingZindex.topFloorItem);

        this.setMountPos(x, y, b);
    }

    getCannons() {
        return this.cannons;
    }

    closest(source: any, targets: Enemy[]) {
        var min = Number.MAX_VALUE;
        var closest = null;
        var x = source.x;
        var y = source.y;
        var len = targets.length;

        for (var i = 0; i < len; i++) {
            var target = targets[i];
            if (!target) continue;

            var body = target.body;

            var distance = DistanceSquared(x, y, body.center.x, body.center.y);

            if (distance < min) {
                closest = target;
                min = distance;
            }
        }

        return closest;
    }

    update(time: number, _: number, enemys: EnemyManager) {
        // check cannon base collide with player

        let s = this.scene as Main;

        let showCannon = true;
        if (s.Map.playerCastleFloor != CastleScene.topOutside) {
            showCannon = false;
        }

        this.cannons.forEach((e) => {
            if (!e) return;

            if (this.lastShow !== showCannon) {
                if (showCannon) {
                    e.show();
                } else {
                    e.hide();
                }
            }

            this.scene.physics.collide(e, this.scene.player);

            // get cannon barrel
            let b = e.getBarrel();

            if (!b) return;

            // find closest enemy
            if (!b.hasTarget()) {
                let tar = this.closest(b, enemys.enemys) as Enemy;

                if (!tar) {
                    return;
                }

                b.setTarget(tar, time);
            } else {
                b.setRotation(b.targetAngle - 3.14 / 2);

                b.shot(time, s.bullets);
            }
        });

        this.lastUpdate = time;
        this.lastShow = showCannon;
    }
}
