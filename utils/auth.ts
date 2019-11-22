const tokenName = 'authToken'
const loginPath = '/login'
const Cookie = require('js-cookie')

/**
 * @return {(string|null)} the auth token if found, null otherwise
 */
const getLocalToken = function getLocalToken(): string | null {
  return (
    (window as any).localStorage.getItem(tokenName) ||
    document.cookie.split(';').find(c => c.trim().startsWith('jwt='))
  )
}

/**
 *
 * @param {*} token
 * @return {undefined} void return
 */
const setLocalToken = function setLocalToken(token: any): void {
  window.localStorage.setItem(tokenName, token)
}

/**
 *
 * @return {object} void return
 */
const decodeLocalToken = function decodeLocalToken():
  | { iat: number; userId: number }
  | undefined {
  const token = getLocalToken()
  if (token) {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(window.atob(base64))
  }
}
// const decodeToken = function decodeToken(
//   token
// ): { iat: number; userId: number } | undefined {
//   if (token) {
//     const base64Url = token.split('.')[1]
//     const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
//     return JSON.parse()
//   }
// }

const getTokenUserId = function getTokenUserId() {
  const user = decodeLocalToken()
  if (user) {
    return user.userId
  }
}
/**
 *
 * @return {undefined} void return
 */
const deleteLocalToken = function deleteLocalToken(): void {
  window.localStorage.removeItem(tokenName)
}

const logUserOut = function logUserOut(vm: any): void {
  deleteLocalToken()
  vm.$router.push({ path: loginPath })
}

/**
 *
 * @return {boolean} True if user is logged in, false otherwise
 */
const isLoggedIn = function isLoggedIn(): boolean {
  return Boolean(getLocalToken())
}

export default {
  deleteLocalToken,
  getLocalToken,
  decodeLocalToken,
  isLoggedIn,
  logUserOut,
  setLocalToken,
  getTokenUserId
}
