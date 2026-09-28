const TOKEN_KEY = 'access_token'

// 保存 token
export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

// 获取 token
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

// 删除 token
export function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
}