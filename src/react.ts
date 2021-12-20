import {By, WebDriver} from "selenium-webdriver";
import {sleep} from "./util";


export function getMessage(driver: WebDriver) {
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

export async function sendMessage(driver: WebDriver, message: string) {
    const inputBox = await driver.findElement(By.css('.msg_input'))
    const sendButton = await driver.findElement(By.css('.btn_send'))
    await inputBox.sendKeys(message);
    await sleep(100)
    await sendButton.click();
}
