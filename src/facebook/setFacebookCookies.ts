import { Page } from 'puppeteer';

import { FACEBOOK_COOKIES } from '../config';

export async function setFacebookCookies(page: Page): Promise<void> {
    for (const [name, value] of Object.entries(FACEBOOK_COOKIES)) {
        await page.setCookie({
            domain: '.facebook.com',
            name,
            value,
        });
    }
}
