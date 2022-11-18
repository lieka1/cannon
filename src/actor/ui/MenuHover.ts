import { Ui } from "../../ui";
import { MenuBase } from "./MenuBase";
import { MenuButton } from "./MenuButton";

export class MenuHoverOverlay extends MenuBase {
    constructor() {
        super();
    }

    destroy(): void {}
}

export class MenuHover extends MenuBase {
    overlay: MenuHoverOverlay;
    parent: MenuButton;

    constructor(scene: Ui, parent: MenuButton) {
        super();

        this.parent = parent;
    }

    update(cursorx: number, cursory: number) {
        if (
            this.parent.x < cursorx &&
            this.parent.x + this.parent.width > cursorx
        ) {
            if (
                this.parent.y < cursory &&
                this.parent.y + this.parent.height > cursory
            ) {
                console.log("show hover");
            }
        }
    }

    destroy(): void {
        this.overlay.destroy();
    }
}
