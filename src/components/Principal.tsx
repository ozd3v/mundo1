import React from 'react'
import * as PIXI from "pixi.js";

import heroImg from '../assets/hero.png';
import spritesheetjson from '../assets/hero.json';

function Principal() {
    const ref = React.useRef<HTMLDivElement>(null);

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
    }, []);

    return <div ref={ref} />;
}

export default Principal



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

/*
const bunny = Sprite.from('https://pixijs.com/assets/bunny.png')
app.stage.addChild(bunny)
// center the sprite's anchor point
bunny.anchor.set(0.5)

// move the sprite to the center of the screen
bunny.x = app.screen.width / 2
bunny.y = app.screen.height / 2

let speed = 0.5
app.ticker.add(() => {
    // Move bunny to the right by changing its x position
    bunny.x += speed;
    // If bunny reaches the edge of the canvas, reverse its direction by changing the sign of speed
    if (bunny.x + bunny.width / 2 > app.screen.width || bunny.x - bunny.width / 2 < 0) {
        speed *= -1;
    }
});
*/