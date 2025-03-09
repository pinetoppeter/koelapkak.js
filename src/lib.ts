import rowByRow from "./algorithm";
import Dimensions, { ChildElement, Direction, KoelapkakOptions } from "./types";

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
                render(rearrangeChildren(record.target as HTMLElement), options);
            }
        });
    });

    // initial arranging
    render(rearrangeChildren(container), options);

    // start observing
    observer.observe(container, { childList: true, subtree: true });

    if (options?.listenForWindowResize === true) {
        window.addEventListener('resize', () => {
            render(rearrangeChildren(container), options);
        });
    }
}

const rearrangeChildren = (container: HTMLElement): ChildElement[][] => {
    // init container dimensions
    let containerRect = getElementDimensions(container);
    let children: ChildElement[] = Array.from(container.children).map((child: Element) => {
        return {
            element: child,
            dimensions: getElementDimensions(child as HTMLElement),
            newPosition: {
                offset: {
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0
                }
            }
        } as ChildElement
    });

    // position elements
    return rowByRow(containerRect, children);
}

const render = (rows: ChildElement[][], options?: KoelapkakOptions) => {
    window.requestAnimationFrame(() => {
        for (let i = 0, len = rows.length; i < len; i++) {
            rows[i] = rows[i].filter(item => item);
    
            for (let j = 0, lenJ = rows[i].length; j < lenJ; j++) {
                if (rows[i][j].element) {
                    rows[i][j].element!.style.position = 'absolute'; 
                    rows[i][j].element!.style.top = rows[i][j].newPosition?.offset.top + 'px';
    
                    if (options?.direction === Direction.RIGHT_TO_LEFT) {
                        rows[i][j].element!.style.right = rows[i][j].newPosition?.offset.left + 'px';
                    }
                    else {
                        rows[i][j].element!.style.left = rows[i][j].newPosition?.offset.left + 'px';
                    }
                }
            }
        }
    })
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
