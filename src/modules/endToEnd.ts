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

let usedSet = new Set<string>()
let kkutuDict: string[] | null = null
const gameTime = 7;
let gameState = GameState.Finished, gameUser: string[] = [], focusedUser: number, loseTimeout: NodeJS.Timeout | null
let lastWord = ''
let gDriver: WebDriver

async function lose() {
    gameState = GameState.Finished
    await sendMessage(gDriver, `${gameUser[focusedUser]}님이 졌어요.....\n게임 종료!`)
    usedSet = new Set<string>()
    gameUser = []
}

function loadDict() {
    const data = fs.readFileSync('./kkutu.txt', {encoding: 'utf8', flag: 'r'});
    let originDict = data.split('\n')
    kkutuDict = []
    // @ts-ignore
    originDict.map(i => kkutuDict.push(i.trim()))
}

async function startGame() {
    gameState = GameState.Playing
    await sendMessage(gDriver, '게임을 시작합니다!')
    focusedUser = _.random(0, gameUser.length - 1)
    await sendMessage(gDriver, `${gameUser[focusedUser]}님의 차례입니다. 시작 단어는 아무거나 해도 돼요!`)
    lastWord = ''
    if (loseTimeout) clearTimeout(loseTimeout)
    loseTimeout = setTimeout(lose, gameTime * 1000)
}

export default async function (driver: WebDriver, writer: string, message: string) {
    if (!kkutuDict) loadDict()
    gDriver = driver
    if (message === '끝말잇기' && gameState === GameState.Finished) {
        if (!isGameAllowed()) {
            await sendMessage(gDriver, '게임을 시작할 수 없어요...')
            return true
        }
        gameUser.push(writer)
        await sendMessage(driver, `끝말잇기!\n${gameTime}초 내로 답변하면 돼요!\n참가할 사람은 10초 내로 "참가"라고 채팅을 쳐주세요.`);
        await sendMessage(driver, `${writer}님 참가!(${gameUser.length}번째 플레이어)`);
        gameState = GameState.WaitingForPlayers;
        setTimeout(startGame, 10000)
        return true
    }
    if (gameState === GameState.WaitingForPlayers && message === '참가' && !gameUser.includes(writer)) {
        gameUser.push(writer)
        await sendMessage(driver, `${writer}님 참가!(${gameUser.length}번째 플레이어)`);
        return true
    }
    if (gameState === GameState.Playing && writer === gameUser[focusedUser]) {
        if (message.length > 1 && (!lastWord || lastWord === message[0]) && kkutuDict?.includes(message.trim())) {
            if (usedSet.has(message.trim())) {
                await sendMessage(driver, `이미 사용한 단어에요...`)
                return true
            }
            lastWord = message[message.length - 1]
            usedSet.add(message.trim())
            focusedUser = (focusedUser + 1) % gameUser.length
            await sendMessage(driver, `성공! ${gameUser[focusedUser]}님의 차례입니다. '${lastWord}'(으)로 시작하는 단어를 입력하세요!`)
            if (loseTimeout) clearTimeout(loseTimeout)
            loseTimeout = setTimeout(lose, gameTime * 1000)
            return true
        } else {
            await sendMessage(driver, `올바르지 않은 단어에요...`)
            return true
        }
    }

    return false
}
