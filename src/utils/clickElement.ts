import { Page } from 'puppeteer';
import { getElement } from './getElement';

export async function clickElement(page: Page, xpath: string) {
    const element = await getElement(page, xpath);
    element?.click();
}
