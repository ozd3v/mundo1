import { Physics } from 'phaser';
import { actorConfig } from "../types";
export class Actor extends Physics.Arcade.Sprite {
    protected hp: number = 100;
    private spriteID: string;
    private animsTags: Phaser.Animations.Animation[] = [];

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, config?: actorConfig, frame?: string | number) {
        super(scene, x, y, texture, frame);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.getBody().setCollideWorldBounds(true);
        this.spriteID = texture;
        this.initAnimations();
        this.setupConfig(config);
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

    }
}