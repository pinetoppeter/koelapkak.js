interface Dimensions {
    boundingRect: DOMRect,
    outerWidth: number,
    outerHeight: number,
    margin: {
        top: number,
        left: number,
        right: number,
        bottom: number,
    }
}

export interface Offset {
    top: number,
    left: number,
    bottom?: number,
    right?: number
}

export interface ChildElement {
    element?: HTMLElement,
    dimensions: Dimensions,
    newPosition: {
        offset: Offset
    }
}

export interface KoelapkakOptions {
    listenForWindowResize?: boolean,
    direction?: Direction
}

export enum Direction {
    LEFT_TO_RIGHT,
    RIGHT_TO_LEFT
}

export default Dimensions;
