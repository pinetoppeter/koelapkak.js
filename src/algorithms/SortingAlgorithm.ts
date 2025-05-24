import Dimensions, { ChildElement } from "../types";

export default interface SortingAlgorithm {
    run(containerRect: Dimensions, children: ChildElement[]): ChildElement[][]
}