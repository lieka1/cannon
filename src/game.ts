import * as Phaser from "phaser";
//@ts-ignore
import backgroundConf from "./asset/map/background.json";
//@ts-ignore
import background_groud from "./asset/map/background_ground.png";
//@ts-ignore
import background_castle from "./asset/map/background_castle.png";
//@ts-ignore
import player_img from "./asset/player/king.png";
//@ts-ignore
import player_atlas from "./asset/player/king_atlas.json";
//@ts-ignore
import player_anim from "./asset/player/king_anim.json";

import { Player } from "./player";

export default class Main extends Phaser.Scene {
    player: Player;
    private wallsLayer!:  Phaser.Tilemaps.TilemapLayer;

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
        const map = this.make.tilemap({ key: "map" });
        const tileSet = map.addTilesetImage(
            "background_ground",
            "background_ground"
        );
        const tileSet1 = map.addTilesetImage(
            "background_castle",
            "background_castle"
        );
        this.wallsLayer = map.createLayer(
            "background",
            [tileSet, tileSet1],
            0,
            0
        );

        map.createLayer("tree", tileSet);

        this.wallsLayer.setCollisionByProperty({ col: true });

    
        this.wallsLayer.renderDebug(this.add.graphics());
    
        this.physics.world.setBounds(0, 0, this.wallsLayer.width, this.wallsLayer.height);
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
        this.player = new Player(this, 100, 100);

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

    createBullet() {}

    preload() {
        this.loadMap();
        this.loadPlayer();
    }

    create() {
        this.createMap();
        this.createPlayer();
        this.initCamera();
    }

    update() {
        this.player.update();
    }
}
