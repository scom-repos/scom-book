/// <amd-module name="@scom/scom-multipage-launcher/index.css.ts" />
declare module "@scom/scom-multipage-launcher/index.css.ts" {
    export const viewerStyle: string;
}
/// <amd-module name="@scom/scom-multipage-launcher" />
declare module "@scom/scom-multipage-launcher" {
    import { Module, ControlElement, Container } from '@ijstech/components';
    interface ScomMultipageLauncherElement extends ControlElement {
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ["i-scom-multipage-launcher"]: ScomMultipageLauncherElement;
            }
        }
    }
    export default class ScomMultipageLauncher extends Module {
        static create(options?: ScomMultipageLauncherElement, parent?: Container): Promise<ScomMultipageLauncher>;
        constructor(parent?: Container, options?: ScomMultipageLauncherElement);
        init(): void;
        private initEventBus;
        private initEventListener;
        private menuChanged;
        render(): any;
    }
}
