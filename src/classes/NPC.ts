import { Actor } from "./Actor";
import { actorConfig } from "../types";

export class NPC extends Actor {
    private config: actorConfig;
    private direction: string = 'stand';
    private timer: number = 0;
    private speed: number = 1;
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, config: actorConfig) {
        super(scene, x, y, texture, config);
        this.config = config;

    }
    update() {
        /*
        this.play({
            key: this.config.prefix + 'stand',
            repeat: this.config.repeat,
            frameRate: this.config.frameRate,
        }
            , true);
            */
        if (this.direction === 'right') {
            this.x += this.speed;
        } else if (this.direction === 'left') {
            this.x -= this.speed;
        } else if (this.direction === 'down') {
            this.y += this.speed;
        } else {
            this.y -= this.speed;
        }
        // Wrap hero around to the other side of the canvas if it goes offscreen
        if (this.x + this.width / 2 > Number(this.config.canvas.width)) {
            this.x = Number(this.config.canvas.width) - this.width / 2;
        }
        if (this.x - this.width / 2 < 0) {
            this.x = this.width / 2;
        }
        if (this.y + this.height / 2 > Number(this.config.canvas.height)) {
            this.y = Number(this.config.canvas.height) - this.height / 2;
        }
        if (this.y - this.height / 2 < 0) {
            this.y = this.height / 2;
        }
        this.timer++;
        const interval = 60;
        if (this.timer >= interval) {
            this.timer = 0;
            this.randomMovement();
        }
    }

    randomMovement() {
        const randomDirection = Math.floor(Math.random() * 4);
        if (randomDirection === 0) {
            this.direction = 'right';
            this.play({
                key: this.config.prefix + 'right',
                repeat: this.config.repeat,
                frameRate: this.config.frameRate,
            }
                , true);
        } else if (randomDirection === 1) {
            this.direction = 'left';
            this.play({
                key: this.config.prefix + 'left',
                repeat: this.config.repeat,
                frameRate: this.config.frameRate,
            }
                , true);
        } else if (randomDirection === 2) {
            this.direction = 'down';
            this.play({
                key: this.config.prefix + 'down',
                repeat: this.config.repeat,
                frameRate: this.config.frameRate,
            }
                , true);
        } else {
            this.direction = 'up';
            this.play({
                key: this.config.prefix + 'up',
                repeat: this.config.repeat,
                frameRate: this.config.frameRate,
            }
                , true);
        }
    }
}