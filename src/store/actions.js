import { PLAY_MODE } from '@/assets/js/constant'
import { shuffle } from '@/assets/js/util'

export function selectPlay ({ commit }, { list, index }) {
  commit('setPlayMode', PLAY_MODE.sequence)
  commit('setSequenceList', list)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
  commit('setPlaylist', list)
  commit('setCurrentIndex', index)
}

export function randomPlay ({ commit }, list) {
  commit('setPlayMode', PLAY_MODE.random)
  commit('setSequenceList', list)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
  commit('setPlaylist', shuffle(list))
  commit('setCurrentIndex', 0)
}
// 改变播放器状态
export function changeMode ({ commit, state, getters }, mode) {
  const currentId = getters.currentSong.id
  if (mode === PLAY_MODE.random) {
    commit('setPlaylist', shuffle(state.sequenceList))
  } else {
    commit('setPlaylist', state.sequenceList)
  }
  const index = state.playlist.findIndex((song) => {
    return song.id === currentId
  })

  commit('setCurrentIndex', index)
  commit('setPlayMode', mode)
}

export function removeSong ({ commit, state }, song) {
  // 通过slice将sequencelist和playlist复制一份
  const sequenceList = state.sequenceList.slice()
  const playlist = state.playlist.slice()
  // 拿到操作项的索引
  const sequenceIndex = findIndex(sequenceList, song)
  const playIndex = findIndex(playlist, song)
  // 防止同一首歌被多次点击
  if (playIndex < 0 || sequenceIndex < 0) {
    return
  }
  sequenceList.splice(sequenceIndex, 1)
  playlist.splice(playIndex, 1)
  let currentIndex = state.currentIndex
  if (playIndex < currentIndex || currentIndex === playlist.length) {
    currentIndex--
  }

  commit('setSequenceList', sequenceList)
  commit('setPlaylist', playlist)
  commit('setCurrentIndex', currentIndex)
  if (!playlist.length) {
    commit('setPlayingState', false)
  }
}

// 清空当前播放列表
export function clearSongList ({ commit }) {
  commit('setSequenceList', [])
  commit('setPlaylist', [])
  commit('setCurrentIndex', 0)
  commit('setPlayingState', false)
}

// 搜索页添加歌曲
export function addSong ({ commit, state }, song) {
  const playlist = state.playlist.slice()
  const sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  const playIndex = findIndex(playlist, song)
  // 如果playIndex > -1 说明playlist中含有这一项，让当前播放歌曲的索引等于这一项
  if (playIndex > -1) {
    currentIndex = playIndex
  } else {
    // 如果没有的话，就在playlist末尾添加这一项，
    playlist.push(song)
    currentIndex = playlist.length - 1
  }
  // 遍历每一项，拿到索引
  const sequenceIndex = findIndex(sequenceList, song)
  // 如果索引为-1，则表示列表没有这一项，应添加至列表
  if (sequenceIndex === -1) {
    sequenceList.push(song)
  }
  // 提交commit事件
  commit('setSequenceList', sequenceList)
  commit('setCurrentIndex', currentIndex)
  commit('setPlaylist', playlist)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
}
// 封装一个公用函数
function findIndex (list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}
