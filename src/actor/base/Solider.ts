import { Physics } from "phaser";
import Main from "../../game";
import { CastleScene } from "../../manager/MapManager";

export enum SoliderPosition {
    outside,
    firstLeft,
    firstRight,
    secondLeft,
    secondRight,
    secondBottomLeft,
    secondBottomRight,
    leftDoor,
    centerDoor,
    rightDoor,
}

export enum SoldierTarget {
    fixDoor,
}

export interface SoliderDefine {
    name: string;
    idle_anim: string;
    run_anim: string;
    size: { width: number; height: number };
    speedRange: { base: number; range: number }; // movement speed range
    scale?: number;
}

export interface SoliderMoveTarget {
    x: number;
    y: number;
    width: number;
    height: number;
    floor?: CastleScene;
}

export class Solider extends Physics.Arcade.Sprite {
    speed: number;
    private target: SoliderMoveTarget[];
    private targetReached: number;
    private targetCurrent: { x: number; y: number };
    currentFloor: CastleScene = CastleScene.firstOutSide;
    arrived: boolean = false;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        define: SoliderDefine
    ) {
        //@ts-ignore
        super(scene, x, y);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.getBody().setCollideWorldBounds(true);

        this.speed =
            define.speedRange.base + define.speedRange.range * Math.random();

        this.anims.play(define.run_anim);

        this.getMain().Soliders.addSolider(this);
    }

    protected checkFlip(): void {
        if (this.body.velocity.x < 0) {
            this.scaleX = -1;
        } else {
            this.scaleX = 1;
        }
    }

    protected getBody(): Physics.Arcade.Body {
        return this.body as Physics.Arcade.Body;
    }

    setMoveTarget(target: SoliderMoveTarget[]) {
        this.target = target;
        this.targetReached = 0;
        this.targetCurrent = {
            x: target[0].x + target[0].width * Math.random(),
            y: target[0].y + target[0].height * Math.random(),
        };
        this.setImmovable(false);
        this.arrived = false;
    }

    getFloorPosition() {
        let s = this.scene as Main;
        switch (this.currentFloor) {
            case CastleScene.first:
                if (this.x < s.Map.centerX) {
                    return SoliderPosition.firstLeft;
                } else {
                    return SoliderPosition.firstRight;
                }
            case CastleScene.second:
                if (this.x > s.Map.centerX) {
                    if (this.y < s.Building.secondFloorBottomY) {
                        return SoliderPosition.secondBottomRight;
                    } else {
                        return SoliderPosition.secondRight;
                    }
                } else {
                    if (this.y < s.Building.secondFloorBottomY) {
                        return SoliderPosition.secondBottomLeft;
                    } else {
                        return SoliderPosition.secondLeft;
                    }
                }
            case CastleScene.firstOutSide:
                return SoliderPosition.outside;
            case CastleScene.doorLooby:
                if (
                    this.x > s.Gates.gate1FrontReact.x &&
                    this.x <
                        s.Gates.gate1FrontReact.x +
                            s.Gates.gate1FrontReact.width
                ) {
                    return SoliderPosition.leftDoor;
                }
                if (
                    this.x > s.Gates.gate2FrontReact.x &&
                    this.x <
                        s.Gates.gate2FrontReact.x +
                            s.Gates.gate2FrontReact.width
                ) {
                    return SoliderPosition.centerDoor;
                }
                if (
                    this.x > s.Gates.gate3FrontReact.x &&
                    this.x <
                        s.Gates.gate3FrontReact.x +
                            s.Gates.gate3FrontReact.width
                ) {
                    return SoliderPosition.rightDoor;
                }

                throw "solider invalid position";
            default:
                throw "solider should never in this position";
        }
    }

    getMain(): Main {
        return this.scene as Main;
    }

    update() {
        if (this.arrived) {
            return;
        }

        if (
            this.target !== undefined &&
            this.targetReached < this.target.length
        ) {
            // check if target reached
            let t = this.target[this.targetReached];

            if (
                (Math.abs(this.x - t.x) < 5 ||
                    Math.abs(this.x - t.x - t.width) < 5 ||
                    (this.x > t.x && this.x < t.x + t.width)) &&
                (Math.abs(this.y - t.y) < 5 ||
                    Math.abs(this.y - t.y - t.height) < 5 ||
                    (this.y > t.y && this.y < t.y + t.height))
            ) {
                // target reached
                let n = this.target[this.targetReached + 1];

                if (!n) {
                    this.arrived = true;
                    this.setVelocity(0);
                    this.setImmovable();
                    return;
                }

                this.targetReached += 1;

                this.targetCurrent = {
                    x: n.x + n.width * Math.random(),
                    y: n.y + n.height * Math.random(),
                };

                if (n.floor !== undefined) {
                    this.currentFloor = n.floor;
                }

                this.scene.physics.moveTo(
                    this,
                    this.targetCurrent.x,
                    this.targetCurrent.y,
                    this.speed
                );
            } else {
                this.scene.physics.moveTo(
                    this,
                    this.targetCurrent.x,
                    this.targetCurrent.y,
                    this.speed
                );
            }
        }
    }
}
