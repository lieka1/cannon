import { Text } from "./actor/base/text";
import { MenuBackground } from "./actor/ui/MenuBackground";
import { MenuButton } from "./actor/ui/MenuButton";
import { MenuTextButton } from "./actor/ui/MenuTextButton";
import Main from "./game";
import { ItemManager } from "./manager/ItemManager";

export enum SceneState {
    main = 1 << 0,
    itemsToBuild = 1 << 1,
    fps = 1 << 2,
    menu = 1 << 3,
    mountBuild = 1 << 4,
}

export interface RenderUpdates {
    state: SceneState;
    cleanup: () => void;
    update: (time: number) => void;
    rerender: () => void;
}

interface DestroyableItem {
    destroy: () => void;
}

export class Ui extends Phaser.Scene {
    mainScene: Main;

    updates: RenderUpdates[] = [];

    items: ItemManager = new ItemManager();

    // fps feild
    renderFps: Text;
    lastUpdate: number = 0;

    // main feild
    bottomHeight: number = 70;
    itemCount: number = 5;
    sideColor = 0x993300;

    mainFrames: MenuButton[] = [];

    // item feidls
    itemFrames: MenuButton[] = [];

    // configs
    renderConfig: number = SceneState.main;
    lastRenderConfig: number = SceneState.main;

    // menu feilds
    menus: DestroyableItem[] = [];

    // mount item
    mountItem: Phaser.GameObjects.Image;
    mountBackground: MenuBackground;
    mountBackUnavilableground: MenuBackground;
    mountItemInfo: {
        viewX: number;
        viewY: number;
        worldX: number;
        worldY: number;

        hasItem: boolean;
    } = {
        viewX: -1000,
        viewY: -1000,
        worldX: -1000,
        worldY: -1000,
        hasItem: true,
    };

    constructor() {
        super({ key: "ui", active: true });

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
            this.renderFps.setText(
                `${Math.round(this.game.loop.actualFps)} ${
                    this.mountItemInfo.viewX
                } ${this.mountItemInfo.viewY}`
            );

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
                new MenuTextButton(
                    this,
                    () => {
                        console.log(i);
                    },
                    leftMargin + itemSizeHalf + i * this.bottomHeight,
                    totalHeight - this.bottomHeight,
                    this.bottomHeight,
                    this.bottomHeight,
                    "ll"
                )
            );
        }
    }
    ////////////////////////////////////////////
    ///
    ///             mount item
    ///
    ////////////////////////////////////////////

    cleanupMountItem() {
        if (this.mountItem) {
            this.mountItem.destroy();
            this.mountBackground.destroy();
        }
    }

    rerenderMountItem() {
        this.mountItem = this.add.image(-1000, -1000, "cannon_base");

        this.mountBackground = new MenuBackground(
            this,
            -16,
            -16,
            32,
            32,
            0x00ff00,
            0xb0
        );

        this.mountBackUnavilableground = new MenuBackground(
            this,
            -16,
            -16,
            32,
            32,
            0xff0000,
            0xb0
        );
    }

    updateMountItem(time: number) {
        this.mountItem.setPosition(
            this.mountItemInfo.viewX,
            this.mountItemInfo.viewY
        );

        if (!this.mountItemInfo.hasItem) {
            this.mountBackground.setPosition(
                this.mountItemInfo.viewX,
                this.mountItemInfo.viewY,
                1000
            );
            this.mountBackground.setVisiable(true);
            this.mountBackUnavilableground.setVisiable(false);
        } else {
            this.mountBackUnavilableground.setPosition(
                this.mountItemInfo.viewX,
                this.mountItemInfo.viewY,
                1000
            );
            this.mountBackground.setVisiable(false);
            this.mountBackUnavilableground.setVisiable(true);
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
        const mountHeight = (totalHeight - this.bottomHeight) / 2;

        for (let i = 0; i < this.itemCount; i++) {
            //background
            this.itemFrames.push(
                new MenuButton(
                    this,
                    () => {
                        this.navigateBuildToMount();
                    },
                    leftMargin + itemSizeHalf + i * this.bottomHeight,
                    mountHeight,
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

    cleanupMenu() {
        this.menus.forEach((e) => {
            e.destroy();
        });
    }

    rerenderMenu() {
        this.menus = [];

        const totalHeight = this.game.scale.height;
        const totalWidth = this.game.scale.width;

        const renderWidth = 200;

        const leftMargin = (this.game.scale.width - renderWidth) / 2;

        const totalItems = 2;
        const topMargin = (totalHeight - this.bottomHeight * totalItems) / 2;

        this.menus.push(
            new MenuTextButton(
                this,
                () => {
                    this.navigateMenuToMain();
                },
                leftMargin,
                topMargin,
                renderWidth,
                this.bottomHeight,
                "continue"
            )
        );

        this.menus.push(
            new MenuTextButton(
                this,
                () => {
                    this.toggleShowFps();
                },
                leftMargin,
                topMargin + this.bottomHeight,
                renderWidth,
                this.bottomHeight,
                "toggle fps"
            )
        );
    }

    ////////////////////////////////////////////
    ///
    ///             navigation
    ///
    ////////////////////////////////////////////
    navigateMenuToMain() {
        this.scene.resume("main");
        this.addState(SceneState.main);
        this.removeState(SceneState.menu);
    }

    navigateBuildTomain() {
        this.scene.resume("main");
        this.addState(SceneState.main);
        this.removeState(SceneState.itemsToBuild);
    }

    navigateMainToMenu() {
        this.scene.pause("main");
        this.addState(SceneState.menu);
        this.removeState(SceneState.main);
    }

    navigateMainToBuild() {
        this.scene.pause("main");
        this.addState(SceneState.itemsToBuild);
        this.removeState(SceneState.main);
    }

    toggleShowFps() {
        if (this.hasState(SceneState.fps)) {
            this.removeState(SceneState.fps);
        } else {
            this.addState(SceneState.fps);
        }
    }

    navigateBuildToMount() {
        this.mountItemInfo = {
            viewX: -1000,
            viewY: -1000,
            worldX: -1000,
            worldY: -1000,
            hasItem: true,
        };

        this.addState(SceneState.mountBuild);
        this.removeState(SceneState.itemsToBuild);
    }

    navigateMountToBuild() {
        this.addState(SceneState.itemsToBuild);
        this.removeState(SceneState.mountBuild);
    }

    navigateMountToMain() {
        this.scene.resume("main");
        this.addState(SceneState.main);
        this.removeState(SceneState.mountBuild);
    }

    ////////////////////////////////////////////
    ///
    ///             control
    ///
    ////////////////////////////////////////////

    initControl() {
        this.input.keyboard.on("keyup-E", () => {
            if (this.hasState(SceneState.main)) {
                this.navigateMainToBuild();
            }
        });

        this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
            if (this.hasState(SceneState.mountBuild)) {
                // if current is mouting item
                // find closest mout pos, and render the image
                const camPosx = this.mainScene.cameras.main.scrollX;
                const camPosy = this.mainScene.cameras.main.scrollY;

                const x = pointer.worldX + camPosx;
                const y = pointer.worldY + camPosy;

                let smallestVal = Number.MAX_SAFE_INTEGER;
                let hasItem = false;
                let resX: number;
                let resY: number;

                this.mainScene.Map.cannonMoutPos.forEach((e, key) => {
                    let cpos = this.mainScene.Map.getMountPosById(key);

                    let r = Phaser.Math.Distance.Between(x, y, cpos.x, cpos.y);

                    if (r < smallestVal) {
                        resX = cpos.x;
                        resY = cpos.y;
                        hasItem = Boolean(e);

                        smallestVal = r;
                    }
                });

                // todo : check if target is colliding with player

                this.mountItemInfo = {
                    viewX: resX - camPosx,
                    viewY: resY - camPosy,
                    worldX: resX,
                    worldY: resY,
                    hasItem,
                };
            }
        });

        this.input.keyboard.on("keyup-ESC", () => {
            if (this.hasState(SceneState.main)) {
                this.navigateMainToMenu();
            } else if (this.hasState(SceneState.itemsToBuild)) {
                this.navigateBuildTomain();
            } else if (this.hasState(SceneState.menu)) {
                this.navigateMenuToMain();
            } else if (this.hasState(SceneState.mountBuild)) {
                this.navigateMountToBuild();
            }
        });

        this.input.on("pointerup", () => {
            if (this.hasState(SceneState.mountBuild)) {
                // check if mount is posiable
                if (!this.mountItemInfo.hasItem) {
                    // add monut item to game
                    this.mainScene.Cannons.addNewCannon(this.mountItemInfo.worldX, this.mountItemInfo.worldY);

                    this.navigateMountToMain();
                }
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
        this.mainScene = this.game.scene.getScene("main") as any;

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

        this.updates.push({
            state: SceneState.menu,
            update: () => {},
            rerender: this.rerenderMenu,
            cleanup: this.cleanupMenu,
        });

        this.updates.push({
            state: SceneState.mountBuild,
            update: this.updateMountItem,
            rerender: this.rerenderMountItem,
            cleanup: this.cleanupMountItem,
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
