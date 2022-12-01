import { Bullet } from "../actor/base/bullet";
import Enemy from "../actor/base/Enemy";
import { EnemyManager } from "./EnemyManager";

let removed = 0;
let added = 0;

export class BulletManager {
    data: Bullet[] = [];
    scene: Phaser.Scene;
    emptyPlace: number[] = [];

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    addNew(b: Bullet) {
        if (this.emptyPlace.length < 1) {
            // add new item
            this.data.push(b);
            b.setId(this.data.length - 1);
        } else {
            // get empty index
            let r = this.emptyPlace.pop();
            this.data[r] = b;

            // set id
            b.setId(r);
        }
    }

    getBullets() {
        return this.data;
    }

    remove(id: number) {
        this.data[id] = undefined as any;
    }

    update(enemys: EnemyManager) {
        this.data.forEach((e) => {
            if (!e) return;

            this.scene.physics.overlap(
                e,
                enemys.enemys,
                (b: Bullet, e: Enemy) => {
                    b.hit(e);
                }
            );

            if (e.finished()) {
                e.destroy();
                this.remove(e.bId);
            }
        });
    }
}
