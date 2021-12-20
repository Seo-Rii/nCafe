import {sendMessage} from "../react";
import {WebDriver} from "selenium-webdriver";
import {isAdmin} from "../util";

export default async function (driver: WebDriver, writer: string, message: string) {
    if (message === '종료') {
        if(isAdmin(writer)) {
            await sendMessage(driver, '눈이 녹았어요... 곧 돌아올게요!')
            process.exit(0)
            return true
        }
        else {
            await sendMessage(driver, '눈이 녹기에는 아직 날씨가 너무 추워요...')
            return true
        }
    }
    return false
}
