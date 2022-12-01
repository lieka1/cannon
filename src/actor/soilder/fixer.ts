import Main from "../../game";
import { BuildingZindex } from "../../manager/BuildingManager";
import { CastleScene } from "../../manager/MapManager";
import { SceneState } from "../../ui";
import {
    Solider,
    SoliderDefine,
    SoliderMoveTarget,
    SoliderPosition,
} from "../base/Solider";
import { CastleStair } from "../floor/CastleStair";

const FixerDefine: SoliderDefine = {
    name: "fixer",
    idle_anim: "knight_1_idle",
    run_anim: "knight_0_run",
    size: { width: 16, height: 16 },
    speedRange: { base: 100, range: 20 },
};

export class Fixer extends Solider {
    targetGate: number | undefined;
    lastFix: number = 0;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, FixerDefine);

        this.setDepth(BuildingZindex.firstFloor);
    }

    gotoGate(t: number) {
        this.targetGate = t;

        let s = this.scene as Main;
        let m = s.Map;
        let ga = s.Gates;

        let r: SoliderMoveTarget[] = [];

        const addPos = (
            a: { x: number; y: number; width: number; height: number },
            f?: CastleScene
        ) => {
            r.push({
                x: a.x,
                y: a.y,
                width: a.width,
                height: a.height,
                floor: f,
            });
        };

        const addPosNoHight = (
            a: { x: number; y: number; width: number; height: number },
            f?: CastleScene
        ) => {
            r.push({
                x: a.x,
                y: a.y,
                width: a.width,
                height: 0,
                floor: f,
            });
        };

        switch (t) {
            case 0:
                // fist goto outside
                switch (this.getFloorPosition()) {
                    case SoliderPosition.centerDoor:
                        addPosNoHight(m.centerDoor, CastleScene.firstOutSide);
                        break;
                    case SoliderPosition.leftDoor:
                        return;
                    case SoliderPosition.rightDoor:
                        addPosNoHight(m.rightDoor, CastleScene.firstOutSide);
                        break;
                    case SoliderPosition.firstLeft:
                        addPos(m.groundLeftGate, CastleScene.firstOutSide);
                        break;
                    case SoliderPosition.firstRight:
                        addPos(m.groundRightGate, CastleScene.firstOutSide);
                        break;
                    case SoliderPosition.outside:
                        break;
                    case SoliderPosition.secondBottomLeft:
                        addPos(m.firstSecLeftStair, CastleScene.first);
                        addPos(m.groundLeftGate, CastleScene.firstOutSide);
                        break;
                    case SoliderPosition.secondBottomRight:
                        addPos(m.firstSecRightStair, CastleScene.first);
                        addPos(m.groundRightGate, CastleScene.firstOutSide);
                        break;
                    case SoliderPosition.secondLeft:
                        addPos(m.firstSecLeftStair, CastleScene.first);
                        addPos(m.groundLeftGate, CastleScene.firstOutSide);
                        break;
                    case SoliderPosition.secondRight:
                        addPos(m.firstSecRightStair, CastleScene.first);
                        addPos(m.groundRightGate, CastleScene.firstOutSide);
                        break;
                }
                addPosNoHight(m.leftDoor, CastleScene.doorLooby);
                addPos(ga.gate1React, CastleScene.doorLooby);
                break;
            case 1:
                switch (this.getFloorPosition()) {
                    case SoliderPosition.centerDoor:
                        return;
                    case SoliderPosition.leftDoor:
                        addPosNoHight(m.leftDoor, CastleScene.firstOutSide);
                        break;
                    case SoliderPosition.rightDoor:
                        addPosNoHight(m.rightDoor, CastleScene.firstOutSide);
                        break;
                    case SoliderPosition.firstLeft:
                        addPos(m.groundLeftGate, CastleScene.firstOutSide);
                        break;
                    case SoliderPosition.firstRight:
                        addPos(m.groundRightGate, CastleScene.firstOutSide);
                        break;

                    case SoliderPosition.outside:
                        break;

                    case SoliderPosition.secondBottomLeft:
                        addPos(m.firstSecLeftStair, CastleScene.first);
                        addPos(m.groundLeftGate, CastleScene.firstOutSide);
                        break;
                    case SoliderPosition.secondBottomRight:
                        addPos(m.firstSecRightStair, CastleScene.first);
                        addPos(m.groundRightGate, CastleScene.firstOutSide);
                        break;
                    case SoliderPosition.secondLeft:
                        addPos(m.firstSecLeftStair, CastleScene.first);
                        addPos(m.groundLeftGate, CastleScene.firstOutSide);
                        break;
                    case SoliderPosition.secondRight:
                        addPos(m.firstSecRightStair, CastleScene.first);
                        addPos(m.groundRightGate, CastleScene.firstOutSide);
                        break;
                }
                addPosNoHight(m.centerDoor, CastleScene.doorLooby);
                addPos(ga.gate2React, CastleScene.doorLooby);
                break;
            case 2:
                switch (this.getFloorPosition()) {
                    case SoliderPosition.centerDoor:
                        addPosNoHight(m.centerDoor, CastleScene.firstOutSide);
                        break;
                    case SoliderPosition.leftDoor:
                        addPosNoHight(m.leftDoor, CastleScene.firstOutSide);
                        break;
                    case SoliderPosition.rightDoor:
                        return;
                    case SoliderPosition.firstLeft:
                        addPos(m.groundLeftGate, CastleScene.firstOutSide);
                        break;
                    case SoliderPosition.firstRight:
                        addPos(m.groundRightGate, CastleScene.firstOutSide);
                        break;
                    case SoliderPosition.outside:
                        break;
                    case SoliderPosition.secondBottomLeft:
                        addPos(m.firstSecLeftStair, CastleScene.first);
                        addPos(m.groundLeftGate, CastleScene.firstOutSide);
                        break;
                    case SoliderPosition.secondBottomRight:
                        addPos(m.firstSecRightStair, CastleScene.first);
                        addPos(m.groundRightGate, CastleScene.firstOutSide);
                        break;
                    case SoliderPosition.secondLeft:
                        addPos(m.firstSecLeftStair, CastleScene.first);
                        addPos(m.groundLeftGate, CastleScene.firstOutSide);
                        break;
                    case SoliderPosition.secondRight:
                        addPos(m.firstSecRightStair, CastleScene.first);
                        addPos(m.groundRightGate, CastleScene.firstOutSide);
                        break;
                }
                addPosNoHight(m.rightDoor, CastleScene.doorLooby);
                addPos(ga.gate3React, CastleScene.doorLooby);
                break;
            default:
                throw "invalid gate index";
        }

        this.setMoveTarget(r);
    }

    goToRoom() {
        this.targetGate = undefined;
    }

    findGateTarget() {
        let s = this.getMain();

        let t = s.Gates.getFixableGate();
        if (t !== -1) {
            this.gotoGate(t);
        } else {
            this.goToRoom();
        }
    }

    update() {
        super.update();

        let s = this.scene as Main;

        if (
            this.targetGate === undefined ||
            s.Gates.isGateFullHp(this.targetGate)
        ) {
            this.findGateTarget();
        }

        if (this.arrived && Date.now() - this.lastFix > 1000) {
            s.Gates.healGate(this.targetGate, 0.1);
            this.lastFix = Date.now();
        }
    }
}
