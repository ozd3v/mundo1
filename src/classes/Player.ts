import { Actor } from './Actor';
import { actorConfig } from "../types";

export class Player extends Actor {

    private keyW: Phaser.Input.Keyboard.Key | undefined;
    private keyA: Phaser.Input.Keyboard.Key | undefined;
    private keyS: Phaser.Input.Keyboard.Key | undefined;
    private keyD: Phaser.Input.Keyboard.Key | undefined;
    private config: actorConfig;
    private direction: string = 'stand';

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, config: actorConfig) {
        super(scene, x, y, texture);
        this.config = config;
        // KEYS
        if (this.scene.input.keyboard) {
            this.keyW = this.scene.input.keyboard.addKey('W');
            this.keyA = this.scene.input.keyboard.addKey('A');
            this.keyS = this.scene.input.keyboard.addKey('S');
            this.keyD = this.scene.input.keyboard.addKey('D');
        }

        // PHYSICS
        this.getBody().setSize(48, 48);
        //this.getBody().setOffset(8, 0);
    }
    public getDirection(): string {
        return this.direction;
    }

    update(): void {
        this.getBody().setVelocity(0);
        if (!this.body) return;
        if (this.keyW?.isDown) {
            this.body.velocity.y = -110;
            this.direction = 'up'
            this.play({
                key: this.config.prefix + 'up',
                repeat: this.config.repeat,
                frameRate: this.config.frameRate,
            }, true)
        }
        if (this.keyA?.isDown) {
            this.body.velocity.x = -110;
            //this.checkFlip();
            //this.getBody().setOffset(48, 0);
            this.direction = 'left';
            this.play({
                key: this.config.prefix + 'left',
                repeat: this.config.repeat,
                frameRate: this.config.frameRate,
            }
                , true);
        }
        if (this.keyS?.isDown) {
            this.body.velocity.y = 110;
            this.direction = 'down';
            this.play({
                key: this.config.prefix + 'down',
                repeat: this.config.repeat,
                frameRate: this.config.frameRate,
            }, true)
        }
        if (this.keyD?.isDown) {
            this.body.velocity.x = 110;
            this.direction = 'right';
            this.play({
                key: this.config.prefix + 'right',
                repeat: this.config.repeat,
                frameRate: this.config.frameRate,
            }
                , true);
        }

    }
}