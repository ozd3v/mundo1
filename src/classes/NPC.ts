import { Actor, ActorState } from "./Actor";
import { actorConfig } from "../types";

export class NPC extends Actor {
    //private config: actorConfig;
    private direction: string = 'stand';
    private timer: number = 0;
    private speed: number = 1;
    //private currentState: ActorState = ActorState.IDLE;
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, config: actorConfig) {
        super(scene, x, y, texture, config);

    }
    update() {

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
        if (this.x + this.width / 2 > Number(this.getConfig().canvas.width)) {
            this.x = Number(this.getConfig().canvas.width) - this.width / 2;
        }
        if (this.x - this.width / 2 < 0) {
            this.x = this.width / 2;
        }
        if (this.y + this.height / 2 > Number(this.getConfig().canvas.height)) {
            this.y = Number(this.getConfig().canvas.height) - this.height / 2;
        }
        if (this.y - this.height / 2 < 0) {
            this.y = this.height / 2;
        }
        this.timer++;
        const interval = 60;
        if (this.timer >= interval) {
            this.currentState = ActorState.WALKING;
            this.timer = 0;
            this.randomMovement();
        }
    }

    randomMovement() {
        const randomDirection = Math.floor(Math.random() * 4);
        if (randomDirection === 0) {
            this.direction = 'right';
            this.playAnimation('right');
        } else if (randomDirection === 1) {
            this.direction = 'left';
            this.playAnimation('left');
        } else if (randomDirection === 2) {
            this.direction = 'down';
            this.playAnimation('down');
        } else {
            this.direction = 'up';
            this.playAnimation('up');
        }
    }
}