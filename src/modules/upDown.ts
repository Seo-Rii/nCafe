import {sendMessage} from "../react";
import {WebDriver} from "selenium-webdriver";
import _ from 'lodash'
import * as fs from 'fs'
import {isGameAllowed} from "./setting";

enum GameState {
    WaitingForPlayers,
    Playing,
    Finished
}

let gameState = GameState.Finished, target = 0
let gDriver: WebDriver

export default async function (driver: WebDriver, writer: string, message: string) {
    gDriver = driver
    if (message === '업다운' && gameState === GameState.Finished) {
        if (!isGameAllowed()) {
            await sendMessage(gDriver, '게임을 시작할 수 없어요...')
            return true
        }
        gameState = GameState.Playing
        target = Math.floor(Math.random() * 100) + 1;
        await sendMessage(driver, `업다운!\n1부터 100사이 숫자를 맞추세요!\n지금부터 시작!`);
        return true
    }
    if (gameState === GameState.Playing) {
        // @ts-ignore
        if (!isNaN(message)) {
            let num: number = parseInt(message)
            if (num === target) {
                await sendMessage(driver, `정답!\n${writer}님이 이겼어요!`);
                gameState = GameState.Finished
                return true
            }
            if (num > target) {
                await sendMessage(driver, `커요!`);
                return true
            }
            if (num < target) {
                await sendMessage(driver, `작아요!`);
                return true
            }
        }
    }

    return false
}
