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
import { viewerStyle, pagingStyle } from './index.css';
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
    private labelNext: Label;
    private labelPrev: Label;
    private nextPage: HStack;
    private prevPage: HStack;
    private _flattenBookPages: IBookPage[];

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
        this._flattenBookPages = this.flatBookPages(value);
        console.log("this._flattenBookPages", this._flattenBookPages)
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
        this.baseUrl = ""
    }

    private async loadPageByCid(cid: string) {
        const existedPage = this.cidMap.get(cid);
        let pageConfig: any;
        if (existedPage) {
            // loaded page
            await this.pageViewer.setData(existedPage);
            this.pageViewer.visible = true;
        } else {
            // new page
            if (cid) {
                try {
                    let response = await fetch('https://ipfs.scom.dev/ipfs/' + cid);
                    pageConfig = await response.json();
                    this.cidMap.set(cid, pageConfig);
                    await this.pageViewer.setData(pageConfig);
                    this.pageViewer.visible = true;
                } catch (err) {
                    console.log(err)
                }
            } else {
                this.pageViewer.visible = false;
            }
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
        this.setButtons(this.pagesMenu.activePageUuid);
    }

    renderLauncher() {
        console.log("renderLauncher")
        // set menu data
        this.pagesMenu.setData({ pages: this.convertPagesToMenuItems(this._data) });

        // set page viewer data
        const targetPageCid = this.getCidByUuid(this._data, this.pagesMenu.activePageUuid);
        this.loadPageByCid(targetPageCid);

        // set buttons' UI
        this.setButtons(this.pagesMenu.activePageUuid);
    }

    flatBookPages(pages: IBookPage[], flatArray: IBookPage[] = []): IBookPage[] {
        for (const page of pages) {
            flatArray.push(page);
            if (page.pages && page.pages.length > 0) {
                this.flatBookPages(page.pages, flatArray);
            }
        }
        return flatArray;
    }

    private prevPageOnClick() {
        const currentPageIndex = this._flattenBookPages.findIndex(page => page.uuid == this.pagesMenu.activePageUuid);
        const prevPage = this._flattenBookPages[currentPageIndex - 1];
        if (prevPage) this.pagesMenu.activePageUuid = prevPage.uuid;
        this.renderLauncher();
    }

    private nextPageOnClick() {
        const currentPageIndex = this._flattenBookPages.findIndex(page => page.uuid == this.pagesMenu.activePageUuid);
        const nextPage = this._flattenBookPages[currentPageIndex + 1];
        if (nextPage) this.pagesMenu.activePageUuid = nextPage.uuid;
        this.renderLauncher();
    }

    private setButtons(currentPageUUID: string) {
        const currentPageIndex = this._flattenBookPages.findIndex(page => page.uuid == currentPageUUID);
        if (currentPageIndex != -1) {
            // update UI of previous page button
            if (currentPageIndex - 1 >= 0) {
                const labelPrevCaption = this._flattenBookPages[currentPageIndex - 1].name;
                this.labelPrev.caption = labelPrevCaption;
                this.prevPage.classList.remove('hidden');
            } else {
                this.labelPrev.caption = "";
                this.prevPage.classList.add('hidden');
            }
            // update UI of next page button
            if (currentPageIndex + 1 < this._flattenBookPages.length) {
                const labelNextCaption = this._flattenBookPages[currentPageIndex + 1].name;
                this.labelNext.caption = labelNextCaption;
                this.nextPage.classList.remove('hidden');
            } else {
                this.labelNext.caption = "";
                this.nextPage.classList.add('hidden');
            }
        } else {
            this.labelPrev.caption = "";
            this.labelNext.caption = "";
        }
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
                        mode='viewer'
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
                    <i-panel class={pagingStyle} width="100%" height="15%">
                        <i-grid-layout class="paging" templateColumns={['1fr', '1fr']} gap={{ column: '1rem', row: '1rem' }}>
                            <i-hstack id='prevPage' class='btnPaging prev hidden' horizontalAlignment='space-between' verticalAlignment='center' gap='1rem' onClick={this.prevPageOnClick}>
                                <i-icon name='arrow-left'></i-icon>
                                <i-vstack class='pager-content' horizontalAlignment='end' stack={{ grow: '1', shrink: '0', basis: '0%' }} overflow="hidden">
                                    <i-label caption='Previous' class='pager-title1' font={{ size: '12px', color: '#9b9b9b' }}></i-label>
                                    <i-label id='labelPrev' class='pager-title2' maxWidth="100%" font={{ size: '16px', weight: 600 }}></i-label>
                                </i-vstack>
                            </i-hstack>
                            <i-hstack id='nextPage' class='btnPaging next hidden' horizontalAlignment='space-between' verticalAlignment='center' gap='1rem' onClick={this.nextPageOnClick}>
                                <i-vstack class='pager-content' stack={{ grow: '1', shrink: '0', basis: '0%' }} overflow="hidden">
                                    <i-label caption='Next' class='pager-title1' font={{ size: '12px', color: '#9b9b9b' }}></i-label>
                                    <i-label id='labelNext' class='pager-title2' maxWidth="100%" font={{ size: '16px', weight: 600 }}></i-label>
                                </i-vstack>
                                <i-icon name='arrow-right'></i-icon>
                            </i-hstack>
                        </i-grid-layout>
                    </i-panel>
                </i-vstack>
            </i-hstack>
        )
    }
}