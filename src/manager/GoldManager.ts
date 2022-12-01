export class GoldManager {
    current: number = 0; // how many gold currently has

    use(howMuch: number): boolean {
        if (this.current >= howMuch) {
            this.current -= howMuch;
            return true;
        }
        return false;
    }

    get(howMuch: number) {
        this.current += howMuch;
    }
}
