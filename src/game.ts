import * as Phaser from "phaser";
////        load map
//@ts-ignore
import backgroundConf from "./asset/map/background.json";
//@ts-ignore
import background_groud from "./asset/map/background_ground.png";
//@ts-ignore
import background_castle from "./asset/map/background_castle.png";
//@ts-ignore
import background_interior from "./asset/map/background_interior.png";
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
import cannon_barrel_img from "./asset/cannon/cannon_barrel_img.png";
//@ts-ignore
import cannon_barrel_atlas from "./asset/cannon/cannon_barrel_atlas.json";
//@ts-ignore
import cannon_barrel_anim from "./asset/cannon/cannon_barrel_anim.json";
////        load bullet
//@ts-ignore
import basic_bullet from "./asset/bullet/basic_bullet.png";
////        load building
//@ts-ignore
import building_gold_mine from "./asset/building/gold_mine.png";
//@ts-ignore
import building_tavern from "./asset/building/tavern.png";
//@ts-ignore
import building_refinery from "./asset/building/refinery.png";
//@ts-ignore
import building_room from "./asset/building/room.png";
//@ts-ignore
import building_library from "./asset/building/library.png";
//@ts-ignore

import { Player } from "./player";
import Enemy from "./actor/base/Enemy";
import util from "./util";
import { BulletManager } from "./manager/BulletManager";
import { CannonManager } from "./manager/CannonManager";
import { EnemyManager } from "./manager/EnemyManager";
import { EnemyPortal } from "./actor/enemy/Portal";
import { GateManager } from "./manager/GateManager";
import { MapManager } from "./manager/MapManager";
import { GoldManager } from "./manager/GoldManager";
import { BuildingManager } from "./manager/BuildingManager";
import { Ui } from "./ui";
import { SoliderManager } from "./manager/SoliderManager";

export default class Main extends Phaser.Scene {
    player: Player;

    // managers
    bullets: BulletManager = new BulletManager(this);
    Cannons: CannonManager;
    Enemys: EnemyManager;
    Gates: GateManager;
    Map: MapManager;
    gold: GoldManager = new GoldManager();
    Building: BuildingManager;
    Soliders = new SoliderManager(this);

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
        this.load.image("background_interior", background_interior);
        this.load.image("building_gold_mine", building_gold_mine);
        this.load.image("building_tavern", building_tavern);
        this.load.image("building_refinery", building_refinery);
        this.load.image("building_room", building_room);
        this.load.image("building_library", building_library);
    }

    createMap() {
        // load map
        this.Map = new MapManager(this);

        // init door
        this.Gates = new GateManager(this, this.Map.map);

        // add some cannon base
        this.Cannons = new CannonManager(this);

        this.Building = new BuildingManager(this);
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
        this.player = new Player(this, this.Map.map);
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
        this.Enemys = new EnemyManager(this, this.Map.groundLayer, this.Gates);

        // create portal
        this.Enemys.initProtal();
    }

    ////////////////////////////////////////////
    ///
    ///             Cannon
    ///
    ////////////////////////////////////////////

    loadCannon() {
        // basic bullet
        this.load.image("basic_bullet", basic_bullet);
        this.load.image("cannon_base", cannon_base_img);
        this.load.atlas(
            "cannon_barrel_img",
            cannon_barrel_img,
            cannon_barrel_atlas
        );
        this.load.animation("cannon_basic_shot", cannon_barrel_anim);
    }

    ////////////////////////////////////////////
    ///
    ///             Scene
    ///
    ////////////////////////////////////////////

    preload() {
        if ((this.scene.get("ui") as Ui).mainScene === null) {
            return;
        }

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

        // start ui
        let ui = this.game.scene.getScene("ui") as Ui;

        if (!ui.mainScene === null) {
            ui.mainScene = this;
            ui.reinitState();
        } else {
            this.game.scene.start("ui");
        }
    }

    update(time: number, delta: number) {
        this.player.update();
        this.Cannons.update(time, delta, this.Enemys);
        this.bullets.update(this.Enemys);
        this.Enemys.update();
        this.Soliders.update();
        this.Building.update();
        this.Gates.update();
    }
}
