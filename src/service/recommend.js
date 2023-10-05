import { get } from './base.js'

export const getRecommend = () => {
  return get('/api/getRecommend')
}
