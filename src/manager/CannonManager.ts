import { CannonBase } from "../actor/base/cannon";

export class CannonManager {
    private data: Set<CannonBase> = new Set();

    addNew(b: CannonBase) {
        this.data.add(b);
    }

    getCannons() {
        return this.data;
    }
}