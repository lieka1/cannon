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
import Main from "../game";
import { GateManager } from "./GateManager";

const BigZombieBuilder = (
    scene: Main,
    portal: EnemyPortal,
    target: Phaser.GameObjects.Rectangle,
    targetPos: { x: number; y: number },
    target1: Phaser.GameObjects.Rectangle,
    targetPos1: { x: number; y: number },
    gateIndex: number
) => {
    return new BigZombie(
        scene,
        portal,
        target,
        targetPos,
        target1,
        targetPos1,
        gateIndex
    );
};
const ChortBuilder = (
    scene: Main,
    portal: EnemyPortal,
    target: Phaser.GameObjects.Rectangle,
    targetPos: { x: number; y: number },
    target1: Phaser.GameObjects.Rectangle,
    targetPos1: { x: number; y: number },
    gateIndex: number
) => {
    return new Chort(
        scene,
        portal,
        target,
        targetPos,
        target1,
        targetPos1,
        gateIndex
    );
};
const GoblinBuilder = (
    scene: Main,
    portal: EnemyPortal,
    target: Phaser.GameObjects.Rectangle,
    targetPos: { x: number; y: number },
    target1: Phaser.GameObjects.Rectangle,
    targetPos1: { x: number; y: number },
    gateIndex: number
) => {
    return new Goblin(
        scene,
        portal,
        target,
        targetPos,
        target1,
        targetPos1,
        gateIndex
    );
};
const IceZombieBuilder = (
    scene: Main,
    portal: EnemyPortal,
    target: Phaser.GameObjects.Rectangle,
    targetPos: { x: number; y: number },
    target1: Phaser.GameObjects.Rectangle,
    targetPos1: { x: number; y: number },
    gateIndex: number
) => {
    return new IceZombie(
        scene,
        portal,
        target,
        targetPos,
        target1,
        targetPos1,
        gateIndex
    );
};
const ImpBuilder = (
    scene: Main,
    portal: EnemyPortal,
    target: Phaser.GameObjects.Rectangle,
    targetPos: { x: number; y: number },
    target1: Phaser.GameObjects.Rectangle,
    targetPos1: { x: number; y: number },
    gateIndex: number
) => {
    return new Imp(
        scene,
        portal,
        target,
        targetPos,
        target1,
        targetPos1,
        gateIndex
    );
};
const MaskedOrcBuilder = (
    scene: Main,
    map: Phaser.Tilemaps.TilemapLayer,
    portal: EnemyPortal,
    target: Phaser.GameObjects.Rectangle,
    targetPos: { x: number; y: number },
    target1: Phaser.GameObjects.Rectangle,
    targetPos1: { x: number; y: number },
    gateIndex: number
) => {
    return new MaskedOrc(
        scene,
        portal,
        target,
        targetPos,
        target1,
        targetPos1,
        gateIndex
    );
};
const MuddyBuilder = (
    scene: Main,
    portal: EnemyPortal,
    target: Phaser.GameObjects.Rectangle,
    targetPos: { x: number; y: number },
    target1: Phaser.GameObjects.Rectangle,
    targetPos1: { x: number; y: number },
    gateIndex: number
) => {
    return new Muddy(
        scene,
        portal,
        target,
        targetPos,
        target1,
        targetPos1,
        gateIndex
    );
};
const NecormancerBuilder = (
    scene: Main,
    map: Phaser.Tilemaps.TilemapLayer,
    portal: EnemyPortal,
    target: Phaser.GameObjects.Rectangle,
    targetPos: { x: number; y: number },
    target1: Phaser.GameObjects.Rectangle,
    targetPos1: { x: number; y: number },
    gateIndex: number
) => {
    return new Necormancer(
        scene,
        portal,
        target,
        targetPos,
        target1,
        targetPos1,
        gateIndex
    );
};
const OgreBuilder = (
    scene: Main,
    map: Phaser.Tilemaps.TilemapLayer,
    portal: EnemyPortal,
    target: Phaser.GameObjects.Rectangle,
    targetPos: { x: number; y: number },
    target1: Phaser.GameObjects.Rectangle,
    targetPos1: { x: number; y: number },
    gateIndex: number
) => {
    return new Ogre(
        scene,
        portal,
        target,
        targetPos,
        target1,
        targetPos1,
        gateIndex
    );
};
const OrcShamanBuilder = (
    scene: Main,
    map: Phaser.Tilemaps.TilemapLayer,
    portal: EnemyPortal,
    target: Phaser.GameObjects.Rectangle,
    targetPos: { x: number; y: number },
    target1: Phaser.GameObjects.Rectangle,
    targetPos1: { x: number; y: number },
    gateIndex: number
) => {
    return new OrcShaman(
        scene,
        portal,
        target,
        targetPos,
        target1,
        targetPos1,
        gateIndex
    );
};
const OrcWarriorBuilder = (
    scene: Main,
    portal: EnemyPortal,
    target: Phaser.GameObjects.Rectangle,
    targetPos: { x: number; y: number },
    target1: Phaser.GameObjects.Rectangle,
    targetPos1: { x: number; y: number },
    gateIndex: number
) => {
    return new OrcWarrior(
        scene,
        portal,
        target,
        targetPos,
        target1,
        targetPos1,
        gateIndex
    );
};
const SkeletBuilder = (
    scene: Main,
    portal: EnemyPortal,
    target: Phaser.GameObjects.Rectangle,
    targetPos: { x: number; y: number },
    target1: Phaser.GameObjects.Rectangle,
    targetPos1: { x: number; y: number },
    gateIndex: number
) => {
    return new Skelet(
        scene,
        portal,
        target,
        targetPos,
        target1,
        targetPos1,
        gateIndex
    );
};
const SwampyBuilder = (
    scene: Main,
    portal: EnemyPortal,
    target: Phaser.GameObjects.Rectangle,
    targetPos: { x: number; y: number },
    target1: Phaser.GameObjects.Rectangle,
    targetPos1: { x: number; y: number },
    gateIndex: number
) => {
    return new Swampy(
        scene,
        portal,
        target,
        targetPos,
        target1,
        targetPos1,
        gateIndex
    );
};
const TinyZomieBuilder = (
    scene: Main,
    portal: EnemyPortal,
    target: Phaser.GameObjects.Rectangle,
    targetPos: { x: number; y: number },
    target1: Phaser.GameObjects.Rectangle,
    targetPos1: { x: number; y: number },
    gateIndex: number
) => {
    return new TinyZomie(
        scene,
        portal,
        target,
        targetPos,
        target1,
        targetPos1,
        gateIndex
    );
};
const WogolBuilder = (
    scene: Main,
    portal: EnemyPortal,
    target: Phaser.GameObjects.Rectangle,
    targetPos: { x: number; y: number },
    target1: Phaser.GameObjects.Rectangle,
    targetPos1: { x: number; y: number },
    gateIndex: number
) => {
    return new Wogol(
        scene,
        portal,
        target,
        targetPos,
        target1,
        targetPos1,
        gateIndex
    );
};
const ZombieBuilder = (
    scene: Main,
    portal: EnemyPortal,
    target: Phaser.GameObjects.Rectangle,
    targetPos: { x: number; y: number },
    target1: Phaser.GameObjects.Rectangle,
    targetPos1: { x: number; y: number },
    gateIndex: number
) => {
    return new Zombie(
        scene,
        portal,
        target,
        targetPos,
        target1,
        targetPos1,
        gateIndex
    );
};

interface EnemyWave {
    builder: (
        scene: Phaser.Scene,
        portal: EnemyPortal,
        target: Phaser.GameObjects.Rectangle,
        targetPos: { x: number; y: number },
        target1: Phaser.GameObjects.Rectangle,
        targetPos1: { x: number; y: number },
        gateIndex: number
    ) => Enemy;

    size: number;
    nextSendTime: number;
}

interface EnemyLevel {
    space: number; // wait how long to send next enemy
    time: number; // max time in this round
    enemys: EnemyWave[];
    total: number;
}

const LevelEnemyDefine: EnemyLevel[] = [
    // first idel wave
    {
        enemys: [
            {
                builder: TinyZomieBuilder,
                size: 100,
                nextSendTime: 5,
            },
            {
                builder: GoblinBuilder,
                size: 100,
                nextSendTime: 5,
            },
        ],
        space: 5,
        time: Number.MAX_VALUE,
        total: -1,
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
    sended: number = 0; // how many are sended
    map: Phaser.Tilemaps.TilemapLayer;
    gate: GateManager;

    mapSize: { x: number; y: number };
    scene: Main;
    enemys: Array<Enemy | undefined> = [];
    emptyPlace: number[] = [];

    portalLeft: EnemyPortal;
    portalRight: EnemyPortal;
    lastGen: number = 0; // last time genrate a enemy

    constructor(
        scene: Main,
        map: Phaser.Tilemaps.TilemapLayer,
        gates: GateManager
    ) {
        this.scene = scene;
        this.mapSize = { x: map.width, y: map.height };
        this.map = map;
        this.gate = gates;

        LevelEnemyDefine.forEach((e, i) => {
            e.total = this.getWaveTotalEnmeys(i);
        });
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
            this.enemys.push(b);
            b.setId(this.enemys.length - 1);
        } else {
            // get empty index
            let r = this.emptyPlace.pop();
            this.enemys[r] = b;

            // set id
            b.setId(r);
        }
    }

    getEnemy() {
        return this.enemys;
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

    getWaveInfo() {
        return LevelEnemyDefine[this.wave];
    }

    getCurrentEnemys() {
        return this.enemys.length - this.emptyPlace.length;
    }

    getWaveNextEnemyData() {
        let r = 0;
        for (let i in LevelEnemyDefine[this.wave].enemys) {
            let e = LevelEnemyDefine[this.wave].enemys[i];

            r += e.size;
            if (this.sended <= r) {
                return e;
            }
        }

        throw "no enemy can be build";
    }

    getWaveTotalEnmeys(i: number) {
        let r = 0;
        LevelEnemyDefine[i].enemys.forEach((e) => {
            r += e.size;
        });

        return r;
    }

    createEnemy() {
        if (this.getWaveInfo().total - this.sended > 0) {
            let eInfo = this.getWaveNextEnemyData();
            if (Date.now() - this.lastGen > eInfo.nextSendTime * 1000) {
                let tarGate = this.gate.getRandGate();

                let newItem = eInfo.builder(
                    this.scene,
                    this.randPortal(),
                    tarGate[0],
                    tarGate[1],
                    tarGate[2],
                    tarGate[3],
                    tarGate[4]
                );

                this.addNew(newItem);

                this.scene.physics.moveTo(
                    newItem,
                    tarGate[2].x,
                    tarGate[2].y,
                    newItem.speed
                );

                this.sended += 1;

                this.lastGen = Date.now();
            }
        } else {
            if (this.getCurrentEnemys() === 0) {
                if (LevelEnemyDefine.length - 1 > this.wave) {
                    this.wave += 1;
                    this.sended = 0;
                }
            }
        }
    }

    removeDead(id: number) {
        this.enemys[id] = undefined;
        this.emptyPlace.push(id);
    }

    update() {
        this.createEnemy();
        this.enemys.forEach((e: Enemy) => {
            if (!e) return;

            e.update();

            // movment
            e.checkArrive();

            // check if reach the gate
            e.dealDamage();

            // check health
            if (e.checkDead()) {
                e.removeCollider(this.scene);
                this.removeDead(e.id);

                // add gold to player
                this.scene.gold.get(e.define.gold);
            }
        });
    }
}
