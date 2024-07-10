import { PLAY_MODE, SEARCH1_KEY } from '@/assets/js/constant'
import { load } from '@/assets/js/array-store'
const state = {
  sequenceList: [],
  playlist: [],
  playing: false,
  playMode: PLAY_MODE.sequence,
  currentIndex: 0,
  fullScreen: false,
  // 已收藏歌曲
  favoriteList: [],
  searchHistory: load(SEARCH1_KEY),
  playHistory: []
}

export default state
