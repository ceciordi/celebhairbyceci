export const

    offsetsToViewMeasurements: (HTMLElement, Window) => { vh: Num, vw: Num } = (elm, win) => {
        const {offsetWidth, offsetHeight} = elm,
            {innerWidth, innerHeight} = win;

        return {
            vh: offsetHeight / innerHeight * 100,
            vw: offsetWidth / innerWidth * 100
        };
    }

;
