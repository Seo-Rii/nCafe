import {sendMessage} from "../react";
import {WebDriver} from "selenium-webdriver";
import _ from 'lodash'

export default async function (driver: WebDriver, writer: string, message: string) {
    if (message === '안녕' || message === '눈하') {
        await sendMessage(driver, _.sample(['안녕하세요!', '만나서 반가워요!']) as string);
        return true
    }
    return false
}
