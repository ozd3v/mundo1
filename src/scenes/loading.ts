import { Scene } from 'phaser';
export class LoadingScene extends Scene {
    //private enemy!: Physics.Arcade.Sprite;
    constructor() {
        super('loading-scene');
    }
    preload() {
        this.load.baseURL = 'assets/';
        this.load.aseprite('enemy', 'sprites/enemy.png', 'sprites/enemyase.json');
        this.load.aseprite('hero', 'sprites/hero.png', 'sprites/heroase.json');
    }
    create(): void {
        console.log('Loading scene was created');
        this.scene.start('HomeTown-1');

        //this.enemy = this.physics.add.sprite(100, 150, 'enemy')
    }
}
//import enemySpriteSheet from '../assets/enemy.png'
//import enemyJson from '../assets/enemyase.json';
