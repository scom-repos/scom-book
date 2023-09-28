import { Module, customModule, Container } from '@ijstech/components';
import ScomMultipageLauncher from '@scom/scom-multipage-launcher'
import { defaultData } from './data'

@customModule
export default class Module1 extends Module {

    private launcher: ScomMultipageLauncher;

    constructor(parent?: Container, options?: any) {
        super(parent, options);
    }

    async init() {
        super.init();
    }

    testFunction() {

    }

    render() {
        return <i-panel>

            <i-scom-multipage-launcher></i-scom-multipage-launcher>

        </i-panel>
    }
}