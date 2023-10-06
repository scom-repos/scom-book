var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@scom/scom-book/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.pagingStyle = exports.viewerStyle = void 0;
    const Theme = components_1.Styles.Theme.ThemeVars;
    exports.viewerStyle = components_1.Styles.style({
        $nest: {
            '&>*': {
                boxShadow: 'rgba(50, 50, 105, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px',
                marginTop: '0px !important'
            }
        }
    });
    exports.pagingStyle = components_1.Styles.style({
        display: 'block',
        $nest: {
            '@media(max-width: 970px)': {
                $nest: {
                    '.paging': {
                        flexWrap: 'wrap',
                        gridTemplateColumns: '1fr'
                    }
                }
            },
            '.btnPaging': {
                boxShadow: '0px 1px 2px rgb(0 0 0 / 12%)',
                border: '1px solid #EEE',
                padding: '16px',
                cursor: 'pointer',
                minWidth: 0,
                $nest: {
                    '&.hidden': {
                        display: 'none',
                    },
                    'i-label': {
                        display: 'block',
                        lineHeight: '25px',
                    },
                    '&.prev': {
                        $nest: {
                            'i-icon': {
                                float: 'left',
                            },
                            'i-panel.pager-content': {
                                float: 'right',
                                $nest: {
                                    'i-label': {
                                        textAlign: 'right',
                                    },
                                },
                            },
                            '@media (max-width: 700px)': {
                                width: '100%',
                            },
                        },
                    },
                    '&.next': {
                        $nest: {
                            'i-icon': {
                                float: 'right',
                            },
                            'i-panel.pager-content': {
                                float: 'left',
                                $nest: {
                                    'i-label': {
                                        textAlign: 'left',
                                    },
                                },
                            },
                            '@media (max-width: 700px)': {
                                width: '100%',
                                marginLeft: '0',
                            },
                        },
                    },
                    '&.prev-full': {
                        width: '100%',
                        $nest: {
                            'i-icon': {
                                float: 'left',
                            },
                            'i-panel.pager-content': {
                                float: 'right',
                                $nest: {
                                    'i-label': {
                                        textAlign: 'right',
                                    },
                                },
                            },
                        },
                    },
                    '&.next-full': {
                        width: '100%',
                        $nest: {
                            'i-icon': {
                                float: 'right',
                            },
                            'i-panel.pager-content': {
                                float: 'left',
                                $nest: {
                                    'i-label': {
                                        textAlign: 'left',
                                    },
                                },
                            },
                        },
                    },
                    'i-icon': {
                        height: '20px',
                        width: '20px'
                    },
                    '.pager-content': {
                        clear: 'none',
                        maxWidth: '90%',
                        $nest: {
                            'i-label': {
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            },
                            '.pager-title1 div': {
                                fontSize: '12px',
                                fontWeight: '400',
                                color: '#8899A8',
                            },
                            '.pager-title2': {
                                whiteSpace: 'nowrap',
                                $nest: {
                                    div: {
                                        fontSize: '20px',
                                        fontWeight: '500',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: 'block',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    });
});
define("@scom/scom-book/interface.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("@scom/scom-book", ["require", "exports", "@ijstech/components", "@scom/scom-book/index.css.ts"], function (require, exports, components_2, index_css_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_2.Styles.Theme.ThemeVars;
    let ScomBook = class ScomBook extends components_2.Module {
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        constructor(parent, options) {
            super(parent, options);
            this.cidMap = new Map(); // <cid, sconfig>
        }
        setData(value) {
            this._data = value;
            this._flattenBookPages = this.flatBookPages(value);
            console.log("this._flattenBookPages", this._flattenBookPages);
            this.renderLauncher();
        }
        getData() {
            return this._data;
        }
        init() {
            super.init();
            this.initEventBus();
            this.initEventListener();
            this._data = this.getAttribute('data', true);
            this.renderLauncher();
            this.baseUrl = "...";
        }
        async loadPageByCid(cid) {
            const existedPage = this.cidMap.get(cid);
            let pageConfig;
            if (existedPage) {
                // loaded page
                await this.pageViewer.setData(existedPage);
            }
            else {
                // new page
                try {
                    let response = await fetch('https://ipfs.scom.dev/ipfs/' + cid);
                    pageConfig = await response.json();
                }
                catch (err) {
                    console.log(err);
                }
                this.cidMap.set(cid, pageConfig);
                await this.pageViewer.setData(pageConfig);
            }
        }
        convertPagesToMenuItems(pages) {
            return pages.map((page) => {
                const { uuid, name, url } = page;
                const menuItem = { uuid, name, url };
                if (page.pages && page.pages.length > 0) {
                    menuItem.pages = this.convertPagesToMenuItems(page.pages);
                }
                return menuItem;
            });
        }
        getCidByUuid(pages, uuidToFind) {
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
        initEventBus() { }
        initEventListener() { }
        async menuChanged(newPage, oldPage) {
            // this.updatePath();
            const cid = this.getCidByUuid(this._data, newPage.uuid);
            this.loadPageByCid(cid);
            this.setButtons(this.pagesMenu.activePageUuid);
        }
        renderLauncher() {
            console.log("renderLauncher");
            // set menu data
            this.pagesMenu.setData({ pages: this.convertPagesToMenuItems(this._data) });
            // set page viewer data
            const targetPageCid = this.getCidByUuid(this._data, this.pagesMenu.activePageUuid);
            this.loadPageByCid(targetPageCid);
            // set buttons' UI
            this.setButtons(this.pagesMenu.activePageUuid);
        }
        flatBookPages(pages, flatArray = []) {
            for (const page of pages) {
                flatArray.push(page);
                if (page.pages && page.pages.length > 0) {
                    this.flatBookPages(page.pages, flatArray);
                }
            }
            return flatArray;
        }
        prevPageOnClick() {
            const currentPageIndex = this._flattenBookPages.findIndex(page => page.uuid == this.pagesMenu.activePageUuid);
            const prevPage = this._flattenBookPages[currentPageIndex - 1];
            if (prevPage)
                this.pagesMenu.activePageUuid = prevPage.uuid;
            const cid = this.getCidByUuid(this._data, this.pagesMenu.activePageUuid);
            this.loadPageByCid(cid);
            this.setButtons(this.pagesMenu.activePageUuid);
        }
        nextPageOnClick() {
            const currentPageIndex = this._flattenBookPages.findIndex(page => page.uuid == this.pagesMenu.activePageUuid);
            const nextPage = this._flattenBookPages[currentPageIndex + 1];
            if (nextPage)
                this.pagesMenu.activePageUuid = nextPage.uuid;
            const cid = this.getCidByUuid(this._data, this.pagesMenu.activePageUuid);
            this.loadPageByCid(cid);
            this.setButtons(this.pagesMenu.activePageUuid);
        }
        setButtons(currentPageUUID) {
            const currentPageIndex = this._flattenBookPages.findIndex(page => page.uuid == currentPageUUID);
            if (currentPageIndex != -1) {
                // update UI of previous page button
                if (currentPageIndex - 1 >= 0) {
                    const labelPrevCaption = this._flattenBookPages[currentPageIndex - 1].name;
                    this.labelPrev.caption = labelPrevCaption;
                    this.prevPage.classList.remove('hidden');
                }
                else {
                    this.labelPrev.caption = "";
                    this.prevPage.classList.add('hidden');
                }
                // update UI of next page button
                if (currentPageIndex + 1 < this._flattenBookPages.length) {
                    const labelNextCaption = this._flattenBookPages[currentPageIndex + 1].name;
                    this.labelNext.caption = labelNextCaption;
                    this.nextPage.classList.remove('hidden');
                }
                else {
                    this.labelNext.caption = "";
                    this.nextPage.classList.add('hidden');
                }
            }
            else {
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
            return (this.$render("i-hstack", { width: "100%", height: '100%' },
                this.$render("i-panel", { id: "menuWrapper", padding: { top: '60px' }, width: "300px", background: { color: "#FAFAFA" }, height: '100%' },
                    this.$render("i-scom-pages-menu", { id: "pagesMenu", mode: 'viewer', onChanged: this.menuChanged })),
                this.$render("i-vstack", { width: "calc(100% - 300px)", height: '100%' },
                    this.$render("i-vstack", { id: "pnlEditorViewer", width: "100%", height: "85%" },
                        this.$render("i-panel", { stack: { grow: '1' } },
                            this.$render("i-scom-page-viewer", { id: "pageViewer", class: index_css_1.viewerStyle }))),
                    this.$render("i-panel", { class: index_css_1.pagingStyle, width: "100%", height: "15%" },
                        this.$render("i-grid-layout", { class: "paging", templateColumns: ['1fr', '1fr'], gap: { column: '1rem', row: '1rem' } },
                            this.$render("i-hstack", { id: 'prevPage', class: 'btnPaging prev hidden', horizontalAlignment: 'space-between', verticalAlignment: 'center', gap: '1rem', onClick: this.prevPageOnClick },
                                this.$render("i-icon", { name: 'arrow-left' }),
                                this.$render("i-vstack", { class: 'pager-content', horizontalAlignment: 'end', stack: { grow: '1', shrink: '0', basis: '0%' }, overflow: "hidden" },
                                    this.$render("i-label", { caption: 'Previous', class: 'pager-title1', font: { size: '12px', color: '#9b9b9b' } }),
                                    this.$render("i-label", { id: 'labelPrev', class: 'pager-title2', maxWidth: "100%", font: { size: '16px', weight: 600 } }))),
                            this.$render("i-hstack", { id: 'nextPage', class: 'btnPaging next hidden', horizontalAlignment: 'space-between', verticalAlignment: 'center', gap: '1rem', onClick: this.nextPageOnClick },
                                this.$render("i-vstack", { class: 'pager-content', stack: { grow: '1', shrink: '0', basis: '0%' }, overflow: "hidden" },
                                    this.$render("i-label", { caption: 'Next', class: 'pager-title1', font: { size: '12px', color: '#9b9b9b' } }),
                                    this.$render("i-label", { id: 'labelNext', class: 'pager-title2', maxWidth: "100%", font: { size: '16px', weight: 600 } })),
                                this.$render("i-icon", { name: 'arrow-right' })))))));
        }
    };
    ScomBook = __decorate([
        components_2.customModule,
        (0, components_2.customElements)('i-scom-book')
    ], ScomBook);
    exports.default = ScomBook;
});
