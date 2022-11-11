import { Input, Physics, Scene } from "phaser";
import { CannonBase } from "./actor/base/cannon";
import { BasicCannon } from "./actor/cannon/BasicCannon";
import Main from "./game";

enum PlayerFacing {
    top,
    bottom,
    left,
    right,
    topRight,
    topLeft,
    bottomRight,
    bottomLeft,
}

export class Player extends Physics.Arcade.Sprite {
    private keyW: Input.Keyboard.Key;
    private keyA: Input.Keyboard.Key;
    private keyS: Input.Keyboard.Key;
    private keyD: Input.Keyboard.Key;
    private keySpace: Input.Keyboard.Key;
    private playerSpeed = 200;
    facing: PlayerFacing = PlayerFacing.right;

    constructor(scene: Scene, mapwidth: number) {
        super(scene, mapwidth / 2, 300, "king");
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);

        // KEYS
        this.keyW = this.scene.input.keyboard.addKey("W");
        this.keyA = this.scene.input.keyboard.addKey("A");
        this.keyS = this.scene.input.keyboard.addKey("S");
        this.keyD = this.scene.input.keyboard.addKey("D");
        this.keySpace = this.scene.input.keyboard.addKey(32);
        this.keySpace.on("down", (event: KeyboardEvent) => {
            //   this.anims.play('attack', true);
            //   this.scene.game.events.emit(EVENTS_NAME.attack);
        });

        // PHYSICS
        this.body.setSize(32, 32);

        this.on("destroy", () => {
            this.keySpace.removeAllListeners();
        });
    }

    getFacingOffset(): { offsetX: number; offsetY: number } {
        let offsetX = 0;
        let offsetY = 0;

        switch (this.facing) {
            case PlayerFacing.top:
                offsetY = -1;
                break;
            case PlayerFacing.bottom:
                offsetY = 1;
                break;
            case PlayerFacing.left:
                offsetX = -1;
                break;
            case PlayerFacing.right:
                offsetX = 1;
                break;
            case PlayerFacing.topRight:
                offsetY = -1;
                offsetX = 1;
                break;
            case PlayerFacing.topLeft:
                offsetY = -1;
                offsetX = -1;
                break;
            case PlayerFacing.bottomRight:
                offsetY = 1;
                offsetX = 1;
                break;
            case PlayerFacing.bottomLeft:
                offsetY = 1;
                offsetX = -1;
                break;
        }

        return { offsetX, offsetY };
    }

    update(): void {
        let s = this.scene as Main;

        (this.body as Physics.Arcade.Body).setVelocity(0);

        let running = false;

        if (this.keyW?.isDown) {
            this.body.velocity.y = -this.playerSpeed;
            this.anims.getName() != "player_run" &&
                this.anims.play("player_run", true);

            running = true;
        }

        if (this.keyA?.isDown) {
            this.body.velocity.x = -this.playerSpeed;
            this.scaleX = -1;
            this.setOffset(32, 0);

            this.anims.getName() != "player_run" &&
                this.anims.play("player_run", true);

            running = true;
        }

        if (this.keyS?.isDown) {
            this.body.velocity.y = this.playerSpeed;
            this.anims.getName() != "player_run" &&
                this.anims.play("player_run", true);

            running = true;
        }

        if (this.keyD?.isDown) {
            this.body.velocity.x = this.playerSpeed;
            this.scaleX = 1;
            this.setOffset(0, 0);

            this.anims.getName() != "player_run" &&
                this.anims.play("player_run", true);

            running = true;
        }

        this.body.velocity.limit(this.playerSpeed);

        let newFaceing = undefined;

        if (this.body.velocity.x != 0 || this.body.velocity.y != 0) {
            if (this.body.velocity.x > 0) {
                newFaceing = PlayerFacing.right;
            }
            if (this.body.velocity.x < 0) {
                newFaceing = PlayerFacing.left;
            }

            if (this.body.velocity.y > 0) {
                if (newFaceing == PlayerFacing.right) {
                    newFaceing = PlayerFacing.bottomRight;
                } else if (newFaceing == PlayerFacing.left) {
                    newFaceing = PlayerFacing.bottomLeft;
                } else {
                    newFaceing = PlayerFacing.bottom;
                }
            }

            if (this.body.velocity.y < 0) {
                if (newFaceing == PlayerFacing.right) {
                    newFaceing = PlayerFacing.topRight;
                } else if (newFaceing == PlayerFacing.left) {
                    newFaceing = PlayerFacing.topLeft;
                } else {
                    newFaceing = PlayerFacing.top;
                }
            }

            this.facing = newFaceing;
        }

        if (!running) {
            if (this.anims.getName() != "player_idle")
                this.anims.play("player_idle");
        }

        // place cannon
        if (this.keySpace.isDown) {
            let offsetInfo = this.getFacingOffset();

            let offsetX = offsetInfo.offsetX * 32;
            let offsetY = offsetInfo.offsetY * 48;

            let newCannon = new BasicCannon(
                this.scene,
                this.x + offsetX,
                this.y + offsetY
            );

            s.Cannons.addNew(newCannon);

            s.physics.add.collider(
                this,
                s.Cannons.data,
            );
        }
    }

    protected checkFlip(): void {
        if (this.body.velocity.x < 0) {
            this.scaleX = -1;
        } else {
            this.scaleX = 1;
        }
    }
}
