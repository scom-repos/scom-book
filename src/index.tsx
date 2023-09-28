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
import PageViewer from '@scom/scom-page-viewer'
import { viewerStyle } from './index.css';

const Theme = Styles.Theme.ThemeVars;

interface ScomMultipageLauncherElement extends ControlElement {

}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ["i-scom-multipage-launcher"]: ScomMultipageLauncherElement;
        }
    }
}

@customModule
@customElements('i-scom-multipage-launcher')
export default class ScomMultipageLauncher extends Module {

    private pageViewer: PageViewer;
    private pagesMenu: PagesMenu;

    static async create(options?: ScomMultipageLauncherElement, parent?: Container) {
        let self = new this(parent, options);
        await self.ready();
        return self;
    }

    constructor(parent?: Container, options?: ScomMultipageLauncherElement) {
        super(parent, options);
    }

    init() {
        super.init();
        this.initEventBus();
        this.initEventListener();
    }

    private initEventBus() { }

    private initEventListener() { }

    private menuChanged() { }

    render() {
        return (
            <i-hstack width="100%" height={'100%'}>
                <i-panel id="menuWrapper" padding={{ top: '60px' }} width="300px" background={{ color: "#FAFAFA" }} >
                    <i-scom-pages-menu
                        id={"pagesMenu"}
                        onChanged={this.menuChanged}
                    />
                </i-panel>
                <i-panel width="calc(100% - 300px)">
                    <i-vstack id="pnlEditorViewer" width="100%" height="100%">
                        <i-panel stack={{ grow: '1' }}>
                            <i-scom-page-viewer
                                id="pageViewer"
                                class={viewerStyle}
                            />
                        </i-panel>
                    </i-vstack>
                </i-panel>
            </i-hstack>
        )
    }
}