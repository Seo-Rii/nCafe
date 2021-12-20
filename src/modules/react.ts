import {sendMessage} from "../react";
import {WebDriver} from "selenium-webdriver";

const reactSet = new Map<string, string>()

export default async function (driver: WebDriver, writer: string, message: string) {
    if (message.split(' ')[0] === '반응추가') {
        const target = message.split(' ')[1], replace = message.split(' ').slice(2).join(' ')
        reactSet.set(target, replace)
        await sendMessage(driver, '반응이 추가되었어요!')
        return true
    }
    if (message.split(' ')[0] === '반응삭제') {
        const target = message.split(' ')[1]
        if (!reactSet.has(target)) {
            await sendMessage(driver, '삭제할 반응이 없어요!')
            return true
        }
        reactSet.delete(target)
        await sendMessage(driver, '반응이 삭제되었어요!')
        return true
    }
    if (reactSet.has(message)) {
        const replace = reactSet.get(message) as string
        await sendMessage(driver, replace)
        return true
    }
    return false
}
