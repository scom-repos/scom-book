export interface IBookPage {
    uuid: string;
    name: string;
    url: string;
    cid?: string;
    show: boolean;
    pages?: IBookPage[];
}