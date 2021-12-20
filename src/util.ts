export const adminID = 'PPTSTUDIO'
export const chatURL = 'https://talk.cafe.naver.com/channels/953270669329';

export async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


export function isAdmin(writer: string) {
    return writer === adminID
}
