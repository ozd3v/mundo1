import React from 'react'
//import '../PhaserGame'
//import HolaMundo from '../scenes/HolaMundo'
import { LoadingScene, HomeTown } from '../scenes';

function Principal() {
    const [isReady, setReady] = React.useState(false);

    React.useEffect(() => {
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            parent: "phaser-container",
            width: 400,
            height: 300,
            backgroundColor: '#282c34',
            physics: {
                default: 'arcade',
                arcade: {
                    //gravity: { y: 100 },
                    debug: true
                }
            },
            scene: [LoadingScene, HomeTown],
        }
        const game = new Phaser.Game(config)
        game.events.on('putOnAHappyFace', setReady)
        //game.scene.add("LoadingScene", LoadingScene, true)
        return () => {
            setReady(false)
            game.destroy(true)
        }
    }, []);

    return <div id="phaser-container" className={isReady ? "visible" : "invisible"} />
}

export default Principal