import { CannonBase } from "../actor/base/cannon";
import Enemy from "../actor/base/Enemy";
import Main from "../game";
import { EnemyManager } from "./EnemyManager";

const DistanceSquared = (x1: number, y1: number, x2: number, y2: number) => {
    var dx = x1 - x2;
    var dy = y1 - y2;

    return dx * dx + dy * dy;
};

export class CannonManager {
    data: Array<CannonBase> = [];
    emptyPlace: number[] = [];
    scene: Phaser.Scene;
    lastUpdate: number;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    hasSpace(x: number, y: number) {}

    private addToEmpty(b: CannonBase) {
        if (this.emptyPlace.length < 1) {
            // add new item
            this.data.push(b);
        } else {
            // get empty index
            let r = this.emptyPlace.pop();
            this.data[r] = b;
        }
    }

    addNew(b: CannonBase) {
        let removed;
        this.scene.physics.overlap(
            b,
            this.data,
            (e1: CannonBase, _: CannonBase) => {
                removed = true;
                e1.destroy();
            }
        );

        if (!removed) {
            this.addToEmpty(b);
        }
    }

    getCannons() {
        return this.data;
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
        let s = this.scene as Main;

        this.data.forEach((e) => {
            // find closest enemy
            if (!e.hasTarget()) {
                let tar = this.closest(e, enemys.data) as Enemy;

                if (!tar) {
                    return;
                }

                e.setTarget(tar, time);
            } else {
                e.shot(time, s.bullets);
            }
        });

        this.lastUpdate = time;
    }
}
