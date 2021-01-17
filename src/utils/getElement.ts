import { Page } from 'puppeteer';

export async function getElement(page: Page, xpath: string) {
    const elements = await page.$x(xpath);

    if (elements.length === 0) return null;
    return elements[elements.length - 1];
}
