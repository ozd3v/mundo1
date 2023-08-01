import React from 'react'
import * as PIXI from "pixi.js";

import heroImg from '../assets/hero.png';
import heroSpriteSheet from '../assets/hero.json';
import enemyImg from '../assets/enemy.png';
import enemySpriteSheet from '../assets/enemy.json';



function Principal() {
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        // Create our PixiJS application
        const app = new PIXI.Application({
            width: 800,
            height: 600,
            backgroundColor: '#1099bb',
        });

        const spritesheet = new PIXI.Spritesheet(
            PIXI.BaseTexture.from(heroImg),
            heroSpriteSheet
        );

        const spritesheetEnemy = new PIXI.Spritesheet(
            PIXI.BaseTexture.from(enemyImg),
            enemySpriteSheet
        );

        async function loadSpritesheet() {
            await spritesheetEnemy.parse();
        }
        loadSpritesheet();
        async function loadSpritesheetHero() {
            await spritesheet.parse();
        }
        loadSpritesheetHero();

        const configHero = {
            animationSpeedParam: 0.1666,
            xpos: app.screen.width / 2,
            ypos: app.screen.height / 2,
            anchorNumber: 0.5,
            speed: 0.5,
            interval: 60,
            screen: {
                width: app.screen.width,
                height: app.screen.height
            }
        }
        const configEnemy = {
            animationSpeedParam: 0.1666,
            xpos: app.screen.width / 2 - 100,
            ypos: app.screen.height / 2 - 100,
            anchorNumber: 0.5,
            speed: 0.2,
            interval: 60,
            screen: {
                width: app.screen.width,
                height: app.screen.height
            }
        }


        const hero = new Character('up', spritesheet, configHero);
        const enemy = new Character('up', spritesheetEnemy, configEnemy);
        //const enemy = new Character('up', spritesheetEnemy, configEnemy);
        const handleTicker = () => {
            hero.ticker();
            enemy.ticker();
        };
        app.ticker.add(handleTicker);
        app.stage.addChild(hero);
        app.stage.addChild(enemy);
        // Add app to DOM
        if (ref.current) {
            ref.current.appendChild(app.view as unknown as HTMLElement); // Cast app.view to HTMLElement type
        }

        // Start the PixiJS app
        app.start();

        return () => {
            // On unload completely destroy the application and all of it's children
            app.destroy(true, true);
        };
    }, []);

    return <div ref={ref} />;
}

export default Principal

type Screen = {
    width: number;
    height: number;
}
type config = {
    animationSpeedParam: number;
    xpos: number;
    ypos: number;
    anchorNumber: number;
    speed: number;
    interval: number;
    screen: Screen;
}
class Character extends PIXI.AnimatedSprite {

    private direction: string;
    private speed: number;
    private screen: Screen;
    private timer: number = 0;
    private interval: number;
    private parAnimations: PIXI.utils.Dict<PIXI.Texture<PIXI.Resource>[]>

    constructor(spritesheetDirection: string, spritesheet: PIXI.Spritesheet, config: config) {
        super(spritesheet.animations[spritesheetDirection]);
        this.animationSpeed = config.animationSpeedParam;
        this.x = config.xpos;
        this.y = config.ypos;
        this.anchor.set(config.anchorNumber);
        this.direction = spritesheetDirection;
        this.screen = config.screen;
        this.timer = 0;
        this.interval = config.interval;
        this.parAnimations = spritesheet.animations;
        this.speed = config.speed;

    }
    private setDirection() {
        if (this.direction === 'right') {
            this.x += this.speed;
        } else if (this.direction === 'left') {
            this.x -= this.speed;
        } else if (this.direction === 'down') {
            this.y += this.speed;
        } else if (this.direction === 'up') {
            this.y -= this.speed;
        }
    }
    private checkBorders() {
        // Wrap character around to the other side of the canvas if it goes offscreen
        // Wrap hero around to the other side of the canvas if it goes offscreen
        if (this.x + this.width / 2 > this.screen.width) {
            this.x = this.screen.width - this.width / 2;
        }
        if (this.x - this.width / 2 < 0) {
            this.x = this.width / 2;
        }
        if (this.y + this.height / 2 > this.screen.height) {
            this.y = this.screen.height - this.height / 2;
        }
        if (this.y - this.height / 2 < 0) {
            this.y = this.height / 2;
        }
    }
    public ticker() {
        // Move character in its current direction
        this.setDirection();

        this.checkBorders();
        // Change character's direction every interval frames
        this.timer++;
        if (this.timer >= this.interval) {
            this.timer = 0;
            const randomDirection = Math.floor(Math.random() * 4);
            if (randomDirection === 0) {
                this.direction = 'right';
                this.textures = this.parAnimations.right;
            } else if (randomDirection === 1) {
                this.direction = 'left';
                this.textures = this.parAnimations.left;
            } else if (randomDirection === 2) {
                this.direction = 'down';
                this.textures = this.parAnimations.down;
            } else {
                this.direction = 'up';
                this.textures = this.parAnimations.up;
            }
            this.play(); // Start the animation loop
        }

    }
}

/*
    React.useEffect(() => {
        // On first render create our application
        const app = new PIXI.Application({
            width: 800,
            height: 600,
            backgroundColor: '#1099bb',
        });
 
        // Create the SpriteSheet from data and image
        const spritesheet = new PIXI.Spritesheet(
            PIXI.BaseTexture.from(heroImg),
            spritesheetjson
        );
        // Generate all the Textures asynchronously
        async function loadSpritesheet() {
            await spritesheet.parse();
        }
 
        loadSpritesheet();
        console.log(spritesheet.animations);
        const hero = new PIXI.AnimatedSprite(spritesheet.animations.right);
        hero.animationSpeed = 0.1666;
        hero.x = app.screen.width / 2
        hero.y = app.screen.height / 2
        hero.anchor.set(0.5)
        const speed = 1
        let direction = 'right'
        let timer = 0
        const interval = 60
        app.ticker.add(() => {
            // Move hero in its current direction
            if (direction === 'right') {
                hero.x += speed;
            } else if (direction === 'left') {
                hero.x -= speed;
            } else if (direction === 'down') {
                hero.y += speed;
            } else {
                hero.y -= speed;
            }
            // Wrap hero around to the other side of the canvas if it goes offscreen
            if (hero.x + hero.width / 2 > app.screen.width) {
                hero.x = app.screen.width - hero.width / 2;
            }
            if (hero.x - hero.width / 2 < 0) {
                hero.x = hero.width / 2;
            }
            if (hero.y + hero.height / 2 > app.screen.height) {
                hero.y = app.screen.height - hero.height / 2;
            }
            if (hero.y - hero.height / 2 < 0) {
                hero.y = hero.height / 2;
            }
            // Change hero's direction every interval frames
            timer++;
            if (timer >= interval) {
                timer = 0;
                const randomDirection = Math.floor(Math.random() * 4);
                if (randomDirection === 0) {
                    direction = 'right';
                    hero.textures = spritesheet.animations.right;
                } else if (randomDirection === 1) {
                    direction = 'left';
                    hero.textures = spritesheet.animations.left;
                } else if (randomDirection === 2) {
                    direction = 'down';
                    hero.textures = spritesheet.animations.down;
                } else {
                    direction = 'up';
                    hero.textures = spritesheet.animations.up;
                }
                hero.play(); // Start the animation loop
            }
        });
 
 
        // Start the animation loop
        hero.play();
 
        // add it to the stage to render
        app.stage.addChild(hero);
 
 
        // Add app to DOM
        if (ref.current) {
            ref.current.appendChild(app.view as unknown as HTMLElement); // Cast app.view to HTMLElement type
 
 
        }
        // Start the PixiJS app
        app.start();
 
        return () => {
            // On unload completely destroy the application and all of it's children
            app.destroy(true, true);
        };
    }, []);*/


/*
        PIXI.Assets.load([
            heroImg
        ]).then(() => {
            // initialize background image
            const hero = PIXI.Sprite.from(heroImg);
            app.stage.addChild(hero);
 
            hero.x = app.screen.width / 2
            hero.y = app.screen.height / 2
 
            let speed = 0.5
            app.ticker.add(() => {
                // Move bunny to the right by changing its x position
                hero.x += speed;
                // If bunny reaches the edge of the canvas, reverse its direction by changing the sign of speed
                if (hero.x + hero.width / 2 > app.screen.width || hero.x - hero.width / 2 < 0) {
                    speed *= -1;
                }
            });
 
        });
        */
/*
        const loader = PIXI.Loader.shared;
        loader.add(['./images/char4.png', './images/chsdfsdf.png'])
            .add('hero', '../assets/hero-0.png')
            .load(setup);
 
        function setup(loader, resources) {
            const char4Sprite = new Sprite(
                resources['../assets/hero-0.png'].texture
            );
            char4Sprite.y = 400;
            app.stage.addChild(char4Sprite);
        }*/

