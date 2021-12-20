"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("chromedriver");
const selenium_webdriver_1 = require("selenium-webdriver");
const chatURL = 'https://talk.cafe.naver.com/channels/953270669329';
const adminID = 'PPTSTUDIO';
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function waitLoad(driver) {
    await driver.wait(function () {
        return driver.executeScript('return document.readyState').then((readyState) => {
            return readyState === 'complete';
        });
    });
    while (true) {
        try {
            await driver.findElement(selenium_webdriver_1.By.css('.msg_input'));
            break;
        }
        catch (e) {
            await sleep(500);
        }
    }
}
function getMessage(driver) {
    return new Promise(async (resolve, reject) => {
        while (true) {
            try {
                await driver.executeScript('document.querySelector("li.log_friend:not(.read)").innerText');
                try {
                    const writer = await driver.executeScript('return document.querySelector("li.log_friend:not(.read)").querySelector("strong").innerText');
                    const message = await driver.executeScript('return document.querySelector("li.log_friend:not(.read)").querySelector("p").innerText');
                    resolve({ writer, message });
                    await driver.executeScript('document.querySelector("li.log_friend:not(.read)").remove()');
                    return;
                }
                catch (e) {
                    await driver.executeScript('document.querySelector("li.log_friend:not(.read)").remove()');
                }
            }
            catch (e) {
                await sleep(100);
            }
        }
    });
}
async function sendMessage(driver, message) {
    const inputBox = await driver.findElement(selenium_webdriver_1.By.css('.msg_input'));
    const sendButton = await driver.findElement(selenium_webdriver_1.By.css('.btn_send'));
    await inputBox.sendKeys(message);
    await sleep(100);
    await sendButton.click();
}
async function init(driver) {
    while (true) {
        try {
            await driver.executeScript('document.querySelector("li.log_friend:not(.read)").remove()');
        }
        catch (e) {
            return;
        }
    }
}
function isAdmin(writer) {
    return writer === adminID;
}
async function main() {
    const driver = await new selenium_webdriver_1.Builder().forBrowser('chrome').build();
    await driver.get('https://nid.naver.com/nidlogin.login');
    await driver.wait(() => {
        return driver.executeScript('return location.host').then(function (host) {
            return host === 'www.naver.com';
        });
    });
    await driver.get(chatURL);
    await waitLoad(driver);
    await init(driver);
    await sendMessage(driver, '눈이 내려요!');
    while (true) {
        const { writer, message } = await getMessage(driver);
        if (message === '안녕') {
            await sendMessage(driver, '안녕하세요!');
        }
        if (isAdmin(writer) && message === '종료') {
            await sendMessage(driver, '눈이 녹았어요... 곧 돌아올게요!');
            break;
        }
    }
}
main();
//# sourceMappingURL=index.js.map