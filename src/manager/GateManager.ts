export class GateManager {
    hp1: number = 100;
    hp2: number = 100;
    hp3: number = 100;

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

    constructor(scene: Phaser.Scene, map: Phaser.Tilemaps.Tilemap) {
        // init door

        const gates = map.getObjectLayer("door");

        this.gate1 = scene.add.rectangle(
            gates.objects[0].x + gates.objects[0].width / 2,
            gates.objects[0].y + gates.objects[0].height / 4,
            gates.objects[0].width,
            gates.objects[0].height
        );
        this.gate2 = scene.add.rectangle(
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

        this.gate1React = {
            x: gates.objects[0].x,
            y: gates.objects[0].y,
            width: gates.objects[0].width,
            height: gates.objects[0].height,
        };

        this.gate2React = {
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

        this.gate1FrontReact = {
            x: gatesFilter.objects[1].x + gatesFilter.objects[1].width / 6,
            y: gatesFilter.objects[1].y,
            width: (gatesFilter.objects[1].width * 2) / 3,
            height: gatesFilter.objects[1].height,
        };

        this.gate2FrontReact = {
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
        this.gate1Front = scene.add.rectangle(
            gatesFilter.objects[1].x + gatesFilter.objects[1].width / 2,
            gatesFilter.objects[1].y + gatesFilter.objects[1].height / 2,
            gatesFilter.objects[1].width,
            gatesFilter.objects[1].height
        );
        this.gate2Front = scene.add.rectangle(
            gatesFilter.objects[2].x + gatesFilter.objects[2].width / 2,
            gatesFilter.objects[2].y + gatesFilter.objects[2].height / 2,
            gatesFilter.objects[2].width,
            gatesFilter.objects[2].height
        );

        scene.physics.add.existing(this.gate1Front);
        scene.physics.add.existing(this.gate2Front);
        scene.physics.add.existing(this.gate3Front);
    }

    getRandGate(): [
        Phaser.GameObjects.Rectangle,
        { x: number; y: number },
        Phaser.GameObjects.Rectangle,
        { x: number; y: number }
    ] {
        let r = Date.now() % 3;

        switch (r) {
            case 0:
                return [
                    this.gate1,
                    {
                        x: this.gate1React.x + this.gate1React.width * Math.random(),
                        y: this.gate1React.y + this.gate1React.height,
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
                ];
            case 1:
                return [
                    this.gate2,
                    {
                        x: this.gate2React.x + this.gate2React.width * Math.random(),
                        y: this.gate2React.y + this.gate2React.height,
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
                ];
            case 2:
                return [
                    this.gate3,
                    {
                        x: this.gate3React.x + this.gate3React.width * Math.random(),
                        y: this.gate3React.y + this.gate3React.height,
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
                ];
        }
    }
}
