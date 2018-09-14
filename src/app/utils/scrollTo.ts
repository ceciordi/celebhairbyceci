import {isset} from 'fjl';

/**
 * @todo This code is nasty and was copied from a project which had copied it from the wilds.  Needs cleanup.
 */
const easings = {
    linear(t) {
        return t;
    },
    easeInQuad(t) {
        return t * t;
    },
    easeOutQuad(t) {
        return t * (2 - t);
    },
    easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    easeInCubic(t) {
        return t * t * t;
    },
    easeOutCubic(t) {
        return (--t) * t * t + 1;
    },
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
    easeInQuart(t) {
        return t * t * t * t;
    },
    easeOutQuart(t) {
        return 1 - (--t) * t * t * t;
    },
    easeInOutQuart(t) {
        return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
    },
    easeInQuint(t) {
        return t * t * t * t * t;
    },
    easeOutQuint(t) {
        return 1 + (--t) * t * t * t * t;
    },
    easeInOutQuint(t) {
        return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
    }
};

let rqAnimationFrame;

export function scrollWindowTo(destination, duration = 200, easing = 'linear', callback?) {
    const start = window.pageYOffset;
    const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();
    const {body, documentElement} = document;
    const documentHeight = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        documentElement.clientHeight,
        documentElement.scrollHeight,
        documentElement.offsetHeight
    );
    const windowHeight = window.innerHeight || documentElement.clientHeight || body.clientHeight;
    const destinationOffset = typeof destination === 'number' ? destination : destination.offsetTop;
    const destinationOffsetToScroll =
        Math.round(
            documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight :
                destinationOffset);

    if ('requestAnimationFrame' in window === false) {
        window.scroll(0, destinationOffsetToScroll);
        if (callback) {
            callback();
        }
        return;
    }

    function scroll() {
        const now = 'now' in window.performance ? performance.now() : new Date().getTime();
        const time = Math.min(1, ((now - startTime) / duration));
        const timeFunction = easings[easing](time);
        window.scroll(0, Math.ceil((timeFunction * (destinationOffsetToScroll - start)) + start));
        // console.log(Math.round(window.pageYOffset), destinationOffsetToScroll)
        if (Math.round(window.pageYOffset) === destinationOffsetToScroll) {
            if (callback) {
                callback();
            }
            if (isset(rqAnimationFrame)) {
                cancelAnimationFrame(rqAnimationFrame);
            }
            return;
        }
        rqAnimationFrame = requestAnimationFrame(scroll);
    }

    cancelAnimationFrame(rqAnimationFrame);
    scroll();
}

export default scrollWindowTo;
