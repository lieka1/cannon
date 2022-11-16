import { Data } from "phaser";
import { CannonBase } from "../actor/base/cannon";
import { CastleStair } from "../actor/floor/CastleStair";
import Main from "../game";
import { Player } from "../player";

// a floor in the castle
interface CastleFloorMap {
    wall: Phaser.Tilemaps.TilemapLayer;
    ground: Phaser.Tilemaps.TilemapLayer;
}

export enum CastleScene {
    frist, // first floor
    second, // second floor
    top, // in the sentry
    topOutside, // render out side
    firstOutSide, // first floor outside
    doorLooby, // door lobby
}

export class MapManager {
    groundLayer!: Phaser.Tilemaps.TilemapLayer;
    floorLayer1: CastleFloorMap;
    floorLayer2: CastleFloorMap;
    floorLayer3: CastleFloorMap;
    castleOut: Phaser.Tilemaps.TilemapLayer;
    castleDoor: Phaser.Tilemaps.TilemapLayer;

    stair_0_1: CastleStair[] = [];
    stair_1_2: CastleStair[] = [];
    stair_out_sentry: CastleStair[] = [];

    map: Phaser.Tilemaps.Tilemap;

    castleFloor: CastleScene;

    scene: Main;

    cannonMoutPos: Map<number, CannonBase | undefined> = new Map();

    constructor(scene: Main) {
        this.scene = scene;

        this.map = scene.make.tilemap({ key: "map" });

        const ground_tile = this.map.addTilesetImage(
            "background_ground",
            "background_ground"
        );
        const castle_tile = this.map.addTilesetImage(
            "background_castle",
            "background_castle"
        );

        const interior_tile = this.map.addTilesetImage(
            "background_interior",
            "background_interior"
        );

        const tails = [ground_tile, castle_tile, interior_tile];

        // create groud and tree
        this.groundLayer = this.map.createLayer(
            "background/background",
            tails,
            0,
            0
        );
        this.map.createLayer("background/tree", tails);

        // floor 1
        this.floorLayer1 = {
            ground: this.map.createLayer(
                "castle/castleGround/castleground",
                tails
            ),
            wall: this.map.createLayer(
                "castle/castleGround/castleground_wall",
                tails
            ),
        };

        // floor 2
        this.floorLayer2 = {
            ground: this.map.createLayer(
                "castle/castleSecond/castleSecond",
                tails
            ),
            wall: this.map.createLayer(
                "castle/castleSecond/castleSecond_wall",
                tails
            ),
        };

        // floor 3
        this.floorLayer3 = {
            ground: this.map.createLayer("castle/castleTop/castleTop", tails),
            wall: this.map.createLayer(
                "castle/castleTop/castleTop_sentry_wall",
                tails
            ),
        };

        this.castleOut = this.map.createLayer(
            "castle/castleTop/castleTop_sentry",
            tails
        );
        this.castleDoor = this.map.createLayer(
            "castle/castleTop/castleground_door",
            tails
        );

        this.showLayer(CastleScene.topOutside);

        // get collision target
        let tar = this.map.getObjectLayer("map_target");
        let stair_0_1_left = tar.objects.find(
            (e) => e.name === "left_0_1_stair"
        );
        let stair_1_2_left = tar.objects.find(
            (e) => e.name === "left_1_2_stair"
        );

        let stair_0_1_right = tar.objects.find(
            (e) => e.name === "right_0_1_stair"
        );
        let stair_1_2_right = tar.objects.find(
            (e) => e.name === "right_1_2_stair"
        );

        let stair_entry_sentry_right = tar.objects.find(
            (e) => e.name === "right_sentry_tower_entry"
        );
        let stair_entry_sentry_left = tar.objects.find(
            (e) => e.name === "left_sentry_tower_entry"
        );

        let stair_out_sentry_right = tar.objects.find(
            (e) => e.name === "right_sentry_tower_out"
        );
        let stair_out_sentry_left = tar.objects.find(
            (e) => e.name === "left_sentry_tower_out"
        );

        let right_castle_entry = tar.objects.find(
            (e) => e.name === "right_castle_entry"
        );
        let left_castle_entry = tar.objects.find(
            (e) => e.name === "left_castle_entry"
        );
        let right_castle_out = tar.objects.find(
            (e) => e.name === "right_castle_out"
        );
        let left_castle_out = tar.objects.find(
            (e) => e.name === "left_castle_out"
        );

        let left_door_out = tar.objects.find((e) => e.name === "left_door_out");
        let left_door_entry = tar.objects.find(
            (e) => e.name === "left_door_entry"
        );
        let right_door_out = tar.objects.find(
            (e) => e.name === "right_castle_out"
        );
        let right_door_entry = tar.objects.find(
            (e) => e.name === "right_door_entry"
        );
        let mid_door_out = tar.objects.find((e) => e.name === "mid_door_out");
        let mid_door_entry = tar.objects.find(
            (e) => e.name === "mid_door_entry"
        );

        // ground
        this.stair_0_1.push(
            new CastleStair(
                scene,
                stair_0_1_left.x,
                stair_0_1_left.y,
                stair_0_1_left.width,
                stair_0_1_left.height,
                CastleScene.frist,
                CastleScene.second
            )
        );
        this.stair_0_1.push(
            new CastleStair(
                scene,
                stair_0_1_right.x,
                stair_0_1_right.y,
                stair_0_1_right.width,
                stair_0_1_right.height,
                CastleScene.frist,
                CastleScene.second
            )
        );
        this.stair_0_1.push(
            new CastleStair(
                scene,
                right_castle_entry.x,
                right_castle_entry.y,
                right_castle_entry.width,
                right_castle_entry.height,
                CastleScene.frist,
                CastleScene.frist
            )
        );
        this.stair_0_1.push(
            new CastleStair(
                scene,
                right_castle_out.x,
                right_castle_out.y,
                right_castle_out.width,
                right_castle_out.height,
                CastleScene.firstOutSide,
                CastleScene.firstOutSide
            )
        );
        this.stair_0_1.push(
            new CastleStair(
                scene,
                left_castle_entry.x,
                left_castle_entry.y,
                left_castle_entry.width,
                left_castle_entry.height,
                CastleScene.frist,
                CastleScene.frist
            )
        );
        this.stair_0_1.push(
            new CastleStair(
                scene,
                left_castle_out.x,
                left_castle_out.y,
                left_castle_out.width,
                left_castle_out.height,
                CastleScene.firstOutSide,
                CastleScene.firstOutSide
            )
        );
        this.stair_0_1.push(
            new CastleStair(
                scene,
                left_door_entry.x,
                left_door_entry.y,
                left_door_entry.width,
                left_door_entry.height,
                CastleScene.doorLooby,
                CastleScene.doorLooby
            )
        );
        this.stair_0_1.push(
            new CastleStair(
                scene,
                mid_door_entry.x,
                mid_door_entry.y,
                mid_door_entry.width,
                mid_door_entry.height,
                CastleScene.doorLooby,
                CastleScene.doorLooby
            )
        );
        this.stair_0_1.push(
            new CastleStair(
                scene,
                right_door_entry.x,
                right_door_entry.y,
                right_door_entry.width,
                right_door_entry.height,
                CastleScene.doorLooby,
                CastleScene.doorLooby
            )
        );
        this.stair_0_1.push(
            new CastleStair(
                scene,
                left_door_entry.x,
                left_door_entry.y,
                left_door_entry.width,
                left_door_entry.height,
                CastleScene.doorLooby,
                CastleScene.doorLooby
            )
        );
        this.stair_0_1.push(
            new CastleStair(
                scene,
                mid_door_entry.x,
                mid_door_entry.y,
                mid_door_entry.width,
                mid_door_entry.height,
                CastleScene.doorLooby,
                CastleScene.doorLooby
            )
        );
        this.stair_0_1.push(
            new CastleStair(
                scene,
                right_door_entry.x,
                right_door_entry.y,
                right_door_entry.width,
                right_door_entry.height,
                CastleScene.doorLooby,
                CastleScene.doorLooby
            )
        );
        this.stair_0_1.push(
            new CastleStair(
                scene,
                left_door_out.x,
                left_door_out.y,
                left_door_out.width,
                left_door_out.height,
                CastleScene.firstOutSide,
                CastleScene.firstOutSide
            )
        );
        this.stair_0_1.push(
            new CastleStair(
                scene,
                mid_door_out.x,
                mid_door_out.y,
                mid_door_out.width,
                mid_door_out.height,
                CastleScene.firstOutSide,
                CastleScene.firstOutSide
            )
        );
        this.stair_0_1.push(
            new CastleStair(
                scene,
                right_door_out.x,
                right_door_out.y,
                right_door_out.width,
                right_door_out.height,
                CastleScene.firstOutSide,
                CastleScene.firstOutSide
            )
        );

        // second floor
        this.stair_1_2.push(
            new CastleStair(
                scene,
                stair_1_2_left.x,
                stair_1_2_left.y,
                stair_1_2_left.width,
                stair_1_2_left.height,
                CastleScene.top,
                CastleScene.second
            )
        );
        this.stair_1_2.push(
            new CastleStair(
                scene,
                stair_1_2_right.x,
                stair_1_2_right.y,
                stair_1_2_right.width,
                stair_1_2_right.height,
                CastleScene.top,
                CastleScene.second
            )
        );

        this.stair_out_sentry.push(
            new CastleStair(
                scene,
                stair_entry_sentry_right.x,
                stair_entry_sentry_right.y,
                stair_entry_sentry_right.width,
                stair_entry_sentry_right.height,
                CastleScene.top,
                CastleScene.top
            )
        );
        this.stair_out_sentry.push(
            new CastleStair(
                scene,
                stair_entry_sentry_left.x,
                stair_entry_sentry_left.y,
                stair_entry_sentry_left.width,
                stair_entry_sentry_left.height,
                CastleScene.top,
                CastleScene.top
            )
        );

        this.stair_out_sentry.push(
            new CastleStair(
                scene,
                stair_out_sentry_right.x,
                stair_out_sentry_right.y,
                stair_out_sentry_right.width,
                stair_out_sentry_right.height,
                CastleScene.topOutside,
                CastleScene.topOutside
            )
        );
        this.stair_out_sentry.push(
            new CastleStair(
                scene,
                stair_out_sentry_left.x,
                stair_out_sentry_left.y,
                stair_out_sentry_left.width,
                stair_out_sentry_left.height,
                CastleScene.topOutside,
                CastleScene.topOutside
            )
        );

        // load physics
        this.groundLayer.setCollisionByProperty({ col: true });

        this.floorLayer1.wall.setCollisionByProperty({ col: true });
        this.floorLayer2.wall.setCollisionByProperty({ col: true });
        this.floorLayer3.wall.setCollisionByProperty({ col: true });
        this.floorLayer3.ground.setCollisionByProperty({ col: true });
        this.castleDoor.setCollisionByProperty({ col: true });

        scene.physics.world.setBounds(
            0,
            0,
            this.groundLayer.width,
            this.groundLayer.height
        );

        // load mount pos
        let mountLayer = this.map.getObjectLayer("cannon_mount");

        mountLayer.objects.forEach((e) => {
            for (var i = e.x + 16; i < e.x + e.width; i += 16) {
                this.cannonMoutPos.set(this.getMountIDByPos(i, e.y), undefined);
            }
        });
    }

    showLayer(l: CastleScene) {
        if (l == this.castleFloor) return;

        switch (l) {
            case CastleScene.frist:
                this.floorLayer1.ground.setVisible(true);
                this.floorLayer1.wall.setVisible(true);
                this.floorLayer2.ground.setVisible(false);
                this.floorLayer2.wall.setVisible(false);
                this.floorLayer3.ground.setVisible(false);
                this.floorLayer3.wall.setVisible(false);
                this.castleOut.setVisible(false);
                this.castleDoor.setVisible(false);
                this.castleDoor.setAlpha(1);
                break;
            case CastleScene.second:
                this.floorLayer1.ground.setVisible(false);
                this.floorLayer1.wall.setVisible(false);
                this.floorLayer2.ground.setVisible(true);
                this.floorLayer2.wall.setVisible(true);
                this.floorLayer3.ground.setVisible(false);
                this.floorLayer3.wall.setVisible(false);
                this.castleOut.setVisible(false);
                this.castleDoor.setVisible(false);
                this.castleDoor.setAlpha(1);
                break;
            case CastleScene.top:
                this.floorLayer1.ground.setVisible(false);
                this.floorLayer1.wall.setVisible(false);
                this.floorLayer2.ground.setVisible(false);
                this.floorLayer2.wall.setVisible(false);
                this.floorLayer3.ground.setVisible(true);
                this.floorLayer3.wall.setVisible(true);
                this.castleOut.setVisible(false);
                this.castleDoor.setVisible(true);
                this.castleDoor.setAlpha(1);
                break;
            case CastleScene.topOutside:
                this.floorLayer1.ground.setVisible(false);
                this.floorLayer1.wall.setVisible(false);
                this.floorLayer2.ground.setVisible(false);
                this.floorLayer2.wall.setVisible(false);
                this.floorLayer3.ground.setVisible(true);
                this.floorLayer3.wall.setVisible(true);
                this.castleOut.setVisible(true);
                this.castleDoor.setVisible(true);
                this.castleDoor.setAlpha(1);
                break;
            case CastleScene.firstOutSide:
                this.floorLayer1.ground.setVisible(true);
                this.floorLayer1.wall.setVisible(true);
                this.floorLayer2.ground.setVisible(false);
                this.floorLayer2.wall.setVisible(false);
                this.floorLayer3.ground.setVisible(false);
                this.floorLayer3.wall.setVisible(false);
                this.castleOut.setVisible(false);
                this.castleDoor.setVisible(true);
                this.castleDoor.setAlpha(1);
                break;
            case CastleScene.doorLooby:
                this.floorLayer1.ground.setVisible(true);
                this.floorLayer1.wall.setVisible(true);
                this.floorLayer2.ground.setVisible(false);
                this.floorLayer2.wall.setVisible(false);
                this.floorLayer3.ground.setVisible(false);
                this.floorLayer3.wall.setVisible(false);
                this.castleOut.setVisible(false);
                this.castleDoor.setVisible(true);
                this.castleDoor.setAlpha(0.7);
                break;
        }

        this.castleFloor = l;
    }

    checkMovement(player: Player) {
        let currentLayer = this.getWall();
        let currentStair = this.getStairs();

        currentLayer.forEach((e) => {
            this.scene.physics.collide(player, e);
        });

        // check move to other floor
        currentStair.forEach((e) => {
            this.scene.physics.overlap(
                player,
                e,
                (_, stair: any) => {
                    if (!stair.canChange()) return;

                    let other = stair.getOther(this.castleFloor);

                    this.showLayer(other);
                },
                undefined,
                this
            );
        });
    }

    getStairs() {
        switch (this.castleFloor) {
            case CastleScene.firstOutSide:
            case CastleScene.frist:
            case CastleScene.doorLooby:
                return [this.stair_0_1];
            case CastleScene.second:
                return [this.stair_0_1, this.stair_1_2];
            case CastleScene.top:
                return [this.stair_1_2, this.stair_out_sentry];
            case CastleScene.topOutside:
                return [this.stair_out_sentry];
        }
    }

    getWall() {
        switch (this.castleFloor) {
            case CastleScene.second:
                return [this.floorLayer2.wall];
            case CastleScene.top:
                return [this.floorLayer3.wall];
            case CastleScene.topOutside:
                return [
                    this.floorLayer3.wall,
                    this.castleOut,
                    this.floorLayer3.ground,
                    this.castleDoor,
                ];
            case CastleScene.frist:
            case CastleScene.firstOutSide:
                return [this.floorLayer1.wall];
            case CastleScene.doorLooby:
                return [this.floorLayer1.wall, this.castleDoor];
        }
    }

    getMountIDByPos = (x: number, y: number) => {
        return (y << 12) + x;
    };

    getMountPosById(id: number) {
        return {
            x: (id & 0b0000_0000_0000_1111_1111_1111),
            y: (id & 0b1111_1111_1111_0000_0000_0000) >> 12,
        }
    }

    private canMountCannon(i: number) {
        return (
            this.cannonMoutPos.has(i) && this.cannonMoutPos.get(i) !== undefined
        );
    }

    canMount(x: number, y: number) {
        if (!this.canMountCannon(this.getMountIDByPos(x, y))) {
            return false;
        }
        if (!this.canMountCannon(this.getMountIDByPos(x, y - 1))) {
            return false;
        }
        if (!this.canMountCannon(this.getMountIDByPos(x - 1, y))) {
            return false;
        }
        if (!this.canMountCannon(this.getMountIDByPos(x - 1, y - 1))) {
            return false;
        }
        if (!this.canMountCannon(this.getMountIDByPos(x + 1, y + 1))) {
            return false;
        }
        if (!this.canMountCannon(this.getMountIDByPos(x, y + 1))) {
            return false;
        }
        if (!this.canMountCannon(this.getMountIDByPos(x + 1, y))) {
            return false;
        }
        if (!this.canMountCannon(this.getMountIDByPos(x - 1, y + 1))) {
            return false;
        }
        if (!this.canMountCannon(this.getMountIDByPos(x + 1, y - 1))) {
            return false;
        }

        return true;
    }
}
