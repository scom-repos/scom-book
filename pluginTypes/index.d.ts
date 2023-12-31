/// <amd-module name="@scom/scom-book/index.css.ts" />
declare module "@scom/scom-book/index.css.ts" {
    export const viewerStyle: string;
    export const pagingStyle: string;
}
/// <amd-module name="@scom/scom-book/interface.ts" />
declare module "@scom/scom-book/interface.ts" {
    export interface IBookPage {
        uuid: string;
        name: string;
        url: string;
        cid?: string;
        show: boolean;
        pages?: IBookPage[];
    }
}
/// <amd-module name="@scom/scom-book" />
declare module "@scom/scom-book" {
    import { Module, ControlElement, Container } from '@ijstech/components';
    import { IBookPage } from "@scom/scom-book/interface.ts";
    export { IBookPage };
    interface ScomBookElement extends ControlElement {
        data?: IBookPage[];
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ["i-scom-book"]: ScomBookElement;
            }
        }
    }
    export default class ScomBook extends Module {
        private _data;
        private pageViewer;
        private pagesMenu;
        private baseUrl;
        private cidMap;
        private labelNext;
        private labelPrev;
        private nextPage;
        private prevPage;
        private _flattenBookPages;
        static create(options?: ScomBookElement, parent?: Container): Promise<ScomBook>;
        constructor(parent?: Container, options?: ScomBookElement);
        setData(value: IBookPage[]): void;
        getData(): IBookPage[];
        init(): void;
        private loadPageByCid;
        private convertPagesToMenuItems;
        private getCidByUuid;
        private initEventBus;
        private initEventListener;
        private menuChanged;
        renderLauncher(): void;
        flatBookPages(pages: IBookPage[], flatArray?: IBookPage[]): IBookPage[];
        private prevPageOnClick;
        private nextPageOnClick;
        private setButtons;
        render(): any;
    }
}
