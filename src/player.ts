import { Input, Physics, Scene } from "phaser";

export class Player extends Physics.Arcade.Sprite {
    private keyW: Input.Keyboard.Key;
    private keyA: Input.Keyboard.Key;
    private keyS: Input.Keyboard.Key;
    private keyD: Input.Keyboard.Key;
    private keySpace: Input.Keyboard.Key;
    private playerSpeed = 1000;

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, "king");
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

    update(): void {
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

        this.body.velocity.limit(this.playerSpeed)

        if (!running) {
            if (this.anims.getName() != "player_idle")
                this.anims.play("player_idle");
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
