import { CannonBase } from "../actor/base/cannon";

export class CannonManager {
    data: Array<CannonBase> = [];
    emptyPlace: number[] = [];
    scene: Phaser.Scene;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    hasSpace(x: number, y: number) {}

    private addToEmpty(b: CannonBase) {
        if (this.emptyPlace.length < 1) {
            // add new item
            this.data.push(b);
        } else {
            // get empty index
            let r = this.emptyPlace.pop();
            this.data[r] = b;
        }
    }

    addNew(b: CannonBase) {
        let removed;
        this.scene.physics.overlap(
            b,
            this.data,
            (e1: CannonBase, _: CannonBase) => {
                removed = true;
                e1.destroy();
            }
        );

        if (!removed) {
            this.addToEmpty(b);
        }
    }

    getCannons() {
        return this.data;
    }

    update() {
        this.data.forEach((e) => {
            e.shot(1 as any);
        });
    }
}
