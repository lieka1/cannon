import { CannonBase } from "../actor/base/cannon";
import Enemy from "../actor/base/Enemy";
import { BigDemon } from "../actor/BigDemon";
import { EnemyPortal } from "../actor/Portal";

export class EnemyManager {
    wave: number = 0;
    sended: boolean = false; // if this wave enemy sended
    map: Phaser.Tilemaps.TilemapLayer;

    mapSize: { x: number; y: number };
    scene: Phaser.Scene;
    data: Array<Enemy | undefined> = [];
    emptyPlace: number[] = [];

    portalLeft: EnemyPortal;
    portalRight: EnemyPortal;

    constructor(scene: Phaser.Scene, map: Phaser.Tilemaps.TilemapLayer) {
        this.scene = scene;
        this.mapSize = { x: map.width, y: map.height };
        this.map = map;
    }

    initProtal() {
        // create portal on edge of the map
        this.portalLeft = new EnemyPortal(
            this.scene,
            15,
            this.mapSize.y - 32,
            false,
            "green"
        );
        this.portalRight = new EnemyPortal(
            this.scene,
            this.mapSize.x - 16,
            this.mapSize.y - 32,
            true,
            "purple"
        );
    }

    addNew(b: Enemy) {
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

    getEnemy() {
        return this.data;
    }

    createEnemy() {
        // send some in green portal
        for (var i = 0; i < 10; i++) {
            this.addNew(new BigDemon(this.scene, this.map, this.portalLeft));
        }

        // send some in purple portal
        // for (var i = 0; i < 10; i++) {}
    }

    enemyDead() {}

    update() {
        if (!this.sended) {
            this.createEnemy();
            this.sended = true;
        }

        this.scene.physics.collide(new Array(this.data) as any);
    }
}
