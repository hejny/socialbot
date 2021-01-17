import { Page } from 'puppeteer';
import { forTime } from 'waitasecond';
import { clickElement } from '../utils/clickElement';
import { getElement } from '../utils/getElement';

export async function writeACommentOnFacebookPost({
    page,
    postUrlMobile,
    commentText,
}: {
    page: Page;
    postUrlMobile: string;
    commentText: string;
}): Promise<void> {
    // Note: loading a fresh app to get expected behaviour
    await page.goto(postUrlMobile);
    const elementToWriteComment = await getElement(page, `//textarea`);
    await elementToWriteComment?.type(commentText, { delay: 50 });
    await forTime(2000 /* Need to wait longer to get the button Post active... */);
    await clickElement(page, `//button[@value='Post']`);
}
