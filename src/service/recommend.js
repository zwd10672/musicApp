import { get } from './base.js'

export const getRecommend = () => {
  return get('/api/getRecommend')
}

// 推荐歌单内容
export function getAlbum (album) {
  return get('/api/getAlbum', {
    id: album.id
  })
}
