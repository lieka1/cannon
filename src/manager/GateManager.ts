export class GateManager {
    hp1: number = 100;
    hp2: number = 100;
    hp3: number = 100;

    gate1: Phaser.Tilemaps.TilemapLayer;
    gate2: Phaser.Tilemaps.TilemapLayer;
    gate3: Phaser.Tilemaps.TilemapLayer;

    constructor(
        map: Phaser.Tilemaps.Tilemap,
        castle_tile: Phaser.Tilemaps.Tileset
    ) {
        // init door
        this.gate1 = map.createLayer("door", castle_tile);
        this.gate2 = map.createLayer("door", castle_tile);
        this.gate3 = map.createLayer("door", castle_tile);

        this.gate1.setCollisionByProperty({ col: true });
        this.gate2.setCollisionByProperty({ col: true });
        this.gate3.setCollisionByProperty({ col: true });
    }

    getRandGate() {
        let r = Date.now() % 3;

        switch (r) {
            case 0:
                return this.gate1;
            case 1:
                return this.gate2;
            case 2:
                return this.gate3;
        }
    }
}
