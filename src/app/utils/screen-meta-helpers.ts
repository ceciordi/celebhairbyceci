
enum ScreenType {
    Desktop,
    Tablet,
    Mobile
}

enum ScreenOrientation {
    Landscape,
    Portrait
}

const commonScreenSizes = [
    [411, 731, ScreenType.Mobile],
    [480, 853, ScreenType.Mobile],
    [320, 568, ScreenType.Mobile],
    [320, 640, ScreenType.Mobile],
    [360, 740, ScreenType.Mobile],
    [375, 812, ScreenType.Mobile],
    [600, 960, ScreenType.Tablet],
    [768, 1024, ScreenType.Tablet],
    [800, 1280, ScreenType.Tablet],
    [1024, 1366, ScreenType.Tablet],
    [1280, 850, ScreenType.Tablet],
    [800, 600, ScreenType.Desktop],
    [1024, 768, ScreenType.Desktop],
    [1920, 1080, ScreenType.Desktop],
    [2560, 1440, ScreenType.Desktop],
];

export const

    getScreenMeta = () => {
        const {Landscape, Portrait} = ScreenOrientation,
            {innerWidth, innerHeight} = window,
            isTouchDevice = !!window.ontouchstart,
            metaFromCommon = commonScreenSizes.filter(([w, h]) =>
                (innerWidth === h && innerHeight === w) ||
                (innerWidth === w && innerHeight === h)
            ).shift();
        let screenType;
        if (!metaFromCommon) {
            screenType = !isTouchDevice ? ScreenType.Desktop : ScreenType.Mobile;
        } else {
            screenType = metaFromCommon[2];
        }
        return {
            isTouchDevice,
            screenType,
            orientation: innerWidth > innerHeight ? Landscape : Portrait,
            width: innerWidth,
            height: innerHeight
        };
    }
;
