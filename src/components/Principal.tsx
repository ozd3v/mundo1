import React from 'react'
import { Application, Sprite } from "pixi.js";
/*
const app = new Application({
    width: 800,
    height: 600,
    backgroundColor: 0x5BBA6F,
});
*/
function Principal() {
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        // On first render create our application
        const app = new Application({
            width: 800,
            height: 600,
            backgroundColor: '#1099bb',
        });
        const bunny = Sprite.from('https://pixijs.com/assets/bunny.png')
        app.stage.addChild(bunny)
        // center the sprite's anchor point
        bunny.anchor.set(0.5)

        // move the sprite to the center of the screen
        bunny.x = app.screen.width / 2
        bunny.y = app.screen.height / 2

        // Listen for animate update
        app.ticker.add((delta) => {
            // just for fun, let's rotate mr rabbit a little
            // delta is 1 if running at 100% performance
            // creates frame-independent transformation
            bunny.rotation += 0.1 * delta;
        });

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
//type Props = {}
//type FixmeAny = unknown;
/*
function Principal() {
    const ref: React.RefObject<HTMLDivElement> = React.useRef(null);

    React.useEffect(() => {
        // On first render add app to DOM
        const div = document.createElement('div');
        div.appendChild(app.view as unknown as Node); // Cast app.view to Node type
        ref.current?.appendChild(div);
        // Start the PixiJS app
        app.start();

        return () => {
            // On unload stop the application
            app.stop();
        };
    }, []);

    return (
        <div ref={ref}>Principal</div>
    )
}

export default Principal
*/

/*
import React, { useRef, useEffect } from "react";
import { Application } from "pixi.js";

function MyComponent() {
  const ref = useRef(null);

  useEffect(() => {
    // On first render create our application
    const app = new Application({
      width: 800,
      height: 600,
      backgroundColor: 0x5BBA6F,
    });

    // Add app to DOM
    ref.current.appendChild(app.view);
    // Start the PixiJS app
    app.start();

    return () => {
      // On unload completely destroy the application and all of it's children
      app.destroy(true, true);
    };
  }, []);
 
  return <div ref={ref} />;
}

*/