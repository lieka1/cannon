import * as Phaser from "phaser";
//@ts-ignore
import backgroundConf from "./asset/map/background.json";
//@ts-ignore
import background_groud from "./asset/map/background_ground.png";
//@ts-ignore
import background_castle from "./asset/map/background_castle.png";
import { Player } from "./player";

export default class Main extends Phaser.Scene {
    bg: any;
    trees: any;
    player: Player;

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
        const layer1 = map.createLayer(
            "Tile Layer 1",
            [tileSet, tileSet1],
            0,
            0
        );
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
        this.cameras.main.setZoom(2);
    }

    createBullet() {}

    preload() {
        this.loadMap();
    }

    create() {
        this.player = new Player(this, 100, 100);

        this.createMap();
        this.initCamera();
    }

    update() {}
}
