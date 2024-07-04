import { Actor, ActorState } from './Actor';
import { actorConfig } from "../types";

export class Player extends Actor {

    private keyW: Phaser.Input.Keyboard.Key | undefined;
    private keyA: Phaser.Input.Keyboard.Key | undefined;
    private keyS: Phaser.Input.Keyboard.Key | undefined;
    private keyD: Phaser.Input.Keyboard.Key | undefined;
    private keyK: Phaser.Input.Keyboard.Key | undefined;
    private direction: string = 'stand';
    private pointer: Phaser.Input.Pointer | undefined;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, config: actorConfig) {
        super(scene, x, y, texture, config);
        // KEYS
        if (this.scene.input.keyboard) {
            this.keyW = this.scene.input.keyboard.addKey('W');
            this.keyA = this.scene.input.keyboard.addKey('A');
            this.keyS = this.scene.input.keyboard.addKey('S');
            this.keyD = this.scene.input.keyboard.addKey('D');
            this.keyK = this.scene.input.keyboard.addKey('K');
        }
        this.pointer = this.scene.input.activePointer;

        // PHYSICS
        //this.getBody().setSize(48, 48);
        //this.getBody().setOffset(5, 8);
        //this.hitarea1 = this.scene.add.rectangle(this.x, this.y, this.width, this.height, 0x00ff00, 0.5);

        this.on('animationupdate', (animation, frame, gameObject) => {

            if (animation.key === this.getConfig().prefix + 'stand') { // Asegúrate de cambiar 'stand' por el nombre correcto de la animación de ataque
                this.setAttackFrameProperties(frame.index);
                console.log(frame.index)
            }
        });
    }
    public getDirection(): string {
        return this.direction;
    }

    private setAttackFrameProperties(frameIndex: number): void {
        if (frameIndex === 5) {
            this.setBodySize(72, 64);
            // Ajusta el offset según tus necesidades
            this.setOffset(0, 8);
            this.setOrigin(0.5, 0.25);
        }
        else if (frameIndex === 6) {
            this.setBodySize(72, 64);
            // Ajusta el offset según tus necesidades
            this.setOffset(8, 0);
            this.setOrigin(0.25, 0.5);
        } else {
            this.setBodySize(64, 64); // el tamaño original
            this.setOffset(0, 0); // el offset original
            this.setOrigin(0.5, 0.5); // Restablece al origen predeterminado
        }
    }

    update(): void {
        this.getBody().setVelocity(0);
        let isWalking = false;


        if (!this.body) return;

        if (this.pointer?.leftButtonDown()) {
            console.log('left mouse button clicked');
        }
        if (this.keyW?.isDown) {
            this.body.velocity.y = -110;
            this.currentState = ActorState.WALKING;
            this.direction = 'up'
            this.playAnimation('up');
            isWalking = true;
        }
        if (this.keyA?.isDown) {
            this.body.velocity.x = -110;
            this.direction = 'left';
            this.currentState = ActorState.WALKING;
            this.playAnimation('left');
            isWalking = true;
        }
        if (this.keyS?.isDown) {
            this.body.velocity.y = 110;
            this.direction = 'down';
            this.currentState = ActorState.WALKING;
            this.playAnimation('down');
            isWalking = true;
        }
        if (this.keyD?.isDown) {
            this.body.velocity.x = 110;
            this.direction = 'right';
            this.currentState = ActorState.WALKING;
            this.playAnimation('right');
            isWalking = true;

        }

        if (this.keyK?.isDown) {
            if (isWalking) {
                this.currentState = ActorState.WALKING_ATTACKING;
            } else {
                this.currentState = ActorState.ATTACKING;
            }
            this.direction = 'stand';
            /* attack animation
                        this.play({
                            key: this.getConfig().prefix + 'stand',
                            repeat: 0,//this.config.repeat,
                            frameRate: 10,
                        }, true)*/
            //this.playAttackAnimation();

        } else if (!isWalking) {
            this.currentState = ActorState.IDLE;
        } else {
            this.currentState = ActorState.WALKING;
        }

    }
}