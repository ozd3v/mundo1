import { Scene, Physics } from 'phaser';
import { NPC } from '../classes/NPC';
import { Player } from '../classes/Player';
import { actorConfig } from "../types";
export class HomeTown extends Scene {
    private enemy!: Physics.Arcade.Sprite;
    private player!: Physics.Arcade.Sprite;
    constructor() {
        super('HomeTown-1');
    }
    create(): void {

        const { width, height } = this.sys.game.canvas;

        const configHero: actorConfig = {
            animationSpeedParam: 0,
            prefix: 'hero-',
            frameRate: 5,
            repeat: -1,
            box: {
                width: 0.8,
                height: -1
            },
            canvas: {
                width: width,
                height: height
            }
        }

        const configenemy: actorConfig = {
            animationSpeedParam: 0,
            prefix: 'enemy-',
            frameRate: 5,
            repeat: -1,
            box: {
                width: 0.8,
                height: -1
            },
            canvas: {
                width: width,
                height: height
            }
        }
        this.enemy = new NPC(this, 100, 150, 'enemy', configenemy);
        this.player = new Player(this, 100, 100, 'hero', configHero);
        //this.enemy.setOffset(8, 0);
    }
    update(): void {
        this.enemy.update();
        this.player.update();
    }
}