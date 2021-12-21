import 'chromedriver';
import {Builder, By, WebDriver} from 'selenium-webdriver';
import {getMessage, sendMessage} from "./react";
import {sleep, chatURL} from "./util";
import moduleHandler from './modules'
import fs from "fs";


async function waitLoad(driver: WebDriver) {
    await driver.wait(function () {
        return driver.executeScript('return document.readyState').then((readyState: any) => {
            return readyState === 'complete';
        });
    });
    while (true) {
        try {
            await driver.findElement(By.css('.msg_input'))
            break
        } catch (e) {
            await sleep(500)
        }
    }
}

async function init(driver: WebDriver) {
    while (true) {
        try {
            await driver.executeScript('document.querySelector("li.log_friend:not(.read)").remove()')
        } catch (e) {
            return
        }
    }
}

async function main() {
    const driver = await new Builder().forBrowser('chrome').build();
    await driver.get('https://nid.naver.com/nidlogin.login');
    await driver.wait(() => {
        return driver.executeScript('return location.host').then(function (host) {
            return host === 'www.naver.com';
        });
    });
    await driver.get(chatURL)
    await waitLoad(driver)
    await init(driver)
    await sendMessage(driver, '눈이 내려요!')
    while (true) {
        const {writer, message} = await getMessage(driver)
        await moduleHandler(driver, writer, message)
    }
}

main()
