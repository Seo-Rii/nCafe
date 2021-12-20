import 'chromedriver';
import {Builder, By, WebDriver} from 'selenium-webdriver';

const chatURL = 'https://talk.cafe.naver.com/channels/953270669329';
const adminID = 'PPTSTUDIO'

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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

function getMessage(driver: WebDriver) {
    return new Promise<{ writer: string, message: string }>(async (resolve, reject) => {
        while (true) {
            try {
                await driver.executeScript('document.querySelector("li.log_friend:not(.read)").innerText')
                try {
                    const writer: string = await driver.executeScript('return document.querySelector("li.log_friend:not(.read)").querySelector("strong").innerText')
                    const message: string = await driver.executeScript('return document.querySelector("li.log_friend:not(.read)").querySelector("p").innerText')
                    resolve({writer, message})
                    await driver.executeScript('document.querySelector("li.log_friend:not(.read)").remove()')
                    return
                } catch (e) {
                    await driver.executeScript('document.querySelector("li.log_friend:not(.read)").remove()')
                }
            } catch (e) {
                await sleep(100)
            }
        }
    })
}

async function sendMessage(driver: WebDriver, message: string) {
    const inputBox = await driver.findElement(By.css('.msg_input'))
    const sendButton = await driver.findElement(By.css('.btn_send'))
    await inputBox.sendKeys(message);
    await sleep(100)
    await sendButton.click();
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

function isAdmin(writer: string) {
    return writer === adminID
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
        if (message === '안녕') {
            await sendMessage(driver, '안녕하세요!')
        }
        if (isAdmin(writer) && message === '종료') {
            await sendMessage(driver, '눈이 녹았어요... 곧 돌아올게요!')
            break
        }
    }
}

main()
