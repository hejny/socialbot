import puppeteer from 'puppeteer';
import { forTime } from 'waitasecond';

import { setFacebookCookies } from './setFacebookCookies';
import { writeACommentOnFacebookPost } from './writeACommentOnFacebookPost';
import { writeAPostOnFacebook } from './writeAPostOnFacebook';

export async function writeAPostWithCommentOnFacebook({
    postText,
    commentText,
}: {
    postText: string;
    commentText: string;
}): Promise<{ postUrl: string }> {
    const browser = await puppeteer.launch({ headless: false });
    const page = (await browser.pages())[0]; // TODO: maybe await browser.newPage();
    await setFacebookCookies(page);

    const { postUrl, postUrlMobile } = await writeAPostOnFacebook({ page, postText });

    (async () => {
        // Note: This wrapping is to write a comment after the function returned
        await writeACommentOnFacebookPost({ page, postUrlMobile, commentText });
        await forTime(1000);
        await browser.close();
    })();

    return { postUrl };
}
