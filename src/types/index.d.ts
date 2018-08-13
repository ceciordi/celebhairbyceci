declare type Num = number;

declare interface ImageWithLoaderModel {
    filePath: string;
    index: number,
    loading: boolean;
    loaded: boolean;
    triggerLoadRequested: boolean;
}

declare type ImagesByWidths = Map<string, Array<ImageWithLoaderModel>>;

