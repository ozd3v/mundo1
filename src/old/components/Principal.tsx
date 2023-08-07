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
            width: 400,
            height: 300,
            backgroundColor: '#1099bb',
        });

        const scene = new PIXI.Container();

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
            xpos: app.screen.width / 2 - 0,
            ypos: app.screen.height / 2 - 0,
            anchorNumber: 0.5,
            speed: 0.5,
            // interval should ve random between 30 and 60
            interval: Math.floor(Math.random() * (100 - 60 + 1)) + 60,
            screen: {
                width: app.screen.width,
                height: app.screen.height
            },
            name: 'hero',
            randomMovement: false
        }
        const configEnemy = {
            animationSpeedParam: 0.1666,
            xpos: app.screen.width / 2 + 200,
            ypos: app.screen.height / 2 - 60,
            anchorNumber: 0.5,
            speed: 0.5,
            interval: Math.floor(Math.random() * (100 - 60 + 1)) + 60,
            screen: {
                width: app.screen.width,
                height: app.screen.height
            },
            name: 'enemy',
            randomMovement: false
        }


        const hero = new Character('stand_up', spritesheet, configHero, app.ticker, scene);
        const enemy = new Character('left', spritesheetEnemy, configEnemy, app.ticker, scene);
        //const enemy = new Character('up', spritesheetEnemy, configEnemy);
        const handleTicker = () => {
            hero.characterticker();
            enemy.characterticker();
            hero.checkCollision(enemy)

        };
        app.ticker.add(handleTicker);
        app.stage.addChild(scene);
        //app.stage.addChild(hero);
        //app.stage.addChild(enemy);
        scene.addChild(hero);
        scene.addChild(enemy);
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
    name?: string;
    randomMovement?: boolean;
    directionMovement?: string;
}

class CustomHitArea extends PIXI.Graphics {
    public contains(x: number, y: number): boolean {
        return this.geometry.containsPoint(new PIXI.Point(x, y));
    }
}
class Character extends PIXI.AnimatedSprite {

    public direction: string;
    public myRelativePosX: string = 'center';
    public myRelativePosY: string = 'center';
    private speed: number;
    private screen: Screen;
    private timer: number = 0;
    private interval: number;
    private parAnimations: PIXI.utils.Dict<PIXI.Texture<PIXI.Resource>[]>
    private charName: string;
    public isStopped: boolean = false;
    private visionCone: PIXI.Graphics;
    private visionReach: number = 50;
    public customHitArea: CustomHitArea;
    private randomMovement: boolean = true;
    private ticker: PIXI.Ticker;
    public performingAction: boolean = false;
    public collisionType: string = 'none';
    private scene: PIXI.Container;

    constructor(spritesheetDirection: string, spritesheet: PIXI.Spritesheet, config: config, ticker: PIXI.Ticker, scene: PIXI.Container) {
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
        this.charName = config.name ?? 'default';
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this.on('pointerdown', (_event) => { console.log(`clicked on ${this.charName}`); });
        this.eventMode = 'static';
        if (config.randomMovement !== undefined) {
            this.randomMovement = config.randomMovement;
        }
        this.ticker = ticker;
        this.scene = scene;
        //console.log(`this.randomMovement: ${this.randomMovement} charName ${this.charName} ${config.randomMovement}`);


        // Create a rectangle to contain the sprite
        const rect = new PIXI.Graphics();
        rect.lineStyle(1, 0x0000ff); // Set the border color to blue and the line width to 2 pixels
        rect.beginFill(0xffffff, 0); // Set the fill color to white and the fill alpha to 0 (fully transparent)
        rect.drawRect(-this.width / 2, -this.height / 2, this.width, this.height);
        rect.endFill();
        this.addChild(rect); // Add the rectangle as a child of the sprite

        const customnewHitArea = new CustomHitArea();
        customnewHitArea.lineStyle(1, 0xff0000); // Set the border color to red and the line width to 1 pixel
        customnewHitArea.beginFill(0xffffff, 0); // Set the fill color to white and the fill alpha to 0 (fully transparent)
        customnewHitArea.drawRect(-this.width * 0.4, -this.height / 2, this.width * 0.8, this.height);
        customnewHitArea.endFill();
        this.customHitArea = customnewHitArea;
        this.hitArea = customnewHitArea;
        this.addChild(customnewHitArea);

        // Create a new graphics object for the vision cone
        this.visionCone = new PIXI.Graphics();
        this.visionCone.beginFill(0xffff00, 0.5); // Set the fill color to yellow and the fill alpha to 0.5 (semi-transparent)
        this.visionCone.moveTo(0, 0); // Move to the center of the sprite
        this.visionCone.lineTo(this.visionReach, -this.visionReach); // Draw a line to the right of the center
        this.visionCone.lineTo(this.visionReach, this.visionReach); // Draw a line to the right of the center
        this.visionCone.lineTo(0, 0); // Draw a line back to the center
        this.visionCone.endFill();
        this.addChild(this.visionCone); // Add the vision cone as a child of the sprite


    }
    private setDirection() {
        if (this.isStopped) return;

        if (this.direction === 'right') {
            this.x += this.speed;
        } else if (this.direction === 'left') {
            this.x -= this.speed;
        } else if (this.direction === 'down') {
            this.y += this.speed;
        } else if (this.direction === 'up') {
            this.y -= this.speed;
        } else if (this.direction === 'stand_up') {
            this.stop();
            this.isStopped = true;
            this.faceToDirection('up');
        }
        this.visionCone.rotation = this.getRotation(this.direction);
    }
    private getRotation(direction: string): number {
        switch (direction) {
            case 'right':
                return 0;
            case 'left':
                return Math.PI;
            case 'down':
                return Math.PI / 2;
            case 'up':
                return -Math.PI / 2;
            default:
                return 0;
        }
    }
    private checkBorders() {
        // Wrap character around to the other side of the canvas if it goes offscreen
        // Wrap hero around to the other side of the canvas if it goes offscreen
        if (this.isStopped) return;

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
    public characterticker() {
        // Move character in its current direction
        if (this.isStopped) return;
        this.play();
        this.getObjectsInCone();
        this.setDirection();
        this.checkBorders();
        if (!this.randomMovement) return

        // Change character's direction every interval frames
        this.timer++;
        // Start the animation loop
        if (this.timer >= this.interval && !this.isStopped) {
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

        }
    }
    private faceToDirection(direction: string) {
        if (this.direction !== direction) {
            this.direction = direction;
            this.textures = this.parAnimations[direction];
            this.visionCone.rotation = this.getRotation(this.direction);
        }
    }
    //oneSprite.getBounds().intersects(otherSprite.getBounds());
    public async checkCollision(otherSprite: Character) {
        if (this.testForAABB(this, otherSprite)) {
            this.setMyRelativePos(otherSprite);
            this.stepBack(otherSprite);
            otherSprite.stop();
            otherSprite.isStopped = true;
            this.stop();
            this.isStopped = true;
            //console.log(`collision between ${this.charName} and ${otherSprite.charName}`);
            //console.log(`collisionType: ${this.collisionType}`);
            //await this.moveTo(this.x - otherSprite.x, 'left', otherSprite);

            if (this.collisionType === 'horizontal') {
                if (this.y < otherSprite.y) {
                    await this.moveTo(otherSprite.y - this.y, 'down', otherSprite);
                } else {
                    //otherSprite.scale.x = -1;
                    await this.moveTo(this.y - otherSprite.y, 'up', otherSprite);
                }
            }
            if (this.collisionType === 'vertical') {
                if (this.x < otherSprite.x) {
                    await this.moveTo(otherSprite.x - this.x, 'right', otherSprite);
                } else {
                    await this.moveTo(this.x - otherSprite.x, 'left', otherSprite);
                }
            }

            //console.log(`collision between ${this.charName} and ${otherSprite.charName}`);
            //this.bounce(otherSprite);
            //this.faceEachOther(otherSprite);

        }
    }
    public getDistance(x1: number, y1: number, x2: number, y2: number) {
        const dx = x2 - x1; // Calculate the x distance between the two points
        const dy = y2 - y1; // Calculate the y distance between the two points
        return Math.sqrt(dx * dx + dy * dy); // Calculate the distance using the Pythagorean theorem
    }

    public checkWhereToLook(otherSprite?: Character) {

        if (this.collisionType === 'horizontal') {
            if (this.myRelativePosX === 'right' && this.direction !== 'left') {
                this.faceToDirection('left');
            }
            if (this.myRelativePosX === 'left' && this.direction !== 'right') {
                this.faceToDirection('right');
            }
            if (otherSprite) {
                if (otherSprite.myRelativePosX === 'left' && otherSprite.direction !== 'right') {
                    otherSprite.faceToDirection('right');
                }
                if (otherSprite.myRelativePosX === 'right' && otherSprite.direction !== 'left') {
                    otherSprite.faceToDirection('left');
                }
            }
        }
        if (this.collisionType === 'vertical') {
            if (this.myRelativePosY === 'up' && this.direction !== 'down') {
                this.faceToDirection('down');
            }
            if (this.myRelativePosY === 'down' && this.direction !== 'up') {

                this.faceToDirection('up');
            }
            if (otherSprite) {
                if (otherSprite.myRelativePosY === 'up' && otherSprite.direction !== 'down') {
                    otherSprite.faceToDirection('down');
                }
                if (otherSprite.myRelativePosY === 'down' && otherSprite.direction !== 'up') {
                    otherSprite.faceToDirection('up');
                }
            }
        }


    }

    public async moveTo(distance: number, direction: string, otherSprite?: Character) {
        return new Promise((resolve) => {

            this.ticker.add(() => {
                this.play();
                this.isStopped = false;
                this.faceToDirection(direction);
                distance -= this.speed;
                if (distance <= 0) {
                    this.ticker.stop();
                    //this.faceToDirection(whereToFace);
                    this.checkWhereToLook(otherSprite);
                    resolve(true);
                }
            });
        });

    }
    public faceEachOther(otherSprite: Character) {

        const otherDirection = otherSprite.direction;
        if (this.x < otherSprite.x) { // Check if this character is on the left side
            if (this.direction !== 'right') {
                this.scale.x = -1 // Flip this character horizontally         
            }
            if (otherDirection !== 'left') {
                otherSprite.scale.x = -1 // Flip the other character horizontally
            }
            this.x = this.x - 2;
            otherSprite.x = otherSprite.x + 2;
        }
        else { // This character is on the right side
            if (this.direction !== 'left') {
                this.scale.x = -1 // Flip this character horizontally
            }
            if (otherDirection !== 'right') {
                otherSprite.scale.x = -1 // Flip the other character horizontally

            }
            this.x = this.x + 2;
            otherSprite.x = otherSprite.x - 2;
        }
    }

    public bounce(otherSprite: Character) {
        const stepBackAmount = 10//this.speed * 2; // Set the amount to step back by
        const angle = Math.atan2(otherSprite.y - this.y, otherSprite.x - this.x); // Calculate the angle between the two characters
        const dx = Math.cos(angle) * stepBackAmount; // Calculate the x distance to step back by
        const dy = Math.sin(angle) * stepBackAmount; // Calculate the y distance to step back by
        this.x -= dx; // Move this character back by dx pixels
        this.y -= dy; // Move this character back by dy pixels
        otherSprite.x += dx; // Move the other character back by dx pixels
        otherSprite.y += dy; //
        const framesToStepBack = Math.ceil(stepBackAmount / this.speed); // Calculate the number of frames to step back
        let framesLeft = framesToStepBack; // Initialize the number of frames left to step back
        const stepBackX = dx / framesToStepBack; // Calculate the x distance to step back each frame
        const stepBackY = dy / framesToStepBack; // Calculate the y distance to step back each frame
        const originalX = this.x; // Save the original x position of this character
        const originalY = this.y; // Save the original y position of this character
        const originalOtherX = otherSprite.x; // Save the original x position of the other character
        const originalOtherY = otherSprite.y; // Save the original y position of the other character

        const stepBackInterval = setInterval(() => {
            this.x -= stepBackX; // Move this character back by stepBackX pixels
            this.y -= stepBackY; // Move this character back by stepBackY pixels
            otherSprite.x += stepBackX; // Move the other character back by stepBackX pixels
            otherSprite.y += stepBackY; // Move the other character back by stepBackY pixels
            framesLeft--; // Decrement the number of frames left to step back
            if (framesLeft <= 0) {
                clearInterval(stepBackInterval); // Stop the step back interval
                this.x = originalX; // Reset the x position of this character to its original position
                this.y = originalY; // Reset the y position of this character to its original position
                otherSprite.x = originalOtherX; // Reset the x position of the other character to its original position
                otherSprite.y = originalOtherY; // Reset the y position of the other character to its original position
                this.play(); // Start the animation loop for this character
                this.isStopped = false;
                otherSprite.play(); // Start the animation loop for the other character
                otherSprite.isStopped = false;
            }
        }, 1000 / 60);
    }

    public testForAABB(object1: Character, object2: Character) {
        const bounds1 = object1.customHitArea.getBounds();
        const bounds2 = object2.customHitArea.getBounds();

        return bounds1.x < bounds2.x + bounds2.width
            && bounds1.x + bounds1.width > bounds2.x
            && bounds1.y < bounds2.y + bounds2.height
            && bounds1.y + bounds1.height > bounds2.y;
    }

    public checkCollisionAxis(sprite1: PIXI.Sprite, sprite2: PIXI.Sprite): 'horizontal' | 'vertical' | null {
        const xDiff = Math.abs(sprite1.x - sprite2.x);
        const yDiff = Math.abs(sprite1.y - sprite2.y);
        if (yDiff > xDiff) {
            // Collision is on the Y axis
            this.collisionType = 'vertical';
            return 'vertical';
        } else if (xDiff > yDiff) {
            // Collision is on the X axis
            this.collisionType = 'horizontal';
            return 'horizontal';
        } else {
            // No collision
            return null;
        }
    }

    public setMyRelativePos(otherSprite: Character) {
        if (this.x < otherSprite.x) { // Check if this character is on the left side
            this.myRelativePosX = 'left';
            otherSprite.myRelativePosX = 'right';
        } else {
            this.myRelativePosX = 'right';
            otherSprite.myRelativePosX = 'left';
        }

        if (this.y < otherSprite.y) { // Check if this character is up or down
            this.myRelativePosY = 'up';
            otherSprite.myRelativePosY = 'down';
        } else {
            this.myRelativePosY = 'down';
            otherSprite.myRelativePosY = 'up';
        }
    }

    public stepBack(otherSprite: Character, steps: number = 2) {
        if (this.checkCollisionAxis(this, otherSprite) === 'horizontal') {
            if (this.myRelativePosX === 'right') {
                this.x = this.x + steps;
                otherSprite.x = otherSprite.x - steps;
            } else if (this.myRelativePosX === 'left') {
                this.x = this.x - steps;
                otherSprite.x = otherSprite.x + steps;
            }

        }
        if (this.checkCollisionAxis(this, otherSprite) === 'vertical') {
            if (this.myRelativePosY === 'up') {
                this.y = this.y - steps;
                otherSprite.y = otherSprite.y + steps;
            } else if (this.myRelativePosY === 'down') {
                this.y = this.y + steps;
                otherSprite.y = otherSprite.y - steps;
            }
        }
    }

    private getObjectsInCone(): PIXI.DisplayObject[] {
        const objectsInCone: PIXI.DisplayObject[] = [];
        // Calculate cone vision bounds
        const coneBounds = this.visionCone.getBounds();
        // Check if any objects are within the cone vision bounds
        for (const object of this.scene.children) {
            if (object !== this && object instanceof PIXI.Sprite) {
                //console.log('object: ${object.name}', object);
                const objectBounds = object.getBounds();

                if (coneBounds.contains(objectBounds.x, objectBounds.y)) {
                    if (!objectsInCone.includes(object)) {
                        this.stop();
                        this.isStopped = true;
                        objectsInCone.push(object);
                        console.log(`object in cone: ${object.name}, i am ${this.charName}`);
                        console.log(object);
                    }
                }
            }
        }

        return objectsInCone;
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

