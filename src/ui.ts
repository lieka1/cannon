import { Text } from "./actor/base/text";
import { MenuButton } from "./actor/ui/MenuButton";
import Main from "./game";

export enum SceneState {
    main = 1 << 0,
    itemsToBuild = 1 << 1,
    fps = 1 << 2,
    menu = 1 << 3,
}

export interface RenderUpdates {
    state: SceneState;
    cleanup: () => void;
    update: (time: number) => void;
    rerender: () => void;
}

export class Ui extends Phaser.Scene {
    updates: RenderUpdates[] = [];

    // fps feild
    renderFps: Text;
    lastUpdate: number = 0;

    // main feild
    bottomHeight: number = 70;
    itemCount: number = 5;
    sideColor = 0x993300;

    mainFrames: MenuButton[] = [];

    // item feidls
    itemFrames: Phaser.GameObjects.Rectangle[] = [];

    // configs
    renderConfig: number = SceneState.main;
    lastRenderConfig: number = SceneState.main;

    constructor() {
        super({ key: "UIScene", active: true });

        this.addState(SceneState.fps);
    }

    addState(s: SceneState) {
        this.renderConfig = this.renderConfig | s;
    }

    hasState(s: SceneState) {
        return this.renderConfig & s;
    }

    removeState(s: SceneState) {
        this.renderConfig = this.renderConfig ^ s;
    }

    addLastState(s: SceneState) {
        this.lastRenderConfig = this.lastRenderConfig | s;
    }

    hasLastState(s: SceneState) {
        return this.lastRenderConfig & s;
    }

    removeLastState(s: SceneState) {
        this.lastRenderConfig = this.lastRenderConfig ^ s;
    }

    ////////////////////////////////////////////
    ///
    ///             fps
    ///
    ////////////////////////////////////////////

    cleanupFps() {
        if (this.renderFps) {
            this.renderFps.destroy();
        }
    }

    rerenderFps() {
        this.renderFps = new Text(this, 20, 20, "0");
    }

    updateFps(time: number) {
        if (time - this.lastUpdate > 1000) {
            this.renderFps.setText(`${Math.round(this.game.loop.actualFps)}`);

            this.lastUpdate = time;
        }
    }

    ////////////////////////////////////////////
    ///
    ///             main
    ///
    ////////////////////////////////////////////
    cleanupMain() {
        // remove old frames
        this.mainFrames.forEach((e) => {
            e.destroy();
        });
    }

    rerenderMain() {
        this.mainFrames = [];

        const totalHeight = this.game.scale.height;
        const itemSizeHalf = this.bottomHeight / 2;
        const totalLen = this.bottomHeight * this.itemCount;
        const leftMargin = (this.game.scale.width - totalLen) / 2;

        for (let i = 0; i < this.itemCount; i++) {
            this.mainFrames.push(
                new MenuButton(
                    this,
                    () => {
                        console.log("!");
                    },
                    leftMargin + itemSizeHalf + i * this.bottomHeight,
                    totalHeight - this.bottomHeight,
                    this.bottomHeight,
                    this.bottomHeight
                )
            );
        }
    }

    ////////////////////////////////////////////
    ///
    ///             items
    ///
    ////////////////////////////////////////////

    cleanupItem() {
        this.itemFrames.forEach((e) => {
            e.destroy();
        });
    }

    rerenderItem() {
        this.itemFrames = [];

        const totalHeight = this.game.scale.height;
        const itemSizeHalf = this.bottomHeight / 2;
        const totalLen = this.bottomHeight * this.itemCount;
        const leftMargin = (this.game.scale.width - totalLen) / 2;

        for (let i = 0; i < this.itemCount; i++) {
            //background
            this.mainFrames.push(
                new MenuButton(
                    this,
                    () => {},
                    leftMargin + itemSizeHalf + i * this.bottomHeight,
                    totalHeight - this.bottomHeight,
                    this.bottomHeight,
                    this.bottomHeight
                )
            );
        }
    }
    ////////////////////////////////////////////
    ///
    ///             menu
    ///
    ////////////////////////////////////////////

    rerenderMenu() {
        // this.add.re;
    }

    ////////////////////////////////////////////
    ///
    ///             control
    ///
    ////////////////////////////////////////////

    initControl() {
        this.input.keyboard.on("keyup-E", () => {
            this.scene.pause("main");

            this.addState(SceneState.itemsToBuild);

            this.removeState(SceneState.main);
        });

        this.input.keyboard.on("keyup-ESC", () => {
            if (this.hasState(SceneState.main)) {
                this.scene.pause("main");

                this.addState(SceneState.menu);
                this.removeState(SceneState.main);
            } else if (this.hasState(SceneState.itemsToBuild)) {
                this.scene.resume("main");

                this.addState(SceneState.main);
                this.removeState(SceneState.itemsToBuild);
            } else if (this.hasState(SceneState.menu)) {
                this.scene.resume("main");

                this.addState(SceneState.main);
                this.removeState(SceneState.menu);
            }
        });
    }

    rerender() {
        this.updates.forEach((e) => {
            if (!this.hasState(e.state)) {
                if (this.hasLastState(e.state)) {
                    e.cleanup.apply(this, []);
                }

                return;
            }

            e.cleanup.apply(this, []);
            e.rerender.apply(this, []);

            this.addLastState(e.state);
        }, this);
    }

    create(): void {
        // handle resize
        this.scale.addListener("resize", this.rerender, this);

        this.initControl();

        this.updates.push({
            state: SceneState.fps,
            update: this.updateFps,
            rerender: this.rerenderFps,
            cleanup: this.cleanupFps,
        });

        this.updates.push({
            state: SceneState.main,
            update: () => {},
            rerender: this.rerenderMain,
            cleanup: this.cleanupMain,
        });

        this.updates.push({
            state: SceneState.itemsToBuild,
            update: () => {},
            rerender: this.rerenderItem,
            cleanup: this.cleanupItem,
        });
    }

    update(time: number, _: number): void {
        this.updates.forEach((e) => {
            if (this.hasState(e.state)) {
                if (!this.hasLastState(e.state)) {
                    e.rerender.apply(this, []);
                    this.addLastState(e.state);
                } else e.update.apply(this, [time]);
            } else {
                if (this.hasLastState(e.state)) {
                    e.cleanup.apply(this, []);
                    this.removeLastState(e.state);
                }
            }
        }, this);
    }
}
