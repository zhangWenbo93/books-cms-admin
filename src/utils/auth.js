import Cookies from 'js-cookie'
import { Base64 } from 'js-base64'

const TokenKey = 'Admin-Token'

export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(token) {
    return Cookies.set(TokenKey, token)
}

export function removeToken() {
    return Cookies.remove(TokenKey)
}

export function _encode() {
    const token = getToken()
    const base64 = Base64.encode(`${token}:`)
    return `Basic ${base64}`
}
