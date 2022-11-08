import { Bullet } from "../actor/base/bullet";

export class BulletManager {
    private data: Set<Bullet> = new Set();

    addNew(b: Bullet) {
        this.data.add(b);
    }

    getBullets() {
        return this.data;
    }
}
