import Phaser from 'phaser'
import reactLogo from '../assets/react.svg'
import heroSpriteSheet from '../assets/hero.png'
import heroJson from '../assets/heroase.json';
import enemySpriteSheet from '../assets/enemy.png'
import enemyJson from '../assets/enemyase.json';

let enemy: Phaser.Physics.Arcade.Sprite;
//let directionTimer: Phaser.Time.TimerEvent;
let timer = 0;
const speed = 1;
let direction = 'right';

let cone

export default class HelloWorldScene extends Phaser.Scene {
    constructor() {
        super('helloworld')
    }
    preload() {
        this.load.image("logo", reactLogo);
        this.load.spritesheet("hero", heroSpriteSheet, {
            frameWidth: 48,
            frameHeight: 48
        });

        this.load.aseprite('paladin', heroSpriteSheet, heroJson);
        this.load.aseprite('enemy', enemySpriteSheet, enemyJson);
    }
    create() {
        const logo = this.add.image(200, 75, "logo");
        const current = this.add.text(48, 200, 'Playing: down', { color: '#00ff00' });

        this.tweens.add({
            targets: logo,
            y: 200,
            duration: 2000,
            ease: "Power2",
            yoyo: true,
            loop: -1
        });

        const tagsHero = this.anims.createFromAseprite('paladin');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const tagsEnemy = this.anims.createFromAseprite('enemy');
        const paladin = this.add.sprite(300, 170, "paladin")
        enemy = this.physics.add.sprite(100, 150, 'enemy')
        //flower.setOrigin(0.5, 0.8);
        enemy.setSize(enemy.width * 0.8, 48);
        enemy.play({ key: 'enemy-right', repeat: -1, frameRate: 5, });

        cone = new Phaser.Geom.Triangle(enemy.x, enemy.y, enemy.x + 100, enemy.y + 50, enemy.x + 100, enemy.y - 50);

        // Draw the triangle on the graphics object
        const graphics = this.add.graphics();
        graphics.fillStyle(0xff0000, 0.5);
        graphics.fillTriangleShape(cone);


        this.game.events.emit("putOnAHappyFace", true)

        let c = 0;
        this.input.on('pointerdown', function () {
            c++;
            if (c === tagsHero.length) {
                c = 0;
            }
            paladin.play({ key: tagsHero[c].key, repeat: -1, frameRate: 5 });
            current.setText('Playing: ' + tagsHero[c].key);
        });
    }

    update() {
        const interval = 60
        // Move hero in its current direction
        if (direction === 'right') {
            enemy.x += speed;
        } else if (direction === 'left') {
            enemy.x -= speed;
        } else if (direction === 'down') {
            enemy.y += speed;
        } else {
            enemy.y -= speed;
        }
        // Wrap hero around to the other side of the canvas if it goes offscreen
        if (enemy.x + enemy.width / 2 > Number(this.game.config.width)) {
            enemy.x = Number(this.game.config.width) - enemy.width / 2;
        }
        if (enemy.x - enemy.width / 2 < 0) {
            enemy.x = enemy.width / 2;
        }
        if (enemy.y + enemy.height / 2 > Number(this.game.config.height)) {
            enemy.y = Number(this.game.config.height) - enemy.height / 2;
        }
        if (enemy.y - enemy.height / 2 < 0) {
            enemy.y = enemy.height / 2;
        }
        // Change hero's direction every interval frames
        timer++;
        if (timer >= interval) {
            timer = 0;
            const randomDirection = Math.floor(Math.random() * 4);
            if (randomDirection === 0) {
                direction = 'right';
                enemy.play({ key: 'enemy-right', repeat: -1, frameRate: 5, });
                //enemy.textures = spritesheet.animations.right;
            } else if (randomDirection === 1) {
                direction = 'left';
                enemy.play({ key: 'enemy-left', repeat: -1, frameRate: 5, });
                //enemy.textures = spritesheet.animations.left;
            } else if (randomDirection === 2) {
                enemy.play({ key: 'enemy-down', repeat: -1, frameRate: 5, });
                direction = 'down';
                //enemy.textures = spritesheet.animations.down;
            } else {
                direction = 'up';
                enemy.play({ key: 'enemy-up', repeat: -1, frameRate: 5, });
                //enemy.textures = spritesheet.animations.up;
            }

        }



        //const interval = 60

        //enemy.x += speed;
        // if the flower goes off screen, move it back to the left
        /*
        if (enemy.x > 400) {
            enemy.x = 0;
        }*/

        /*
                const interval = 60
                timer++;
                if (timer >= interval) {
                    timer = 0;
                    const randomDirection = Math.floor(Math.random() * 4);
                    console.log(randomDirection);
                    if (randomDirection === 0) {
                        enemy.y -= speed;
                    } else if (randomDirection === 1) {
                        enemy.x += speed;
                    } else if (randomDirection === 2) {
                        enemy.y += speed;
                    } else {
                        enemy.x -= speed;
                    }
                }*/

        /*
                // keep the enemy within the borders
                if (enemy.x < 0) {
                    enemy.x = 0;
                } else if (enemy.x > Number(this.game.config.width)) {
                    enemy.x = Number(this.game.config.width);
                }
                if (enemy.y < 0) {
                    enemy.y = 0;
                } else if (enemy.y > Number(this.game.config.height)) {
                    enemy.y = Number(this.game.config.height);
                }
        */
    }

}

/*
        // Animation set
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('hero', { frames: [0, 1, 2,] }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('hero', { frames: [9, 10, 11,] }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('hero', { frames: [3, 4, 5,] }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('hero', { frames: [6, 7, 8,] }),
            frameRate: 5,
            repeat: -1
        });

        const keys = ['down', 'left', 'up', 'right'];
        const hero = this.add.sprite(150, 170, "hero");
        hero.play('down');
*/

