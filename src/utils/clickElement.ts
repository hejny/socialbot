import { Page } from 'puppeteer';
import { forTime } from 'waitasecond';
import { getElement } from './getElement';

export async function clickElement(page: Page, xpath: string): Promise<void> {
    // Note: Doing few attempts to getElement and click on it>
    for (let i = 0; i < 10; i++) {
        const element = await getElement(page, xpath);
        if (element) {
            try {
                return await element.click();
            } catch (error) {
                console.error(error);
                await forTime(i * 150);
            }
        } else {
            await forTime(i * 150);
        }
    }
    console.warn(`Cannot find element "${xpath}" to click on.`);
}
