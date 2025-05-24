import Dimensions, { ChildElement, Offset } from "../types";

const spreadCenter = (containerRect: Dimensions, children: ChildElement[]): ChildElement[][] => {
    // each completed row will be stored in new array
    let rows: ChildElement[][] = [[]];

    return arrange(children, rows, containerRect);
}

const arrange = (children: ChildElement[], rows: ChildElement[][], containerRect: Dimensions): ChildElement[][] => {
    let rowIndex = 0;
    let colIndex = 0;

    while (children.length > 0) {
        let child = children.pop();

        if (!child) {
            continue;
        }

        const newOffset = tryFindPosition(child, rows, rowIndex, colIndex, containerRect);

        if (newOffset) {
            child.newPosition.offset = newOffset;
        }
        else {
            // row is full -> proceed to next
            rowIndex++;
            colIndex = 0;
            rows[rowIndex] = [];

            child.newPosition.offset = tryFindPosition(child, rows, rowIndex, colIndex, containerRect) ?? {
                top: child.dimensions.boundingRect.top,
                left: child.dimensions.boundingRect.left
            };
        }

        rows[rowIndex][colIndex] = child;
        colIndex++;
    }

    return rows;
}

const tryFindPosition = (
    child: ChildElement,
    rows: ChildElement[][],
    rowIndex: number,
    colIndex: number,
    containerRect: Dimensions
): Offset | null => {
    let left = 0;

    if (colIndex === 0) {
        // first element in row gets center position
        const availableHorizontalSpace = containerRect.boundingRect.width;
        left = (availableHorizontalSpace / 2) - ((child.dimensions.outerWidth) / 2);
        return {
            top: getTop(child, rows, rowIndex),
            left
        }
    }

    // try left
    let availableSpaceLeft = Math.min(...rows[rowIndex].map(c => c.newPosition.offset.left - c.dimensions.margin.left)) ?? 0;

    if (availableSpaceLeft >= child.dimensions.outerWidth) {
        left = availableSpaceLeft - child.dimensions.boundingRect.width - child.dimensions.margin.left;
    }

    if (!left) {
        // try right
        let maxRight = Math.max(...rows[rowIndex].map(c => c.newPosition.offset.left + c.dimensions.boundingRect.width)) ?? 0;

        let availableSpaceRight = containerRect.outerWidth - maxRight;

        if (availableSpaceRight >= child.dimensions.outerWidth) {
            left = maxRight;
        }
    }

    if (!left) {
        // give up
        return null;
    }

    return {
        top: getTop(child, rows, rowIndex),
        left: left + child.dimensions.margin.left
    };
}

const getTop = (
    child: ChildElement,
    rows: ChildElement[][],
    rowIndex: number,
): number => {
    let top = 0;

    if (rowIndex > 0) {
        top = Math.max(...rows[rowIndex - 1].map(c => c.newPosition.offset.top + c.dimensions.boundingRect.height)) ?? 0
    }

    return top + child.dimensions.margin.top;
};

export default spreadCenter;
