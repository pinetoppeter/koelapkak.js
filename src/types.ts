interface Dimensions {
    boundingRect: DOMRect,
    padding: Offset,
    border: Offset,
    margin: Offset
}

interface Offset {
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
    listenForWindowResize?: boolean
}

export default Dimensions;
