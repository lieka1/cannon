import { CannonBase } from "../actor/base/cannon";
import Enemy from "../actor/base/Enemy";
import { BigDemon } from "../actor/enemy/BigDemon";
import { EnemyPortal } from "../actor/enemy/Portal";
import { GateManager } from "./GateManager";

interface EnemyLevel {
    power: number; // total power of enemy
    count: number; // count of enemy
}

const LevelEnemyDefine: EnemyLevel[] = [
    {
        power: 10,
        count: 300,
    },
];

export class EnemyManager {
    wave: number = 0;
    remain: EnemyLevel = LevelEnemyDefine[0]; // if this wave enemy sended
    map: Phaser.Tilemaps.TilemapLayer;
    gate: GateManager;

    mapSize: { x: number; y: number };
    scene: Phaser.Scene;
    data: Array<Enemy | undefined> = [];
    emptyPlace: number[] = []; // todo: add killed enemy to empty place

    portalLeft: EnemyPortal;
    portalRight: EnemyPortal;

    constructor(
        scene: Phaser.Scene,
        map: Phaser.Tilemaps.TilemapLayer,
        gates: GateManager
    ) {
        this.scene = scene;
        this.mapSize = { x: map.width, y: map.height };
        this.map = map;
        this.gate = gates;
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
        b.addCollider(this);
        
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

    randPortal() {
        let r = Date.now() % 2;

        switch (r) {
            case 0:
                return this.portalLeft;
            case 1:
                return this.portalRight;
        }
    }

    createEnemy() {
        if (this.remain.count > 0) {
            let tarGate = this.gate.getRandGate();

            let newItem = new BigDemon(
                this.scene,
                this.map,
                this.randPortal(),
                tarGate[0],
                tarGate[1],
                tarGate[2],
                tarGate[3]
            );

            this.addNew(newItem);

            this.scene.physics.moveTo(
                newItem,
                tarGate[2].x,
                tarGate[2].y,
                newItem.speed
            );

            this.remain.count -= 1;
        }
    }

    removeDead(id: number) {
        this.data[id] = undefined;
        this.emptyPlace.push(id);
    }

    update() {
        this.createEnemy();
        this.data.forEach((e: Enemy) => {
            if (!e) return;

            // movment
            e.checkArrive();

            // check health
            if (e.checkDead()) {
                console.log("dead");
                this.removeDead(e.id);
            }
        });
    }
}
