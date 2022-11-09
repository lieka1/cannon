import * as Phaser from "phaser";
////        load map
//@ts-ignore
import backgroundConf from "./asset/map/background.json";
//@ts-ignore
import background_groud from "./asset/map/background_ground.png";
//@ts-ignore
import background_castle from "./asset/map/background_castle.png";
////        load player
//@ts-ignore
import player_img from "./asset/player/king.png";
//@ts-ignore
import player_atlas from "./asset/player/king_atlas.json";
//@ts-ignore
import player_anim from "./asset/player/king_anim.json";
////        load enemy
//@ts-ignore
import enemy_img from "./asset/enemy/enemy.png";
//@ts-ignore
import enemy_atlas from "./asset/enemy/enemy_atlas.json";
//@ts-ignore
import enemy_anim from "./asset/enemy/enemy_anim.json";
////        load portal
//@ts-ignore
import portal_green from "./asset/map/portal_green.png";
//@ts-ignore
import portal_green_anim from "./asset/map/portal_green_anim.json";
//@ts-ignore
import portal_purple from "./asset/map/portal_purple.png";
//@ts-ignore
import portal_purple_anim from "./asset/map/portal_purple_anim.json";
////        load cannon
//@ts-ignore
import cannon_base_img from "./asset/cannon/cannon_base.png";
//@ts-ignore
import cannon_base_atlas from "./asset/cannon/cannon_base_atlas.json";
//@ts-ignore
import cannon_base_anim from "./asset/cannon/cannon_base_anim.json";

import { Player } from "./player";
import Enemy from "./actor/base/Enemy";
import util from "./util";
import { Actor } from "./actor/base/actor";
import { BulletManager } from "./manager/BulletManager";
import { CannonManager } from "./manager/CannonManager";
import { EnemyManager } from "./manager/EnemyManager";
import { EnemyPortal } from "./actor/Portal";
import { GateManager } from "./manager/GateManager";

export default class Main extends Phaser.Scene {
    private wallsLayer!: Phaser.Tilemaps.TilemapLayer;

    player: Player;

    // managers
    bullets: BulletManager = new BulletManager();
    Cannons: CannonManager = new CannonManager(this);
    Enemys: EnemyManager;
    Gates: GateManager;

    constructor() {
        super("main");
    }

    ////////////////////////////////////////////
    ///
    ///             map
    ///
    ////////////////////////////////////////////

    loadMap() {
        this.load.tilemapTiledJSON("map", backgroundConf);
        this.load.image("background_ground", background_groud);
        this.load.image("background_castle", background_castle);
    }

    createMap() {
        // load map
        const map = this.make.tilemap({ key: "map" });

        const ground_tile = map.addTilesetImage(
            "background_ground",
            "background_ground"
        );
        const castle_tile = map.addTilesetImage(
            "background_castle",
            "background_castle"
        );

        // create map
        this.wallsLayer = map.createLayer(
            "background",
            [ground_tile, castle_tile],
            0,
            0
        );

        // load physics
        this.wallsLayer.setCollisionByProperty({ col: true });

        this.wallsLayer.renderDebug(this.add.graphics());

        this.physics.world.setBounds(
            0,
            0,
            this.wallsLayer.width,
            this.wallsLayer.height
        );

        // declaration layer
        map.createLayer("tree", ground_tile);

        // init door
        this.Gates = new GateManager(this, map);
    }

    ////////////////////////////////////////////
    ///
    ///             Player
    ///
    ////////////////////////////////////////////
    loadPlayer() {
        this.load.atlas("king", player_img, player_atlas);
        this.load.animation("player_anim", player_anim);
    }

    createPlayer() {
        this.player = new Player(this, this.wallsLayer.width);

        this.physics.add.collider(this.player, this.wallsLayer);
    }

    ////////////////////////////////////////////
    ///
    ///             Camera
    ///
    ////////////////////////////////////////////

    private initCamera(): void {
        this.cameras.main.setSize(
            this.game.scale.width,
            this.game.scale.height
        );
        this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
        this.cameras.main.setZoom(1);
    }

    ////////////////////////////////////////////
    ///
    ///             Enemy
    ///
    ////////////////////////////////////////////

    private loadEnemy() {
        // load enemy actor
        this.load.atlas("enemy", enemy_img, enemy_atlas);
        this.load.animation("enemy_anim", enemy_anim);

        // load portal
        this.load.atlas(
            "portal_green",
            portal_green,
            util.genAtlasJson("portal_green", 8, 3, { x: 64, y: 64 })
        );

        this.load.atlas(
            "portal_purple",
            portal_purple,
            util.genAtlasJson("portal_purple", 8, 3, { x: 64, y: 64 })
        );

        // load anims
        this.load.animation("portal_green_anim", portal_green_anim);
        this.load.animation("portal_purple_anim", portal_purple_anim);
    }

    private initEnemy() {
        // init enemys
        this.Enemys = new EnemyManager(this, this.wallsLayer, this.Gates);

        // create portal
        this.Enemys.initProtal();
    }

    ////////////////////////////////////////////
    ///
    ///             Cannon
    ///
    ////////////////////////////////////////////

    loadCannon() {
        this.load.atlas("cannon_base", cannon_base_img, cannon_base_atlas);
        this.load.animation("canon_base_anim", cannon_base_anim);
    }

    ////////////////////////////////////////////
    ///
    ///             Scene
    ///
    ////////////////////////////////////////////

    preload() {
        this.loadMap();
        this.loadPlayer();
        this.loadEnemy();
        this.loadCannon();
    }

    create() {
        // create static
        this.createMap();

        // create player
        this.createPlayer();
        this.initCamera();

        // create enemy
        this.initEnemy();
    }

    update() {
        this.player.update();
        this.Enemys.update();
        this.Cannons.update();
    }

    
}
