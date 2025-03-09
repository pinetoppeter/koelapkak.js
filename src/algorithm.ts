import Dimensions, { ChildElement } from "./types";

const rowByRow = (containerRect: Dimensions, children: ChildElement[]): ChildElement[][] => {
    // each completed row will be stored in new array
    let rows: ChildElement[][] = [[]];
    let availableSpace = containerRect.boundingRect.width;

    return arrange(children, availableSpace, rows);
}

const arrange = (children: ChildElement[], windowWidth: number, rows: ChildElement[][]): ChildElement[][] => {
    let rowIndex = 0;
    let colIndex = 0;

    while (children.length) {
        let child = children.pop();

        if (!child) {
            continue;
        }

        let horizontalSpace = availableHorizontalSpace(rows[rowIndex]
            ?.reduce((carry, elem) => carry - (elem.dimensions.boundingRect.width ?? 0), windowWidth) ?? windowWidth, child);
   
        if (horizontalSpace <= 0) {
            rowIndex++;
            rows[rowIndex] = [];
        }
        else {
            child.newPosition.offset.left = rows[rowIndex]?.[colIndex - 1]?.newPosition
                ? (rows[rowIndex][colIndex - 1].newPosition?.offset.left
                + rows[rowIndex][colIndex - 1].dimensions.boundingRect.width)
                : 0;
        }

        if (rowIndex > 0) {
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
            const newLeft = element.newPosition?.offset.left;
            const newRight = newLeft + element.dimensions.boundingRect.width;
            const prevLeft = currentRow[i].newPosition?.offset.left;
            const prevRight = currentRow[i].newPosition?.offset.left + currentRow[i].dimensions.boundingRect.width;
            const newTop = element.newPosition?.offset.top;
            const prevTop = currentRow[i].newPosition?.offset.top;
            const prevBottom = prevTop + currentRow[i].dimensions.boundingRect.height

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
    return availableSpace - child.dimensions.boundingRect.width;
}

export default rowByRow;
