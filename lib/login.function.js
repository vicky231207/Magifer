const puppeteer = require('puppeteer');

module.exports = async ({ school, username, password }) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const url = `https://${school.split(' ').join('')}.magister.net`;
    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.$eval('#username', (el, u) => el.value = u, username.substr(0, username.length - 1));
    await delay(100);
    await page.keyboard.press(username.substr(-1));
    await delay(100);
    await page.keyboard.press('Enter');
    await delay(300);
    await page.$eval('#password', (el, u) => el.value = u, password.substr(0, password.length - 1));
    await delay(100);
    await page.keyboard.press(password.substr(-1));
    await delay(100);
    await page.keyboard.press('Enter');

    return { browser, page, params: { school, username, url } };
}

module.exports.close = browserInfo => browserInfo.browser.close(); 

const delay = (time) => {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
}
