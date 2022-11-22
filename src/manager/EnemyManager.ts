import { CannonBase } from "../actor/base/cannon";
import Enemy from "../actor/base/Enemy";
import { BigDemon } from "../actor/enemy/BigDemon";
import { BigZombie } from "../actor/enemy/BigZombie";
import { Chort } from "../actor/enemy/Chort";
import { Goblin } from "../actor/enemy/Goblin";
import { IceZombie } from "../actor/enemy/IceZombie";
import { Imp } from "../actor/enemy/Imp";
import { MaskedOrc } from "../actor/enemy/MaskedOrc";
import { Muddy } from "../actor/enemy/Muddy";
import { Necormancer } from "../actor/enemy/necormancer";
import { Ogre } from "../actor/enemy/Ogre";
import { OrcShaman } from "../actor/enemy/OrcShaman";
import { OrcWarrior } from "../actor/enemy/OrcWarrior";
import { EnemyPortal } from "../actor/enemy/Portal";
import { Skelet } from "../actor/enemy/skelet";
import { Swampy } from "../actor/enemy/swampy";
import { TinyZomie } from "../actor/enemy/TinyZombie";
import { Wogol } from "../actor/enemy/Wogol";
import { Zombie } from "../actor/enemy/Zombie";
import { GateManager } from "./GateManager";

interface EnemyLevel {
    power: number; // total power of enemy
    count: number; // count of enemy
    space: number; // wait how long to send next enemy
    time: number; // max time in this round
}

const LevelEnemyDefine: EnemyLevel[] = [
    // first idel wave
    {
        power: 0,
        count: 2,
        space: 5,
        time: Number.MAX_VALUE,
    },
    {
        power: 10,
        count: 2,
        space: 5,
        time: 5,
    },
];

export class EnemyManager {
    enmyClasses = [
        BigZombie,
        Chort,
        Goblin,
        IceZombie,
        Imp,
        MaskedOrc,
        Muddy,
        Necormancer,
        Ogre,
        OrcShaman,
        OrcWarrior,
        Skelet,
        Swampy,
        TinyZomie,
        Wogol,
        Zombie,
    ];
    wave: number = 0;
    remain: EnemyLevel = LevelEnemyDefine[1]; // if this wave enemy sended
    map: Phaser.Tilemaps.TilemapLayer;
    gate: GateManager;

    mapSize: { x: number; y: number };
    scene: Phaser.Scene;
    data: Array<Enemy | undefined> = [];
    emptyPlace: number[] = [];

    portalLeft: EnemyPortal;
    portalRight: EnemyPortal;
    lastGen: number = 0; // last time genrate a enemy

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

    getInfo(): EnemyLevel {
        let r = LevelEnemyDefine[this.wave];
        if (!r) {
            return LevelEnemyDefine[0];
        }

        return r;
    }

    addNew(b: Enemy) {
        b.addCollider(this);

        if (this.emptyPlace.length === 0) {
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
            if (this.lastGen > 5) {
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

                this.lastGen = 0;
            } else {
                this.lastGen += 1;
            }
        }

        if (this.emptyPlace.length > 280 && this.remain.count < 20) {
            this.remain.count += 280;
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
                e.removeCollider(this.scene);
                this.removeDead(e.id);
            }
        });

        // console.log(this.scene.physics.world.colliders.len)
    }
}
