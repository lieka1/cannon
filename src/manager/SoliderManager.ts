import { Solider } from "../actor/base/Solider";
import Main from "../game";

export class SoliderManager {
    scene: Main;
    soliders: Solider[] = [];

    constructor(scene: Main) {
        this.scene = scene;
    }

    addSolider(n: Solider) {
        this.soliders.push(n);
    }

    update() {
        this.soliders.forEach((e) => {
            e.update();
        });
    }
}
