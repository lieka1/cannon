import { Input, Physics, Scene } from "phaser";

export class Player extends Physics.Arcade.Sprite {
    private keyW: Input.Keyboard.Key;
    private keyA: Input.Keyboard.Key;
    private keyS: Input.Keyboard.Key;
    private keyD: Input.Keyboard.Key;
    private keySpace: Input.Keyboard.Key;

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, "king");

        scene.add.existing(this);
        scene.physics.add.existing(this);

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
        this.body.setSize(30, 30);
        this.body.setOffset(8, 0);

        this.on("destroy", () => {
            this.keySpace.removeAllListeners();
        });
    }

    update(): void {
        (this.body as Physics.Arcade.Body).setVelocity(0);

        let running = false;

        if (this.keyW?.isDown) {
            this.body.velocity.y = -110;
            !this.anims.isPlaying && this.anims.play("player_run", true);

            running = true;
        }

        if (this.keyA?.isDown) {
            this.body.velocity.x = -110;
            this.checkFlip();
            this.body.setOffset(48, 15);
            !this.anims.isPlaying && this.anims.play("player_run", true);
            running = true;
        }

        if (this.keyS?.isDown) {
            this.body.velocity.y = 110;
            !this.anims.isPlaying && this.anims.play("player_run", true);
            running = true;
        }

        if (this.keyD?.isDown) {
            this.body.velocity.x = 110;
            this.checkFlip();
            this.body.setOffset(15, 15);
            !this.anims.isPlaying && this.anims.play("player_run", true);
            running = true;
        }

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
