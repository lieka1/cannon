import { CannonBase } from "../actor/base/cannon";
import Enemy from "../actor/base/Enemy";
import Main from "../game";
import { EnemyManager } from "./EnemyManager";
import { CastleScene } from "./MapManager";

const DistanceSquared = (x1: number, y1: number, x2: number, y2: number) => {
    var dx = x1 - x2;
    var dy = y1 - y2;

    return dx * dx + dy * dy;
};

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
                this.cannonMountPos.set(
                    this.getMountIDByPos(i, e.y),
                    undefined
                );
            }
        });
    }

    getMountIDByPos = (x: number, y: number) => {
        return (y << 12) + x;
    };

    getMountPosById(id: number) {
        return {
            x: id & 0b0000_0000_0000_1111_1111_1111,
            y: (id & 0b1111_1111_1111_0000_0000_0000) >> 12,
        };
    }

    private canMountCannon(i: number) {
        return (
            this.cannonMountPos.has(i) &&
            this.cannonMountPos.get(i) !== undefined
        );
    }

    canMount(x: number, y: number) {
        if (!this.canMountCannon(this.getMountIDByPos(x, y))) {
            return false;
        }
        if (!this.canMountCannon(this.getMountIDByPos(x, y - 16))) {
            return false;
        }
        if (!this.canMountCannon(this.getMountIDByPos(x - 16, y))) {
            return false;
        }
        if (!this.canMountCannon(this.getMountIDByPos(x - 16, y - 16))) {
            return false;
        }
        if (!this.canMountCannon(this.getMountIDByPos(x + 16, y + 16))) {
            return false;
        }
        if (!this.canMountCannon(this.getMountIDByPos(x, y + 16))) {
            return false;
        }
        if (!this.canMountCannon(this.getMountIDByPos(x + 16, y))) {
            return false;
        }
        if (!this.canMountCannon(this.getMountIDByPos(x - 16, y + 16))) {
            return false;
        }
        if (!this.canMountCannon(this.getMountIDByPos(x + 16, y - 16))) {
            return false;
        }

        return true;
    }

    setMountItemExist(x: number, y: number, cannonBase: CannonBase) {
        let id = this.getMountIDByPos(x, y);
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
                let tar = this.closest(b, enemys.data) as Enemy;

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
