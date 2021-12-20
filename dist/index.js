"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("chromedriver");
const selenium_webdriver_1 = require("selenium-webdriver");
const react_1 = require("./react");
const util_1 = require("./util");
const modules_1 = __importDefault(require("./modules"));
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
            await (0, util_1.sleep)(500);
        }
    }
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
async function main() {
    const driver = await new selenium_webdriver_1.Builder().forBrowser('chrome').build();
    await driver.get('https://nid.naver.com/nidlogin.login');
    await driver.wait(() => {
        return driver.executeScript('return location.host').then(function (host) {
            return host === 'www.naver.com';
        });
    });
    await driver.get(util_1.chatURL);
    await waitLoad(driver);
    await init(driver);
    await (0, react_1.sendMessage)(driver, '눈이 내려요!');
    while (true) {
        const { writer, message } = await (0, react_1.getMessage)(driver);
        await (0, modules_1.default)(driver, writer, message);
    }
}
main();
//# sourceMappingURL=index.js.map