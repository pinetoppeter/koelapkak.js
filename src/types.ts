import CenterSpread from "./algorithms/centerSpread"
import RowByRow from "./algorithms/rowByRow"

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

export type SortingAlgorithmOption = typeof CenterSpread | typeof RowByRow

export interface KoelapkakOptions {
    listenForWindowResize?: boolean,
    direction?: Direction,
    sortingAlgorithm?: SortingAlgorithmOption
}

export enum Direction {
    LEFT_TO_RIGHT,
    RIGHT_TO_LEFT
}

export default Dimensions;
