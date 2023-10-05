import { Module, customModule, Container } from '@ijstech/components';
import ScomBook from '@scom/scom-book'
import { defaultData } from './data'

@customModule
export default class Module1 extends Module {

    private launcher: ScomBook;

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

            <i-scom-book data={defaultData}></i-scom-book>

        </i-panel>
    }
}