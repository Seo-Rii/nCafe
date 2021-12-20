import {sendMessage} from "../react";
import {WebDriver} from "selenium-webdriver";
import _ from 'lodash'

enum GameState {
    WaitingForPlayers,
    Playing,
    Finished
}

const gamePlayerCount = 4;
let gameState = GameState.Finished, gameUser: string[] = [], focusedUser: string

export default async function (driver: WebDriver, writer: string, message: string) {
    if (message === '테스트 게임' && gameState === GameState.Finished) {
        gameUser.push(writer)
        await sendMessage(driver, '테스트 게임을 시작할게요!\n참가할 사람은 "참가"라고 채팅을 쳐주세요.');
        await sendMessage(driver, `${writer}님 참가!(${gameUser.length}/${gamePlayerCount})`);
        gameState = GameState.WaitingForPlayers;
        return true
    }
    if (gameState === GameState.WaitingForPlayers && message === '참가' && !gameUser.includes(writer)) {
        gameUser.push(writer)
        await sendMessage(driver, `${writer}님 참가!(${gameUser.length}/${gamePlayerCount})`);
        if (gameUser.length === gamePlayerCount) {
            gameState = GameState.Playing
            await sendMessage(driver, '게임을 시작합니다!')
            await sendMessage(driver, '게임이 종료되었어요!')
            gameState = GameState.Finished
            gameUser = []
        }
        return true
    }

    return false
}
