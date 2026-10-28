const video_details = 'video_details'

// 保存 token
export function setDetails(details: string) {
    localStorage.setItem(video_details, details)
}

// 获取 token
export function getDetails(): string | null {
    return localStorage.getItem(video_details)
}
// // 删除 token
// export function removeToken() {
//   localStorage.removeItem(TOKEN_KEY)
// }


