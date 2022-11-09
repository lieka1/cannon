export class GateManager {
    hp1: number = 100;
    hp2: number = 100;
    hp3: number = 100;

    gate1: Phaser.GameObjects.Rectangle;
    gate2: Phaser.GameObjects.Rectangle;
    gate3: Phaser.GameObjects.Rectangle;

    constructor(scene: Phaser.Scene, map: Phaser.Tilemaps.Tilemap) {
        // init door

        const gates = map.getObjectLayer("door");

        this.gate1 = scene.add.rectangle(
            gates.objects[0].x,
            gates.objects[0].y,
            gates.objects[0].width,
            gates.objects[0].height
        );
        this.gate2 = scene.add.rectangle(
            gates.objects[1].x,
            gates.objects[1].y,
            gates.objects[1].width,
            gates.objects[1].height
        );
        this.gate3 = scene.add.rectangle(
            gates.objects[2].x,
            gates.objects[2].y,
            gates.objects[2].width,
            gates.objects[2].height
        );
    }

    getRandGate(): [Phaser.GameObjects.Rectangle, { x: number; y: number }] {
        let r = Date.now() % 3;

        switch (r) {
            case 0:
                return [
                    this.gate1,
                    {
                        x: this.gate1.x + this.gate1.width,
                        y: this.gate1.y + this.gate1.height * Math.random(),
                    },
                ];
            case 1:
                return [
                    this.gate2,
                    {
                        x: this.gate2.x + this.gate2.width,
                        y: this.gate2.y + this.gate2.height * Math.random(),
                    },
                ];
            case 2:
                return [
                    this.gate3,
                    {
                        x: this.gate3.x + this.gate3.width,
                        y: this.gate3.y + this.gate3.height * Math.random(),
                    },
                ];
        }
    }
}
