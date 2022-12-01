import Main from "../game";
import { SceneState, Ui } from "../ui";

export class GateManager {
    scene: Main;

    hp1: number = 100;
    hp2: number = 100;
    hp3: number = 100;

    totalhp1: number = 100;
    totalhp2: number = 100;
    totalhp3: number = 100;

    gate1: Phaser.GameObjects.Rectangle;
    gate2: Phaser.GameObjects.Rectangle;
    gate3: Phaser.GameObjects.Rectangle;

    gate1React: { x: number; y: number; width: number; height: number };
    gate2React: { x: number; y: number; width: number; height: number };
    gate3React: { x: number; y: number; width: number; height: number };

    gate1Front: Phaser.GameObjects.Rectangle;
    gate2Front: Phaser.GameObjects.Rectangle;
    gate3Front: Phaser.GameObjects.Rectangle;

    gate1FrontReact: { x: number; y: number; width: number; height: number };
    gate2FrontReact: { x: number; y: number; width: number; height: number };
    gate3FrontReact: { x: number; y: number; width: number; height: number };

    constructor(scene: Main, map: Phaser.Tilemaps.Tilemap) {
        // init door
        this.scene = scene;

        const gates = map.getObjectLayer("door");

        this.gate2 = scene.add.rectangle(
            gates.objects[0].x + gates.objects[0].width / 2,
            gates.objects[0].y + gates.objects[0].height / 4,
            gates.objects[0].width,
            gates.objects[0].height
        );
        this.gate1 = scene.add.rectangle(
            gates.objects[1].x + gates.objects[1].width / 2,
            gates.objects[1].y + gates.objects[1].height / 4,
            gates.objects[1].width,
            gates.objects[1].height
        );
        this.gate3 = scene.add.rectangle(
            gates.objects[2].x + gates.objects[2].width / 2,
            gates.objects[2].y + gates.objects[2].height / 4,
            gates.objects[2].width,
            gates.objects[2].height
        );

        this.gate2React = {
            x: gates.objects[0].x,
            y: gates.objects[0].y,
            width: gates.objects[0].width,
            height: gates.objects[0].height,
        };

        this.gate1React = {
            x: gates.objects[1].x,
            y: gates.objects[1].y,
            width: gates.objects[1].width,
            height: gates.objects[1].height,
        };

        this.gate3React = {
            x: gates.objects[2].x,
            y: gates.objects[2].y,
            width: gates.objects[2].width,
            height: gates.objects[2].height,
        };

        scene.physics.add.existing(this.gate1);
        scene.physics.add.existing(this.gate2);
        scene.physics.add.existing(this.gate3);

        const gatesFilter = map.getObjectLayer("target");

        this.gate3FrontReact = {
            x: gatesFilter.objects[0].x + gatesFilter.objects[0].width / 6,
            y: gatesFilter.objects[0].y,
            width: (gatesFilter.objects[0].width * 2) / 3,
            height: gatesFilter.objects[0].height,
        };

        this.gate2FrontReact = {
            x: gatesFilter.objects[1].x + gatesFilter.objects[1].width / 6,
            y: gatesFilter.objects[1].y,
            width: (gatesFilter.objects[1].width * 2) / 3,
            height: gatesFilter.objects[1].height,
        };

        this.gate1FrontReact = {
            x: gatesFilter.objects[2].x + gatesFilter.objects[2].width / 6,
            y: gatesFilter.objects[2].y,
            width: (gatesFilter.objects[2].width * 2) / 3,
            height: gatesFilter.objects[2].height,
        };

        this.gate3Front = scene.add.rectangle(
            gatesFilter.objects[0].x + gatesFilter.objects[0].width / 2,
            gatesFilter.objects[0].y + gatesFilter.objects[0].height / 2,
            gatesFilter.objects[0].width,
            gatesFilter.objects[0].height
        );
        this.gate2Front = scene.add.rectangle(
            gatesFilter.objects[1].x + gatesFilter.objects[1].width / 2,
            gatesFilter.objects[1].y + gatesFilter.objects[1].height / 2,
            gatesFilter.objects[1].width,
            gatesFilter.objects[1].height
        );
        this.gate1Front = scene.add.rectangle(
            gatesFilter.objects[2].x + gatesFilter.objects[2].width / 2,
            gatesFilter.objects[2].y + gatesFilter.objects[2].height / 2,
            gatesFilter.objects[2].width,
            gatesFilter.objects[2].height
        );

        scene.physics.add.existing(this.gate1Front);
        scene.physics.add.existing(this.gate2Front);
        scene.physics.add.existing(this.gate3Front);
    }

    isGateFullHp(g: number) {
        switch (g) {
            case 0:
                if (this.totalhp1 - this.hp1 !== 0) {
                    return false;
                }
                return true;
            case 1:
                if (this.totalhp2 - this.hp2 !== 0) {
                    return false;
                }
                return true;
            case 2:
                if (this.totalhp3 - this.hp3 !== 0) {
                    return false;
                }
                return true;
            default:
                throw "invalid gate index";
        }
    }

    getFixableGate() {
        let change1 = this.totalhp1 - this.hp1;
        let change2 = this.totalhp2 - this.hp2;
        let change3 = this.totalhp3 - this.hp3;

        if (change1 === 0 && change2 === 0 && change3 === 0) {
            return -1;
        }

        if (change1 > change2) {
            if (change2 > change3) {
                if (change1 > change3) {
                    return 0;
                } else {
                    return 2;
                }
            } else {
                return 0;
            }
        } else {
            if (change1 > change3) {
                return 1;
            } else {
                if (change2 > change3) {
                    return 1;
                } else {
                    return 2;
                }
            }
        }
    }

    getRandGate(): [
        Phaser.GameObjects.Rectangle,
        { x: number; y: number },
        Phaser.GameObjects.Rectangle,
        { x: number; y: number },
        number
    ] {
        let r = Date.now() % 3;

        switch (r) {
            case 0:
                return [
                    this.gate1,
                    {
                        x:
                            this.gate1React.x +
                            this.gate1React.width * Math.random(),
                        y: this.gate1React.y,
                    },
                    this.gate1Front,
                    {
                        x:
                            this.gate1FrontReact.x +
                            this.gate1FrontReact.width * Math.random(),
                        y:
                            this.gate1FrontReact.y +
                            this.gate1FrontReact.height * Math.random(),
                    },
                    0,
                ];
            case 1:
                return [
                    this.gate2,
                    {
                        x:
                            this.gate2React.x +
                            this.gate2React.width * Math.random(),
                        y: this.gate2React.y,
                    },
                    this.gate2Front,
                    {
                        x:
                            this.gate2FrontReact.x +
                            this.gate2FrontReact.width * Math.random(),
                        y:
                            this.gate2FrontReact.y +
                            this.gate2FrontReact.height * Math.random(),
                    },
                    1,
                ];
            case 2:
                return [
                    this.gate3,
                    {
                        x:
                            this.gate3React.x +
                            this.gate3React.width * Math.random(),
                        y: this.gate3React.y,
                    },
                    this.gate3Front,
                    {
                        x:
                            this.gate3FrontReact.x +
                            this.gate3FrontReact.width * Math.random(),
                        y:
                            this.gate3FrontReact.y +
                            this.gate3FrontReact.height * Math.random(),
                    },
                    2,
                ];
        }
    }

    healGate(gateIndex: number, percent: number) {
        switch (gateIndex) {
            case 0:
                this.hp1 += percent * this.totalhp1;
                break;
            case 1:
                this.hp2 += percent * this.totalhp2;
                break;
            case 2:
                this.hp3 += percent * this.totalhp3;
                break;
            // default:
            //     throw "invalid gate index";
        }
    }

    dealGateDamage(gateIndex: number, damage: number) {
        switch (gateIndex) {
            case 0:
                this.hp1 -= damage;
                break;
            case 1:
                this.hp2 -= damage;
                break;
            case 2:
                this.hp3 -= damage;
                break;
            // default:
            //     throw "invalid gate index";
        }
    }

    gameEnd() {
        this.scene.scene.pause("main");

        (this.scene.scene.get("ui") as Ui).navigateMainToEnd();
    }

    update() {
        if (this.hp1 < 0) {
            this.hp1 = 0;
            this.gameEnd();
        } else if (this.hp1 > this.totalhp1) {
            this.hp1 = this.totalhp1;
        }

        if (this.hp2 < 0) {
            this.hp1 = 0;
            this.gameEnd();
        } else if (this.hp2 > this.totalhp2) {
            this.hp2 = this.totalhp2;
        }

        if (this.hp3 < 0) {
            this.hp1 = 0;
            this.gameEnd();
        } else if (this.hp3 > this.totalhp3) {
            this.hp3 = this.totalhp3;
        }
    }
}
