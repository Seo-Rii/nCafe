import {WebDriver} from "selenium-webdriver";

import module1 from './hello'
import module2 from './setting'
import module3 from './wiki'
import moduleReact from './react'

import moduleGame1 from './testGame'
import moduleGame2 from './endToEnd'
import moduleGame3 from './upDown'

export default async function (driver: WebDriver, writer: string, message: string) {
    if (await moduleGame2(driver, writer, message)) return
    if (await moduleGame3(driver, writer, message)) return
    if (await moduleGame1(driver, writer, message)) return

    if (await module1(driver, writer, message)) return
    if (await module2(driver, writer, message)) return
    if (await module3(driver, writer, message)) return

    if (await moduleReact(driver, writer, message)) return
}
