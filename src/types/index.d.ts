declare type Num = number;

declare interface ImageWithLoaderModel {
    filePath: string;
    index: Num;
    loading: boolean;
    loaded: boolean;
    triggerLoadRequested: boolean;
    width: Num;
    height: Num;
}

declare type ImagesByWidths = Map<string, Array<ImageWithLoaderModel>>;

