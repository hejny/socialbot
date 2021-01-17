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
    const session = await createFacebookSession();

    await clickElement(session.page, xpathText(/*What's */ ` on your mind`));
    await forTime(50);
    const element = await getElement(session.page, `//textarea`);

    //await session.page.keyboard.type('test');

    element?.type(`test ${Math.random()}`, { delay: 50 });
    await forTime(2000);

    await clickElement(session.page, `//div[@data-sigil='bottom_submit_composer']`);

    await forEver();
    session.page.close();
}

main();

async function clickElement(page: Page, xpath: string) {
    const element = await getElement(page, xpath);
    element?.click();
}

async function getElement(page: Page, xpath: string) {
    const elements = await page.$x(xpath);

    if (elements.length === 0) return null;
    return elements[elements.length - 1];
}

function xpathText(text: string) {
    // TODO: escaping
    return `//*[contains(text(), '${text}')]`;
}
