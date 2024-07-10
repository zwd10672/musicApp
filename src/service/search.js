import { get } from './base'

// 封装热门搜索api
export function getHotKeys () {
  return get('/api/getHotKeys')
}

// 封装搜索结果列表api
export function search (query, page, showSinger) {
  return get('/api/search', {
    query,
    page,
    showSinger
  })
}
