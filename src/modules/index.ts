import {WebDriver} from "selenium-webdriver";

import module1 from './hello'
import module2 from './exit'
import moduleReact from './react'

import moduleGame1 from './testGame'

export default async function (driver: WebDriver, writer: string, message: string) {
    if (await module1(driver, writer, message)) return
    if (await module2(driver, writer, message)) return

    if (await moduleGame1(driver, writer, message)) return

    if (await moduleReact(driver, writer, message)) return
}
