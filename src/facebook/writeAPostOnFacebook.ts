import { Page } from 'puppeteer';
import { forTime } from 'waitasecond';

import { clickElement } from '../utils/clickElement';
import { getElement } from '../utils/getElement';
import { xpathText } from '../utils/xpathText';

export async function writeAPostOnFacebook({
    page,
    postText,
}: {
    page: Page;
    postText: string;
}): Promise<{ postUrl: string; postUrlMobile: string }> {
    // Note: loading a fresh app to get expected behaviour
    await page.goto('https://m.facebook.com/');
    await clickElement(page, xpathText(/*What's */ `on your mind`));
    await forTime(50);
    const elementToWritePost = await getElement(page, `//textarea`);

    //await page.keyboard.type('test');

    await elementToWritePost?.type(postText, { delay: 50 });
    await forTime(500);

    await clickElement(page, `//div[@data-sigil='bottom_submit_composer']`);
    await forTime(2000);
    const postTextFirstMatchingPart = (/[\u1F600-\u1F6FF\s]+/.exec(postText) || '')[0].trim();
    await clickElement(page, xpathText(postTextFirstMatchingPart));

    await forTime(500);
    const postUrlMobile = page.url();
    const postUrl = postUrlMobile.split('m.facebook.com').join('facebook.com');

    return { postUrl, postUrlMobile };
}
