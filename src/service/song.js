import { get } from './base'

export function processSongs (songs) {
  // 根据返回的songs的长度判断是否要返回歌曲的url地址
  if (!songs.length) {
    return Promise.resolve(songs)
  }
  // 获取歌曲的url地址
  return get('/api/getSongsUrl', {
    // 返回song对应的mid
    mid: songs.map((song) => {
      return song.mid
    })
  }).then((result) => {
    const map = result.map
    // 在songs中遍历song
    return songs.map((song) => {
      // 根据song.mid返回对应的song.url
      song.url = map[song.mid]
      return song
      // 过滤不能播放的url
    })
      .filter((song) => {
        // 根据歌曲的url地址判断里面是否还有vkey，如果有的话说明该歌曲可播放，没有的话说明该歌曲为加密的
        return song.url.indexOf('vkey') > -1
      })
  })
}
// 获取当前歌曲的歌词
const lyricMap = {}

export function getLyric (song) {
  if (song.lyric) {
    return Promise.resolve(song.lyric)
  }
  const mid = song.mid
  const lyric = lyricMap[mid]
  if (lyric) {
    return Promise.resolve(lyric)
  }
  return get('/api/getLyric', {
    mid
  }).then((result) => {
    const lyric = result ? result.lyric : '[00.00.00]当前歌曲无法获取歌词'
    return lyric
  })
}
