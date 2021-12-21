import {sendMessage} from "../react";
import {WebDriver} from "selenium-webdriver";
import {isAdmin} from "../util";

let allowGame = true;

export function isGameAllowed() {
    return allowGame;
}

export default async function (driver: WebDriver, writer: string, message: string) {
    if (message === '종료') {
        if (isAdmin(writer)) {
            await sendMessage(driver, '눈이 녹았어요... 곧 돌아올게요!')
            process.exit(0)
            return true
        } else {
            await sendMessage(driver, '눈의 요정만이 설정을 건드릴 수 있어요...')
            return true
        }
    }
    if (message === '게임 차단') {
        if (isAdmin(writer)) {
            allowGame = false
            await sendMessage(driver, '설정 완료!')
            return true
        } else {
            await sendMessage(driver, '눈의 요정만이 설정을 건드릴 수 있어요...')
            return true
        }
    }
    if (message === '게임 허용') {
        if (isAdmin(writer)) {
            allowGame = true
            await sendMessage(driver, '설정 완료!')
            return true
        } else {
            await sendMessage(driver, '눈의 요정만이 설정을 건드릴 수 있어요...')
            return true
        }
    }
    return false
}
