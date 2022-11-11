import { Bullet } from "../actor/base/bullet";
import Enemy from "../actor/base/Enemy";
import { EnemyManager } from "./EnemyManager";

export class BulletManager {
    private data: Bullet[] = [];
    scene: Phaser.Scene;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    addNew(b: Bullet) {
        this.data.push(b);
    }

    getBullets() {
        return this.data;
    }

    remove(id: number) {
        this.data[id] = {} as any;
    }

    update(enemys: EnemyManager) {
        this.scene.physics.overlap(this.data, enemys.data, (b: Bullet, e: Enemy)=> {
            b.hit(e);

            if (b.finished()) {
                console.log("finishs")
                b.destroy();
                this.remove(b.id);
            }
        })

    }
}
