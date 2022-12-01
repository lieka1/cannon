import { CannonBase } from "./actor/base/cannon";
import { MenuText } from "./actor/ui/MenuText";
import { MenuBackground } from "./actor/ui/MenuBackground";
import { MenuButton } from "./actor/ui/MenuButton";
import { MenuTextButton } from "./actor/ui/MenuTextButton";
import { MenuWindow } from "./actor/ui/MenuWindow";
import Main from "./game";
import { ItemManager } from "./manager/ItemManager";
import { CastleScene } from "./manager/MapManager";
import { MenuImageButton } from "./actor/ui/MenuImageButton";
import { Building, MenuBuildingInfo } from "./actor/base/building";

//@ts-ignore
import enemy_img from "./asset/enemy/enemy.png";
//@ts-ignore
import enemy_atlas from "./asset/enemy/enemy_atlas.json";
import { GoldMine } from "./actor/building/GoldMine";
import { checkRoundAvaliable, getMountPosById } from "./manager/CannonManager";
import { MenuHover } from "./actor/ui/MenuHover";
import { HealthBar } from "./actor/ui/HealthBar";
import { MenuBase } from "./actor/ui/MenuBase";
import { GoldRefinery } from "./actor/building/Refinery";
import { Tavern } from "./actor/building/tavern";
import { room as Room } from "./actor/building/Room";
import { Library } from "./actor/building/Library";

export enum SceneState {
    main = 1 << 0,
    itemsToBuild = 1 << 1,
    fps = 1 << 2,
    menu = 1 << 3,
    mountBuild = 1 << 4,
    buildingInfo = 1 << 5,
    goldNum = 1 << 6,
    GateHealth = 1 << 7,
    GameEnd = 1 << 8,
}

export interface RenderUpdates {
    state: SceneState;
    cleanup: () => void;
    update: (time: number) => void;
    rerender: () => void;
}

export class Ui extends Phaser.Scene {
    mainScene: Main;
    windows: Set<MenuWindow> = new Set();
    // cursor info
    curserPos: { x: number; y: number } = { x: -1000, y: -1000 }; // cursor pos relative to ui

    updates: RenderUpdates[] = [];

    items: ItemManager = new ItemManager();

    // configs
    renderConfig: number = SceneState.main;
    lastRenderConfig: number = 0;

    // menu feilds

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

    // info feilds
    selectItem: Building;
    menuWindow: MenuBuildingInfo;

    constructor() {
        super({ key: "ui" });
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
    ///             game end
    ///
    ////////////////////////////////////////////
    gameEndButtons: MenuButton[];

    cleanupGameEnd() {
        this.gameEndButtons.forEach((e) => {
            e.destroy();
        });
    }

    rerenderGameEnd() {
        this.gameEndButtons = [];

        const totalHeight = this.game.scale.height;
        const totalWidth = this.game.scale.width;

        const renderWidth = 200;

        const leftMargin = (this.game.scale.width - renderWidth) / 2;

        const totalItems = 2;
        const topMargin = (totalHeight - this.bottomHeight * totalItems) / 2;

        this.gameEndButtons.push(
            new MenuTextButton(
                this,
                () => {
                    let m = this.mainScene;

                    this.mainScene = null;

                    this.cleanupAll();

                    m.scene.restart();

                    this.navigateEndToMain();
                },
                leftMargin,
                topMargin,
                "restart",
                {
                    size: {
                        width: renderWidth,
                        height: this.bottomHeight,
                    },
                }
            )
        );
    }

    ////////////////////////////////////////////
    ///
    ///             fps
    ///
    ////////////////////////////////////////////
    renderFps: MenuText;
    lastUpdate: number = 0;

    cleanupFps() {
        if (this.renderFps) {
            this.renderFps.destroy();
        }
    }

    rerenderFps() {
        this.renderFps = new MenuText(this, 1000, 1000, "0", {
            fontSize: "calc(100vw / 35)",
        });
    }

    updateFps(time: number) {
        if (time - this.lastUpdate > 1000) {
            const totalWidth = this.game.scale.width;

            this.renderFps.setText(
                Math.round(this.game.loop.actualFps).toString()
            );
            const renderWidth = this.renderFps.width;

            this.renderFps.setPosition(
                totalWidth - renderWidth,
                this.coinTxt.height
            );

            this.lastUpdate = time;
        }
    }

    ////////////////////////////////////////////
    ///
    ///             main
    ///
    ////////////////////////////////////////////
    bottomHeight: number = 70;
    itemCount: number = 5;
    sideColor = 0x993300;

    mainFrames: MenuButton[] = [];

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
                    "",
                    {
                        size: {
                            height: this.bottomHeight,
                            width: this.bottomHeight,
                        },
                    }
                )
            );
        }
    }

    ////////////////////////////////////////////
    ///
    ///             gate health
    ///
    ////////////////////////////////////////////
    healthBars: HealthBar[] = [];

    cleaupGateHealth() {
        this.healthBars.forEach((e) => {
            e.destroy();
        });
    }

    rerenderGateHealth() {
        this.healthBars = [];

        const totalWidth = this.scale.width;

        this.healthBars.push(
            new HealthBar(this, totalWidth / 4, 0, totalWidth / 2, 15, {
                name: "gate 1",
                showNum: true,
            })
        );

        this.healthBars.push(
            new HealthBar(this, totalWidth / 4, 15, totalWidth / 2, 15, {
                name: "gate 2",
                showNum: true,
            })
        );
        this.healthBars.push(
            new HealthBar(this, totalWidth / 4, 30, totalWidth / 2, 15, {
                name: "gate 3",
                showNum: true,
            })
        );
    }

    updateGateHealth() {
        let gate = this.mainScene.Gates;

        this.healthBars[0].updatePercent(gate.hp1, gate.totalhp1);
        this.healthBars[1].updatePercent(gate.hp2, gate.totalhp2);
        this.healthBars[2].updatePercent(gate.hp3, gate.totalhp3);
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
            this.mountBackUnavilableground.destroy();
        }
    }

    rerenderMountItem() {
        let texture = this.getBuildingTextureInfo();

        this.mountItem = this.add.image(-1000, -1000, texture.texture);

        this.mountBackground = new MenuBackground(
            this,
            this.mountItemInfo.viewX,
            this.mountItemInfo.viewY,
            texture.width,
            texture.height,
            0x00ff00,
            0xb0
        );

        this.mountBackUnavilableground = new MenuBackground(
            this,
            this.mountItemInfo.viewX,
            this.mountItemInfo.viewY,
            texture.width,
            texture.height,
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
    ///             golds
    ///
    ////////////////////////////////////////////
    coinImg: Phaser.GameObjects.TileSprite;
    coinTxt: Phaser.GameObjects.Text;
    coinNum: number = -1;

    cleanupGoldNum() {
        if (this.coinImg) {
            this.coinImg.destroy();
            this.coinTxt.destroy();
        }
    }

    rerenderGoldNum() {
        const totalWidth = this.game.scale.width;

        this.coinImg = new Phaser.GameObjects.TileSprite(
            this,
            0,
            0,
            0,
            0,
            "enemy",
            "coin_anim_f0"
        );

        this.coinImg.setScale(2);

        this.add.existing(this.coinImg);

        this.coinImg.setPosition(
            totalWidth - this.coinImg.width,
            this.coinImg.height
        );

        this.coinTxt = new MenuText(this, 0, 0, "");
    }

    updateMountGoldNum(time: number) {
        let last = this.mainScene.gold.current;
        if (last === this.coinNum) {
            return;
        }
        const totalWidth = this.game.scale.width;

        this.coinTxt.setText(last.toString());

        const renderWidth = this.coinTxt.width + this.coinImg.width * 2;

        this.coinTxt.setPosition(totalWidth - renderWidth, 0);

        this.coinNum = last;
    }
    ////////////////////////////////////////////
    ///
    ///             build select
    ///
    ////////////////////////////////////////////
    mountBuilding: () => void;
    getBuildingTextureInfo: () => {
        texture: string;
        width: number;
        height: number;
    };
    getBuildingMountInfo: () => Map<number, undefined | Object>;
    buildItemButtons: MenuButton[] = [];
    buildItemHover: MenuHover[] = [];

    cleanupBuildSelect() {
        this.buildItemButtons.forEach((e) => {
            e.destroy();
        });
        this.buildItemHover.forEach((e) => {
            e.destroy();
        });

        this.buildItemButtons = [];
        this.buildItemHover = [];
    }

    rerenderBuildSelect() {
        this.buildItemButtons = [];
        this.buildItemHover = [];

        const lineHeight = this.bottomHeight;
        const totalHeight = this.game.scale.height;
        const itemSizeHalf = this.bottomHeight / 2;
        const totalLen = this.bottomHeight * this.itemCount;
        const leftMargin = (this.game.scale.width - totalLen) / 2;
        const mountHeight = (totalHeight - this.bottomHeight) / 2;
        const startYpos = mountHeight - (lineHeight + lineHeight / 2);

        let currentLine = 0;
        let currentIndex = 0;
        let buttonIndex = 0;

        this.buildItemButtons.push(
            new MenuImageButton(
                this,
                () => {
                    this.mountBuilding = () => {
                        this.mainScene.Cannons.addNewCannon(
                            this.mountItemInfo.worldX,
                            this.mountItemInfo.worldY
                        );
                    };
                    this.getBuildingTextureInfo = () => ({
                        texture: "cannon_base",
                        width: 32,
                        height: 32,
                    });
                    this.getBuildingMountInfo = () =>
                        this.mainScene.Cannons.cannonMountPos;

                    this.navigateBuildToMount();
                },
                leftMargin + itemSizeHalf + currentIndex * this.bottomHeight,
                startYpos + currentLine * lineHeight,
                this.bottomHeight,
                this.bottomHeight,
                { texture: "cannon_base" }
            )
        );

        this.buildItemHover.push(
            new MenuHover(
                this,
                this.buildItemButtons[buttonIndex],
                "A cannon base, if you want to build cannon, \nYou have to put cannon on the cannon base.\nYou have to build it on the castle top floor."
            )
        );

        if (this.mainScene.Map.playerCastleFloor !== CastleScene.topOutside) {
            this.buildItemButtons[buttonIndex].disable();
        }

        currentIndex++;
        buttonIndex++;

        this.buildItemButtons.push(
            new MenuImageButton(
                this,
                () => {
                    let f = this.mainScene.Map.playerCastleFloor;

                    this.mountBuilding = () => {
                        this.mainScene.Building.addBuilding(
                            new Library(
                                this.mainScene,
                                this.mountItemInfo.worldX,
                                this.mountItemInfo.worldY
                            ),
                            f
                        );
                    };
                    this.getBuildingTextureInfo = () => ({
                        texture: "building_library",
                        width: 128,
                        height: 48,
                    });

                    let cb = this.mainScene.Building.getMountPosByScene(
                        this.mainScene.Map.playerCastleFloor
                    );
                    if (!cb) {
                        return;
                    }

                    this.getBuildingMountInfo = cb;

                    this.navigateBuildToMount();
                },
                leftMargin + itemSizeHalf + currentIndex * this.bottomHeight,
                startYpos + currentLine * lineHeight,
                this.bottomHeight,
                this.bottomHeight,
                { texture: "building_library" },
                { resize: true }
            )
        );

        this.buildItemHover.push(
            new MenuHover(
                this,
                this.buildItemButtons[buttonIndex],
                "A library, upgrade you castle here\nYou have to build it inside castle."
            )
        );

        if (
            this.mainScene.Map.playerCastleFloor !== CastleScene.first &&
            this.mainScene.Map.playerCastleFloor !== CastleScene.second
        ) {
            this.buildItemButtons[buttonIndex].disable();
        }
        currentIndex++;
        buttonIndex++;

        this.buildItemButtons.push(
            new MenuImageButton(
                this,
                () => {
                    let f = this.mainScene.Map.playerCastleFloor;

                    this.mountBuilding = () => {
                        this.mainScene.Building.addBuilding(
                            new Library(
                                this.mainScene,
                                this.mountItemInfo.worldX,
                                this.mountItemInfo.worldY
                            ),
                            f
                        );
                    };
                    this.getBuildingTextureInfo = () => ({
                        texture: "building_library",
                        width: 128,
                        height: 48,
                    });

                    let cb = this.mainScene.Building.getMountPosByScene(
                        this.mainScene.Map.playerCastleFloor
                    );
                    if (!cb) {
                        return;
                    }

                    this.getBuildingMountInfo = cb;

                    this.navigateBuildToMount();
                },
                leftMargin + itemSizeHalf + currentIndex * this.bottomHeight,
                startYpos + currentLine * lineHeight,
                this.bottomHeight,
                this.bottomHeight,
                { texture: "building_library" },
                { resize: true }
            )
        );

        this.buildItemHover.push(
            new MenuHover(
                this,
                this.buildItemButtons[buttonIndex],
                "A Room, upgrade you castle here\nYou have to build it inside castle."
            )
        );

        if (
            this.mainScene.Map.playerCastleFloor !== CastleScene.first &&
            this.mainScene.Map.playerCastleFloor !== CastleScene.second
        ) {
            this.buildItemButtons[buttonIndex].disable();
        }

        currentIndex = 0;
        buttonIndex++;
        currentLine = 1;

        this.buildItemButtons.push(
            new MenuImageButton(
                this,
                () => {
                    this.mountBuilding = () => {
                        this.mainScene.Building.addOutsideBuiding(
                            new GoldMine(
                                this.mainScene,
                                this.mountItemInfo.worldX,
                                this.mountItemInfo.worldY
                            )
                        );
                    };
                    this.getBuildingTextureInfo = () => ({
                        texture: "building_gold_mine",
                        width: 64,
                        height: 64,
                    });

                    this.getBuildingMountInfo = () =>
                        this.mainScene.Building.GroundOutsideMountPos;
                    this.navigateBuildToMount();
                },
                leftMargin + itemSizeHalf + currentIndex * this.bottomHeight,
                startYpos + currentLine * lineHeight,
                this.bottomHeight,
                this.bottomHeight,
                { texture: "building_gold_mine" }
            )
        );

        this.buildItemHover.push(
            new MenuHover(
                this,
                this.buildItemButtons[buttonIndex],
                "A gold mine, will mining gold. \nYou can build ore refinery to add productivity.\nYou have to build it on ground floor."
            )
        );

        if (this.mainScene.Map.playerCastleFloor !== CastleScene.firstOutSide) {
            this.buildItemButtons[buttonIndex].disable();
        }

        currentIndex += 1;
        buttonIndex++;

        this.buildItemButtons.push(
            new MenuImageButton(
                this,
                () => {
                    this.mountBuilding = () => {
                        this.mainScene.Building.addOutsideBuiding(
                            new Tavern(
                                this.mainScene,
                                this.mountItemInfo.worldX,
                                this.mountItemInfo.worldY
                            )
                        );
                    };
                    this.getBuildingTextureInfo = () => ({
                        texture: "building_tavern",
                        width: 64,
                        height: 64,
                    });

                    this.getBuildingMountInfo = () =>
                        this.mainScene.Building.GroundOutsideMountPos;
                    this.navigateBuildToMount();
                },
                leftMargin + itemSizeHalf + currentIndex * this.bottomHeight,
                startYpos + currentLine * lineHeight,
                this.bottomHeight,
                this.bottomHeight,
                { texture: "building_tavern" }
            )
        );

        this.buildItemHover.push(
            new MenuHover(
                this,
                this.buildItemButtons[buttonIndex],
                "A tavern, You can hire soldier here. \nYou have to build it on ground floor."
            )
        );

        if (this.mainScene.Map.playerCastleFloor !== CastleScene.firstOutSide) {
            this.buildItemButtons[buttonIndex].disable();
        }

        currentIndex += 1;
        buttonIndex++;

        this.buildItemButtons.push(
            new MenuImageButton(
                this,
                () => {
                    this.mountBuilding = () => {
                        this.mainScene.Building.addOutsideBuiding(
                            new GoldRefinery(
                                this.mainScene,
                                this.mountItemInfo.worldX,
                                this.mountItemInfo.worldY
                            )
                        );
                    };
                    this.getBuildingTextureInfo = () => ({
                        texture: "building_refinery",
                        width: 96,
                        height: 128,
                    });

                    this.getBuildingMountInfo = () =>
                        this.mainScene.Building.GroundOutsideMountPos;
                    this.navigateBuildToMount();
                },
                leftMargin + itemSizeHalf + currentIndex * this.bottomHeight,
                startYpos + currentLine * lineHeight,
                this.bottomHeight,
                this.bottomHeight,
                { texture: "building_refinery" },
                { resize: true }
            )
        );

        this.buildItemHover.push(
            new MenuHover(
                this,
                this.buildItemButtons[buttonIndex],
                "A gold refinery, \nCan double the gold preduce by gold mine.\nYou can only build one refinery\nYou have to build it on ground floor."
            )
        );

        // check if aready has a refinery
        if (
            this.mainScene.Building.hasGoldRefinery ||
            this.mainScene.Map.playerCastleFloor !== CastleScene.firstOutSide
        ) {
            this.buildItemButtons[buttonIndex].disable();
        }

        currentIndex += 1;
        buttonIndex++;

        this.buildItemButtons.push(
            new MenuImageButton(
                this,
                () => {
                    this.mountBuilding = () => {
                        this.mainScene.Building.addOutsideBuiding(
                            new Room(
                                this.mainScene,
                                this.mountItemInfo.worldX,
                                this.mountItemInfo.worldY
                            )
                        );
                    };
                    this.getBuildingTextureInfo = () => ({
                        texture: "building_room",
                        width: 64,
                        height: 64,
                    });

                    let cb = this.mainScene.Building.getMountPosByScene(
                        this.mainScene.Map.playerCastleFloor
                    );
                    if (!cb) {
                        return;
                    }

                    this.getBuildingMountInfo = cb;

                    this.navigateBuildToMount();
                },
                leftMargin + itemSizeHalf + currentIndex * this.bottomHeight,
                startYpos + currentLine * lineHeight,
                this.bottomHeight,
                this.bottomHeight,
                { texture: "building_room" },
                { resize: true }
            )
        );

        this.buildItemHover.push(
            new MenuHover(
                this,
                this.buildItemButtons[buttonIndex],
                "A room, \nSoliders will live here.\nYou have to build it inside castle."
            )
        );

        if (
            this.mainScene.Map.playerCastleFloor !== CastleScene.first &&
            this.mainScene.Map.playerCastleFloor !== CastleScene.second
        ) {
            this.buildItemButtons[buttonIndex].disable();
        }
    }

    updateBuildSelect() {
        this.buildItemHover.forEach((e) => {
            e.update(this.curserPos.x, this.curserPos.y);
        });
    }

    ////////////////////////////////////////////
    ///
    ///             menu
    ///
    ////////////////////////////////////////////
    menus: MenuBase[] = [];

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
                "continue",
                {
                    size: {
                        width: renderWidth,
                        height: this.bottomHeight,
                    },
                }
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
                "toggle fps",
                {
                    size: {
                        width: renderWidth,
                        height: this.bottomHeight,
                    },
                }
            )
        );
    }
    ////////////////////////////////////////////
    ///
    ///             building information
    ///
    ////////////////////////////////////////////
    cleanupBuildingInfo() {
        this.menuWindow.destroy();
    }

    rerenderBuildingInfo() {
        this.menuWindow = this.selectItem.getBuildingInfo(this);
        this.menuWindow.setCloseFn(() => {
            this.navigateInfoToMain();
        });
    }

    ////////////////////////////////////////////
    ///
    ///             window
    ///
    ////////////////////////////////////////////

    addWindow(w: MenuWindow) {
        this.windows.add(w);
    }

    removeWindow(w: MenuWindow) {
        this.windows.delete(w);
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

    navigateMainToInfo() {
        this.addState(SceneState.buildingInfo);
        this.removeState(SceneState.main);
    }

    navigateInfoToMain() {
        this.addState(SceneState.main);
        this.removeState(SceneState.buildingInfo);
    }

    navigateMainToEnd() {
        this.renderConfig = 0;
        this.addState(SceneState.GameEnd);
    }

    navigateEndToMain() {
        this.removeState(SceneState.GameEnd);
        this.addState(SceneState.main);
    }

    ////////////////////////////////////////////
    ///
    ///             control
    ///
    ////////////////////////////////////////////
    cleanupAll() {
        this.updates.forEach((e) => {
            if (this.hasLastState(e.state)) {
                e.cleanup.apply(this, []);
                this.removeLastState(e.state);
            }
        }, this);
    }

    reinitState() {
        this.addState(SceneState.fps);
        this.addState(SceneState.goldNum);
        this.addState(SceneState.GateHealth);
    }

    initControl() {
        this.input.keyboard.on("keyup-B", () => {
            if (this.hasState(SceneState.main)) {
                this.navigateMainToBuild();
            }
        });

        this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
            this.curserPos = { x: pointer.worldX, y: pointer.worldY };

            if (this.hasState(SceneState.mountBuild)) {
                const buildingInfo = this.getBuildingTextureInfo();

                const xSize = buildingInfo.height / 32;
                const ySize = buildingInfo.width / 32;

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

                let mountInfo = this.getBuildingMountInfo();

                mountInfo.forEach((e, key) => {
                    let cpos = getMountPosById(key);

                    let r = Phaser.Math.Distance.Between(x, y, cpos.x, cpos.y);

                    if (r < smallestVal) {
                        // check mount size limit
                        let cInfo = checkRoundAvaliable(
                            mountInfo,
                            cpos.x,
                            cpos.y,
                            xSize,
                            ySize
                        );
                        if (cInfo.collideEdge) {
                            return;
                        }

                        resX = cpos.x;
                        resY = cpos.y;
                        hasItem = cInfo.hasItem;

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
            } else if (this.hasState(SceneState.buildingInfo)) {
                this.navigateInfoToMain();
            }
        });

        this.input.on("pointerup", (pointer: Phaser.Input.Pointer) => {
            if (this.hasState(SceneState.mountBuild)) {
                // check if mount is posiable
                if (!this.mountItemInfo.hasItem) {
                    // add monut item to game
                    this.mountBuilding();

                    this.navigateMountToMain();
                }
            } else if (this.hasState(SceneState.main)) {
                if (!this.mainScene) return;
                const camPosx = this.mainScene.cameras.main.scrollX;
                const camPosy = this.mainScene.cameras.main.scrollY;

                const x = pointer.worldX + camPosx;
                const y = pointer.worldY + camPosy;

                let smallestVal = Number.MAX_SAFE_INTEGER;
                let hasItem = false;
                let resX: number;
                let resY: number;
                let foundItem: Building;

                switch (this.mainScene.Map.playerCastleFloor) {
                    case CastleScene.topOutside:
                        // check cannon base selection
                        this.mainScene.Cannons.cannonMountPos.forEach(
                            (e, key) => {
                                let cpos = getMountPosById(key);

                                let r = Phaser.Math.Distance.Between(
                                    x,
                                    y,
                                    cpos.x,
                                    cpos.y
                                );

                                if (r < smallestVal) {
                                    resX = cpos.x;
                                    resY = cpos.y;
                                    hasItem = Boolean(e);

                                    smallestVal = r;
                                    foundItem = e;
                                }
                            }
                        );

                        if (smallestVal < 8 && foundItem) {
                            this.selectItem = foundItem;
                            this.navigateMainToInfo();
                        }
                        break;
                    case CastleScene.firstOutSide:
                        // check cannon base selection
                        this.mainScene.Building.GroundOutsideMountPos.forEach(
                            (e, key) => {
                                let cpos = getMountPosById(key);

                                let r = Phaser.Math.Distance.Between(
                                    x,
                                    y,
                                    cpos.x,
                                    cpos.y
                                );

                                if (r < smallestVal) {
                                    resX = cpos.x;
                                    resY = cpos.y;
                                    hasItem = Boolean(e);

                                    smallestVal = r;
                                    foundItem = e;
                                }
                            }
                        );

                        if (smallestVal < 16 && foundItem) {
                            this.selectItem = foundItem;
                            this.navigateMainToInfo();
                        }

                        break;
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
        this.addState(SceneState.fps);
        this.addState(SceneState.goldNum);
        this.addState(SceneState.GateHealth);

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
            update: this.updateBuildSelect,
            rerender: this.rerenderBuildSelect,
            cleanup: this.cleanupBuildSelect,
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

        this.updates.push({
            state: SceneState.buildingInfo,
            update: () => {},
            rerender: this.rerenderBuildingInfo,
            cleanup: this.cleanupBuildingInfo,
        });

        this.updates.push({
            state: SceneState.goldNum,
            update: this.updateMountGoldNum,
            rerender: this.rerenderGoldNum,
            cleanup: this.cleanupGoldNum,
        });

        this.updates.push({
            state: SceneState.GateHealth,
            update: this.updateGateHealth,
            rerender: this.rerenderGateHealth,
            cleanup: this.cleaupGateHealth,
        });

        this.updates.push({
            state: SceneState.GameEnd,
            update: () => {},
            rerender: this.rerenderGameEnd,
            cleanup: this.cleanupGameEnd,
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

        this.windows.forEach((e) => {
            e.update();
        });
        // check if game ended
    }
}
