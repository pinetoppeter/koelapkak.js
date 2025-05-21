import Dimensions, { ChildElement } from "../types";

const rowByRow = (containerRect: Dimensions, children: ChildElement[]): ChildElement[][] => {
    // each completed row will be stored in new array
    let rows: ChildElement[][] = [[]];
    let availableSpace = containerRect.boundingRect.width;

    return arrange(children, availableSpace, rows);
}

/**
 * 
 * Sets a new top and left position for each element
 * and returns a 2 dimensional array of elements
 * strutured by rows and columns.
 * 
 * @param children 
 * @param containerWidth 
 * @param rows 
 * @returns 
 */
const arrange = (children: ChildElement[], containerWidth: number, rows: ChildElement[][]): ChildElement[][] => {
    let rowIndex = 0;
    let colIndex = 0;

    while (children.length > 0) {
        let child = children.pop();

        if (!child) {
            continue;
        }

        let horizontalSpace = availableHorizontalSpace(rows[rowIndex]
            ?.reduce((carry, elem) => carry - (elem.dimensions.outerWidth ?? 0), containerWidth) ?? containerWidth, child);

        if (horizontalSpace <= 0) {
            rowIndex++;
            rows[rowIndex] = [];
        }

        let precedingElement = rows[rowIndex]?.[colIndex - 1];
        
        // set new left position depending on preceding element
        if (precedingElement?.newPosition) {
            
            child.newPosition.offset.left = precedingElement.newPosition?.offset.left
                + precedingElement.dimensions.boundingRect.width
                + precedingElement.dimensions.margin.right
        }
        // without preceding element
        else {
            child.newPosition.offset.left = child.dimensions.margin.left;
        }

        if (rowIndex > 0) {
            // set new top position
            child.newPosition.offset.top = getTop(child, rows, rowIndex - 1);
        }

        rows[rowIndex][colIndex] = child;
        colIndex++;
    }

    return rows;
}

const getTop = (element: ChildElement, rows: ChildElement[][], rowIndex: number): number => {
    let top = 0;

    while (rowIndex > -1) {
        const currentRow = rows[rowIndex].filter(item => item);

        for (let i = 0; i < currentRow.length; i++) {
            // test for collisions with previous elements
            const newLeft = element.newPosition?.offset.left + element.dimensions.margin.left;
            const newRight = newLeft + element.dimensions.boundingRect.width + element.dimensions.margin.right;
            const prevLeft = currentRow[i].newPosition?.offset.left;
            const prevRight = currentRow[i].newPosition?.offset.left
                + currentRow[i].dimensions.boundingRect.width + currentRow[i].dimensions.margin.right;
            const newTop = element.newPosition?.offset.top + element.dimensions.margin.top;
            const prevTop = currentRow[i].newPosition?.offset.top;
            const prevBottom = prevTop + currentRow[i].dimensions.boundingRect.height + currentRow[i].dimensions.margin.bottom

            if ((newLeft >= prevLeft
                && newLeft <= prevRight)
                ||
                (newRight >= prevLeft
                    && newRight <= prevRight
                )
                ||
                (
                    newLeft < prevLeft
                    && newRight > prevRight
                    && newTop <= prevBottom
                )
            ) {
                if (prevBottom > top) {
                    top = prevBottom;
                }
            }
        }

        rowIndex--;
    }

    return top;
}

const availableHorizontalSpace = (availableSpace: number, child: ChildElement): number => {
    return availableSpace - child.dimensions.outerWidth;
}

export default rowByRow;
