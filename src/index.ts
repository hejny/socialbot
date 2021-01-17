import puppeteer, { Page, ElementHandle } from 'puppeteer';
import { forEver, forTime } from '../node_modules/waitasecond/dist/main';
import { FACEBOOK_COOKIES } from './config';

async function createFacebookSession() {
    const browser = await puppeteer.launch({ headless: false });
    const page = (await browser.pages())[0]; // TODO: maybe await browser.newPage();

    for (const [name, value] of Object.entries(FACEBOOK_COOKIES)) {
        //console.log([name, value]);
        await page.setCookie({
            domain: '.facebook.com',
            name,
            value,
        });
    }

    await page.goto('https://m.facebook.com/?soft=composer');
    //await page.waitForNavigation({ waitUntil: 'load' });

    return {
        page,
        close: async () => {
            await browser.close();
        },
    };
}

async function main() {
    const postText = `test ${Math.random()}`;
    const commentText = `test comment ${Math.random()}`;

    const postTextFirstLine = postText.split('\n', 2)[0].trim();

    const session = await createFacebookSession();

    await clickElement(session.page, xpathText(/*What's */ `on your mind`));
    await forTime(50);
    const elementToWritePost = await getElement(session.page, `//textarea`);

    //await session.page.keyboard.type('test');

    await elementToWritePost?.type(postText, { delay: 50 });
    await forTime(500);

    await clickElement(session.page, `//div[@data-sigil='bottom_submit_composer']`);
    await forTime(2000);
    await clickElement(session.page, xpathText(postTextFirstLine));

    await forTime(500);
    const postUrlMobile = session.page.url();
    const postUrl = postUrlMobile.split('m.facebook.com').join('facebook.com');

    // TODO: Return here

    await writeACommentOnFacebookPost({ page: session.page, postUrlMobile, commentText });

    console.log({ postUrl });
    return { postUrl };

    await forEver();
    await forTime(1000);
    session.page.close();
}

main();

async function writeACommentOnFacebookPost({
    page,
    postUrlMobile,
    commentText,
}: {
    page: Page;
    postUrlMobile: string;
    commentText: string;
}) {
    // Note: loading a fresh app to get expected behaviour
    await page.goto(postUrlMobile);
    const elementToWriteComment = await getElement(page, `//textarea`);
    await elementToWriteComment?.type(commentText, { delay: 50 });
    await forTime(2000 /* Need to wait longer to get the button Post active... */);
    await clickElement(page, `//button[@value='Post']`);
}

async function clickElement(page: Page, xpath: string) {
    const element = await getElement(page, xpath);
    element?.click();
}

async function getElement(page: Page, xpath: string) {
    const elements = await page.$x(xpath);

    if (elements.length === 0) return null;
    return elements[elements.length - 1];
}

function xpathText(text: string, elementTag = '*') {
    // TODO: escaping
    return `//${elementTag}[contains(text(), '${text}')]`;
}
