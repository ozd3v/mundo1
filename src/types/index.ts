export type Screen = {
    width: number;
    height: number;
}
export type config = {
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

export type actorConfig = {
    animationSpeedParam: number;
    prefix: string;
    frameRate: number;
    repeat: number;
    box?: {
        width: number;
        height: number;
        offsetX?: number;
        offsetY?: number;
    }
    canvas: {
        width: number;
        height: number;
    }
}
