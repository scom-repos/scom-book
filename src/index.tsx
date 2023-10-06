import {
    Module,
    customModule,
    Styles,
    ControlElement,
    customElements,
    Container,
    Control,
    Label,
    VStack,
    Input,
    HStack
} from '@ijstech/components';
import PagesMenu from '@scom/scom-pages-menu';
import { IPagesMenu, IPagesMenuItem } from '@scom/scom-pages-menu';
import PageViewer from '@scom/scom-page-viewer'
import { viewerStyle } from './index.css';
import { IBookPage } from './interface';
export { IBookPage }

const Theme = Styles.Theme.ThemeVars;

interface ScomBookElement extends ControlElement {
    data?: IBookPage[]
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ["i-scom-book"]: ScomBookElement;
        }
    }
}

@customModule
@customElements('i-scom-book')
export default class ScomBook extends Module {

    private _data: IBookPage[];
    private pageViewer: PageViewer;
    private pagesMenu: PagesMenu;
    private baseUrl: string;
    private cidMap: Map<string, any> = new Map(); // <cid, sconfig>

    static async create(options?: ScomBookElement, parent?: Container) {
        let self = new this(parent, options);
        await self.ready();
        return self;
    }

    constructor(parent?: Container, options?: ScomBookElement) {
        super(parent, options);
    }

    setData(value: IBookPage[]) {
        this._data = value;
        this.renderLauncher();
    }

    getData(): IBookPage[] {
        return this._data;
    }

    init() {
        super.init();
        this.initEventBus();
        this.initEventListener();
        this._data = this.getAttribute('data', true);
        this.renderLauncher();
        this.baseUrl = "..."
    }

    private async loadPageByCid(cid: string) {
        const existedPage = this.cidMap.get(cid);
        let pageConfig: any;
        if (existedPage) {
            // loaded page
            await this.pageViewer.setData(existedPage);
        } else {
            // new page
            try {
                let response = await fetch('https://ipfs.scom.dev/ipfs/' + cid);
                pageConfig = await response.json();
            } catch (err) {
                console.log(err)
            }
            this.cidMap.set(cid, pageConfig);
            await this.pageViewer.setData(pageConfig);
        }
    }

    private convertPagesToMenuItems(pages: IBookPage[]): IPagesMenuItem[] {
        return pages.map((page) => {
            const { uuid, name, url } = page;
            const menuItem: IPagesMenuItem = { uuid, name, url };

            if (page.pages && page.pages.length > 0) {
                menuItem.pages = this.convertPagesToMenuItems(page.pages);
            }

            return menuItem;
        });
    }

    private getCidByUuid(pages: IBookPage[], uuidToFind: string): string | undefined {
        for (const page of pages) {
            if (page.uuid === uuidToFind) {
                return page.cid;
            }
            if (page.pages && page.pages.length > 0) {
                const cid = this.getCidByUuid(page.pages, uuidToFind);
                if (cid !== undefined) {
                    return cid;
                }
            }
        }
        return undefined;
    }

    private initEventBus() { }

    private initEventListener() { }

    private async menuChanged(newPage: any, oldPage: any) {
        // this.updatePath();
        const cid = this.getCidByUuid(this._data, newPage.uuid)
        this.loadPageByCid(cid);
    }

    renderLauncher() {
        console.log("renderLauncher")
        // set menu data
        this.pagesMenu.setData({ pages: this.convertPagesToMenuItems(this._data) });

        // set page viewer data
        const targetPageCid = this.getCidByUuid(this._data, this.pagesMenu.activePageUuid);
        this.loadPageByCid(targetPageCid);
    }

    private onClickedPrevPage() {

    }

    private onClickedNextPage() {

    }

    // private updatePath(suffix?: string) {
    //     const page = this.pages[this.tabsNode.activeTabIndex];
    //     let baseUrl = this.baseUrl || "";
    //     let url = baseUrl + page.url;
    //     if (suffix) {
    //         url += suffix;
    //         history.pushState({}, "", url);
    //     }
    //     else {
    //         history.pushState({}, "", url);
    //         this.updateUIByUrl();
    //     }
    // }

    // private updateUIByUrl() {
    //     let baseUrl = this.baseUrl || "";
    //     let path = (window.location.hash || window.location.pathname).replace(baseUrl, "");
    //     if (path[0] == '/') {
    //         path = path.substring(1);
    //     }
    //     const paths = path.split('/');
    //     const pageIndex = this.pages.findIndex(page => page.url === "/" + paths[0]);
    //     this.tabsNode.activeTabIndex = pageIndex !== -1 ? pageIndex : 0;
    //     if (paths[1] && this.pages[pageIndex]?.type !== 'docs') {
    //         let data: any;
    //         if (this.pages[pageIndex]?.type === 'widgets') {
    //             data = this.projectOffer.find(offer => offer.dataUri === paths[1]);
    //         }
    //         else if (this.pages[pageIndex]?.type === 'posts') {
    //             data = this.projectPost.find(post => post.dataUri === paths[1]);
    //         }
    //         if (!data) {
    //             this.updatePath();
    //         } else {
    //             this.onShowDetail(data);
    //         }
    //     } else {
    //         this.pnlListWrap.visible = true;
    //         this.pnlDetailWrap.visible = false;
    //         this.btnBack.visible = this.showBackButton;
    //         this.onSetupPage();
    //     }
    // }


    render() {
        return (
            <i-hstack width="100%" height={'100%'}>
                <i-panel id="menuWrapper" padding={{ top: '60px' }} width="300px" background={{ color: "#FAFAFA" }} height={'100%'}>
                    <i-scom-pages-menu
                        id={"pagesMenu"}
                        onChanged={this.menuChanged}
                    />
                </i-panel>
                <i-vstack width="calc(100% - 300px)" height={'100%'}>
                    <i-vstack id="pnlEditorViewer" width="100%" height="85%">
                        <i-panel stack={{ grow: '1' }}>
                            <i-scom-page-viewer
                                id="pageViewer"
                                class={viewerStyle}
                            />
                        </i-panel>
                    </i-vstack>
                    <i-hstack width="100%" height="15%" horizontalAlignment='space-between'>
                        <i-hstack id="pnlPrevPage" class="pointer" onClick={this.onClickedPrevPage}>
                            <i-icon name='arrow-left' width='15px' height='15px' />
                            <i-vstack>
                                <i-label caption="Previous"></i-label>
                                <i-label id='lblPrevPage'></i-label>
                            </i-vstack>
                        </i-hstack>
                        <i-hstack id="pnlNextPage" class="pointer" onClick={this.onClickedNextPage}>
                            <i-vstack>
                                <i-label caption="Next"></i-label>
                                <i-label id='lblNextPage'></i-label>
                            </i-vstack>
                            <i-icon name='arrow-right' width='15px' height='15px' />
                        </i-hstack>
                    </i-hstack>
                </i-vstack>
            </i-hstack>
        )
    }
}