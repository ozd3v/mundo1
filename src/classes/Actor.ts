import { Physics } from 'phaser';
import { actorConfig } from "../types";

export enum ActorState {
    IDLE,
    WALKING,
    ATTACKING,
    WALKING_ATTACKING
}
export class Actor extends Physics.Arcade.Sprite {
    protected hp: number = 100;
    private spriteID: string;
    private animsTags: Phaser.Animations.Animation[] = [];
    protected currentState: ActorState = ActorState.IDLE;
    private config: actorConfig;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, config?: actorConfig, frame?: string | number) {
        super(scene, x, y, texture, frame);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.getBody().setCollideWorldBounds(true);
        this.spriteID = texture;
        this.initAnimations();
        this.setupConfig(config);
        this.config = config as actorConfig;
        //this.setBoxSize({ width: 0.8, height: -1 });
        //this.setTintFill(0x00ff00);
    }

    public setConfig(config: actorConfig): void {
        this.config = config;
    }

    public getConfig(): actorConfig {
        return this.config;
    }

    public getDamage(value?: number): void {
        this.scene.tweens.add({
            targets: this,
            duration: 100,
            repeat: 3,
            yoyo: true,
            alpha: 0.5,
            onStart: () => {
                if (value) {
                    this.hp = this.hp - value;
                }
            },
            onComplete: () => {
                this.setAlpha(1);
            },
        });
    }

    protected getBody(): Physics.Arcade.Body {
        return this.body as Physics.Arcade.Body;
    }

    protected checkFlip(): void {
        if (!this.body) return;
        if (this.body?.velocity.x < 0) {
            this.scaleX = -1;
        } else {
            this.scaleX = 1;
        }
    }

    public getHPValue(): number {
        return this.hp;
    }

    public getAnimationTags(): Phaser.Animations.Animation[] {
        return this.animsTags;
    }

    private initAnimations() {
        this.animsTags = this.anims.createFromAseprite(this.spriteID);
    }

    private setupConfig(config: actorConfig | undefined): void {
        if (!config) {
            return;
        }
        this.setConfig(config);
        if (config.box?.width && config.box?.height) {
            this.setBoxSize(config.box);
        }
    }

    private setBoxSize(box: { width: number, height: number }): void {
        let width = box.width;
        let height = box.height;
        if (box.height === -1) height = this.height;
        if (box.width === -1) width = this.width;
        // check if width and height are integers
        if (width % 1 !== 0) width = this.width * box.width
        if (height % 1 !== 0) height = this.height * box.height
        this.setSize(width, height);
        console.log('width: ' + width + ' height: ' + height);

    }
    protected playAnimation(direction: string) {
        if (this.currentState === ActorState.WALKING || this.currentState === ActorState.WALKING_ATTACKING) {
            this.play({
                key: this.config.prefix + direction,
                repeat: this.config.repeat,
                frameRate: this.config.frameRate,
            }, true);
        }
    }

    protected playAttackAnimation() {
        if (this.currentState === ActorState.ATTACKING || this.currentState === ActorState.WALKING_ATTACKING) {
            // Implementar la lógica para reproducir la animación de ataque aquí
            console.log('attack animation');
        }
    }
}