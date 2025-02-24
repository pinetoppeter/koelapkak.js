import rowByRow from "./algorithm";
import Dimensions, { ChildElement, KoelapkakOptions } from "./types";

export const Koelapkak = {
    init(container: string | HTMLElement, options?: KoelapkakOptions): void {
        let element: HTMLElement | null = container instanceof HTMLElement ? container : null;

        if (typeof container === 'string') {
            element = document.querySelector(container);
        }

        if (element instanceof HTMLElement) {
            const styles = window.getComputedStyle(element, null);
            let cssPosition = styles.getPropertyValue('position'); 

            if (!['absolute', 'fixed', 'relative', 'sticky'].includes(cssPosition)) {
                console.info('container initialized with position: relative due to incompatible initial position value.');
                element.style.position = 'relative';
            }
            initLib(element, options)
        }
        else {
            console.error('could not init lib for container', container);
        }
    }
}

const initLib = (container: HTMLElement, options?: KoelapkakOptions): void => {
    const observer = new MutationObserver((mutationRecords: MutationRecord[]) => {
        mutationRecords.forEach((record: MutationRecord) => {
            if ((record.target as HTMLElement).children?.length) {
                rearrangeChildren(record.target as HTMLElement);
            }
        });
    });

    // initial arranging
    rearrangeChildren(container);

    // start observing
    observer.observe(container, { childList: true, subtree: true });

    if (options?.listenForWindowResize === true) {
        window.addEventListener('resize', () => rearrangeChildren(container));
    }
}

const rearrangeChildren = (container: HTMLElement): void => {
    // init container dimensions
    let containerRect = getElementDimensions(container);
    let children: ChildElement[] = Array.from(container.children).map((child: Element) => {
        return {
            element: child,
            dimensions: getElementDimensions(child as HTMLElement),
            newPosition: {
                offset: {
                    left: 0,
                    top: 0
                }
            }
        } as ChildElement
    });

    // position elements
    let rows = rowByRow(containerRect, children);

    // render
    window.requestAnimationFrame(() => render(rows));
}

const render = (rows: ChildElement[][]) => {
    for (let i = 0, len = rows.length; i < len; i++) {
        rows[i] = rows[i].filter(item => item);

        for (let j = 0, lenJ = rows[i].length; j < lenJ; j++) {
            if (rows[i][j].element) {
                rows[i][j].element!.style.position = 'absolute'; 
                rows[i][j].element!.style.top = rows[i][j].newPosition?.offset.top + 'px';
                rows[i][j].element!.style.left = rows[i][j].newPosition?.offset.left + 'px';
            }
        }
    }
}

const getElementDimensions = (element: HTMLElement): Dimensions => {
    return {
        boundingRect: element.getBoundingClientRect(),
        padding: {
            top: parseFloat(element.style.paddingTop),
            left: parseFloat(element.style.paddingLeft),
            bottom: parseFloat(element.style.paddingBottom),
            right: parseFloat(element.style.paddingRight),
        },
        margin: {
            top: parseFloat(element.style.marginTop),
            left: parseFloat(element.style.marginLeft),
            bottom: parseFloat(element.style.marginBottom),
            right: parseFloat(element.style.marginRight),
        },
        border: {
            top: parseFloat(element.style.borderTopWidth),
            left: parseFloat(element.style.borderLeftWidth),
            bottom: parseFloat(element.style.borderBottomWidth),
            right: parseFloat(element.style.borderRightWidth),
        },
    }
}
