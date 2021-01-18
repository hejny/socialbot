import puppeteer from 'puppeteer';
import { forTime } from 'waitasecond';
import { PUPPETEER_LAUNCH_OPTIONS } from '../config';

import { setFacebookCookies } from './setFacebookCookies';
import { writeACommentOnFacebookPost } from './writeACommentOnFacebookPost';
import { writeAPostOnFacebook } from './writeAPostOnFacebook';

export async function writeAPostWithCommentOnFacebook({
    postText,
    commentText,
}: {
    postText: string;
    commentText?: string;
}): Promise<{ postUrl: string }> {
    console.info(`Posting on Facebook Post+Comment`, { postText, commentText });

    const browser = await puppeteer.launch(PUPPETEER_LAUNCH_OPTIONS);
    // To preserve default tab> const page = (await browser.pages())[0];
    const page = await browser.newPage();
    await setFacebookCookies(page);

    const { postUrl, postUrlMobile } = await writeAPostOnFacebook({ page, postText });

    if (commentText) {
        (async () => {
            // Note: This wrapping is to write a comment after the function returned
            await writeACommentOnFacebookPost({ page, postUrlMobile, commentText });
            await forTime(1000);
            await browser.close();
        })();
    }

    return { postUrl };
}
